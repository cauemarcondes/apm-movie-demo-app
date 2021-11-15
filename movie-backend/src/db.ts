import Kenex from "knex";
import { resolve } from "path/posix";
import { dbConfig } from "./config/db";
import { MovieNotFoundError } from "./errors";
import { Director, Genre, Movie } from "./typings";
import apm from "elastic-apm-node";

const knex = Kenex(dbConfig);

async function slowAndComplexLogic() {
  // const customSpan = apm.startSpan("slowAndComplexLogic");
  // await new Promise((resolve) => {
  //   setTimeout(resolve, 3000);
  // });
  // customSpan.end();
}

// fetch all genres
export async function fetchGenres(params?: {
  name?: string;
}): Promise<Genre[]> {
  let genre_q = knex<Genre[]>("genre").select("id", "name");
  if (params?.name) {
    genre_q = addParam(genre_q, "name", params.name);
  }
  const genres = await genre_q;
  return genres || [];
}

// fetch directors that match given params
export async function fetchDirectors(params?: {
  names?: string[];
}): Promise<Director[]> {
  let director_q = knex<Director[]>("director").select("id", "name");
  if (params?.names) {
    director_q = addParam(director_q, "name", params.names);
  }
  const directors = await director_q;
  return directors || [];
}

// supported query parameters are `genre` and `director`
// N+1 db query example
// comment this out in favor of the commented method below for fixing the N+1 issue
export async function fetchMoviesNPlus1(params?: {
  genre?: string;
  directors?: string[];
}): Promise<Movie[]> {
  const fetchMoviesSpan = apm.startSpan("fetchMoviesNPlus1");
  await slowAndComplexLogic();
  // fetch genre_ids
  const genres = await fetchGenres({ name: params?.genre });
  const genresIds = genres.map((g) => g.id);

  // fetch director_ids
  const directors = await fetchDirectors({ names: params?.directors });
  const directorsIds = directors.map((d) => d.id);

  // only return movies with matching genre_id and director_id
  let movies: Movie[] = [];
  for (const genre_id of genresIds) {
    for (const director_id of directorsIds) {
      let m = await knex<Movie[]>("movie")
        .join("genre", "movie.genre_id", "=", "genre.id")
        .join("director", "movie.director_id", "=", "director.id")
        .select({
          title: "movie.title",
          genre: "genre.name",
          director: "director.name",
        })
        .where("movie.genre_id", genre_id)
        .where("movie.director_id", director_id);
      movies = movies.concat(m);
    }
  }
  raiseErrorIfEmpty(movies, params);
  fetchMoviesSpan.end();
  return movies;
}

// fetchMovies from the database
// uncomment this for solving the N+1 problem
// supported query parameters are `genre` and `director`
export async function fetchMovies(params?: {
  genre?: string;
  directors?: string[];
}): Promise<Movie[]> {
  const fetchMoviesSpan = apm.startSpan("fetchMovies");

  await slowAndComplexLogic();

  let q = knex<Movie[]>("movie")
    .join("genre", "movie.genre_id", "=", "genre.id")
    .join("director", "movie.director_id", "=", "director.id")
    .select({
      title: "movie.title",
      genre: "genre.name",
      director: "director.name",
    });
  if (params?.genre) {
    q = q.whereIn(
      "movie.genre_id",
      addParam(knex("genre").select("id"), "name", params.genre)
    );
  }
  if (params?.directors) {
    q = q.whereIn(
      "movie.director_id",
      addParam(knex("director").select("id"), "name", params.directors)
    );
  }
  const movies = await q;
  raiseErrorIfEmpty(movies, params);
  fetchMoviesSpan.end();
  return movies;
}

function addParam(query: any, key: any, val: any) {
  if (Array.isArray(val)) {
    return query.whereIn(key, val);
  }
  return query.where(key, val);
}

function raiseErrorIfEmpty(movies: Movie[], params: any) {
  if (movies.length === 0) {
    let query = "";
    let concatenator = "";
    for (const p in params) {
      query += `${concatenator}${p}=${params[p]}`;
      concatenator = "&";
    }
    throw new MovieNotFoundError(query);
  }
}

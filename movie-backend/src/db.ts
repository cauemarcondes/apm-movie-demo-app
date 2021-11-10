import Kenex from "knex";

const knex = Kenex({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "caue", // replace with your mysql user
    password: "caue123", // replace with your mysql user password
    database: "moviedemo",
  },
});

// fetch all genres
export async function fetchGenre() {
  return await knex("genre").select("name");
}

// fetch directors that match given params
export async function fetchDirector() {
  return await knex("director").select("name");
}

// supported query parameters are `genre` and `director`
// N+1 db query example
// comment this out in favor of the commented method below for fixing the N+1 issue
export async function fetchMovie(params: any) {
  // fetch genre_ids
  let genres = [];
  let genre_q = knex("genre").select("id");
  if (params.genre) {
    genre_q = addParam(genre_q, "name", params.genre);
  }
  genres = await genre_q;
  genres = genres.map((g: any) => g.id);

  // fetch director_ids
  let directors = [];
  let director_q = knex("director").select("id");
  if (params.director) {
    director_q = addParam(director_q, "name", params.director);
  }
  directors = await director_q;
  directors = directors.map((d: any) => d.id);

  // only return movies with matching genre_id and director_id
  let movies: any = [];
  for (const genre_id of genres) {
    for (const director_id of directors) {
      let m = await knex("movie")
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
  return movies;
}

// // fetchMovies from the database
// // uncomment this for solving the N+1 problem
// // supported query parameters are `genre` and `director`
// async function fetchMovie(params) {
//     let q = knex('movie')
//         .join('genre', 'movie.genre_id', '=', 'genre.id')
//         .join('director', 'movie.director_id', '=', 'director.id')
//         .select({ title: 'movie.title', genre: 'genre.name', director: 'director.name' })
//     if (params.genre) {
//         q = q.whereIn('movie.genre_id',
//             addParam(knex('genre').select('id'), 'name', params.genre))
//     }
//     if (params.director) {
//         q = q.whereIn('movie.director_id',
//             addParam(knex('director').select('id'), 'name', params.director))
//     }
//     const movies = await q
//     raiseErrorIfEmpty(movies, params)
//     return movies
// }

function addParam(query: any, key: any, val: any) {
  if (Array.isArray(val)) {
    return query.whereIn(key, val);
  }
  return query.where(key, val);
}

function raiseErrorIfEmpty(movies: any, params: any) {
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

export class MovieNotFoundError extends Error {
  constructor(params: any) {
    super(`No movies found for ${params}`);
    this.name = "MovieNotFoundError";
  }
}

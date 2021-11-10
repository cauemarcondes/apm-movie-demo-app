import axios from "axios";
import React, { useState, useEffect } from "react";
import type { IMovie } from "../typings";
import qs from "qs";

interface Props {
  genre?: string;
  directors?: string[];
}

async function fetchMovies(params: Props) {
  const { data: movies } = await axios.get<IMovie[]>("/movies", {
    params: { genre: params.genre, directors: params.directors },
    paramsSerializer: (params) => {
      return qs.stringify(params);
    },
  });
  return movies;
}

export default function Movie({ genre, directors }: Props) {
  const [error, setError] = useState<Error | undefined>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [movies, setMovies] = useState<IMovie[]>([]);

  useEffect(() => {
    async function callFetchMovies() {
      setIsLoaded(true);
      setMovies([]);
      try {
        const movies = await fetchMovies({ genre, directors });
        setMovies(movies);
      } catch (e) {
        setError(e as Error);
      }
      setIsLoaded(false);
    }
    callFetchMovies();
  }, [genre, directors]);

  if (error) {
    return <div>An error occured: {error.message} </div>;
  }

  if (isLoaded) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      <style>{`
        table,td,th{border:1px solid black}
        table{width:100%;border-collapse:collapse}
      `}</style>
      <table>
        <thead>
          <tr>
            <th>Movie</th>
            <th>Genre</th>
            <th>Director</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr key={index}>
              <td>{movie.title}</td>
              <td>{movie.genre}</td>
              <td>{movie.director}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

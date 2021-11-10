import axios from "axios";
import React, { useState, useEffect } from "react";

async function fetchGenres() {
  const { data: genres } = await axios.get<string[]>("/genres");
  return genres;
}

export default function Genre({ onChange }: any) {
  const [error, setError] = useState<Error | undefined>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    // fetch types from backend
    async function callFetchGenres() {
      setIsLoaded(true);
      try {
        const genres = await fetchGenres();
        setGenres(genres);
      } catch (e) {
        setError(e as Error);
      }
      setIsLoaded(false);
    }
    callFetchGenres();
  }, []);

  // react on change
  const handleChange = (input: any) => {
    onChange(input.currentTarget.value);
  };

  if (error) {
    return <div>An error occured: {error.message} </div>;
  }

  if (isLoaded) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      {genres.map((genre, index) => (
        <div key={index}>
          <input
            type="radio"
            name="genre"
            value={genre}
            onChange={handleChange}
          />
          <label>{genre}</label>
        </div>
      ))}
    </div>
  );
}

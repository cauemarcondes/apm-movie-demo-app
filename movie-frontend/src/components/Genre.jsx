import React, { useState, useEffect } from "react";

function Genre({ onChange }) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // fetch types from backend
    fetch("/genres")
      .then((res) => {
        return res.json();
      })
      .then(
        (res) => {
          setGenres(res);
          setIsLoaded(true);
        },
        (error) => {
          setError(error);
          setIsLoaded(true);
        }
      );
  }, []);

  // react on change
  const handleChange = (input) => {
    onChange(input.currentTarget.value);
  };

  if (error) {
    return <div>An error occured: {error.message} </div>;
  } else if (!isLoaded) {
    return <div>Loading ...</div>;
  } else {
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
            <label for={genre}>{genre}</label>
          </div>
        ))}
      </div>
    );
  }
}

export default Genre;

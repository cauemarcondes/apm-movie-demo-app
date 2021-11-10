import React, { useState, useEffect } from 'react';

function Movie({ genre, directors }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // // clear state
    setMovies([])

    // build URL with query string parameters
    let url = "/movies"
    let concatenator = "?"
    if (genre) {
      url += `${concatenator}genre=${genre}`
      concatenator = "&"
    }
    directors.forEach(director => {
      url += `${concatenator}director=${director}`
      concatenator = "&"
    })

    // fetch movies from backend
    fetch(url)
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        setMovies(res)
      })
  }, [genre, directors]);

  return (
    <div>
      <style>{`
        table,td,th{border:1px solid black}
        table{width:100%;border-collapse:collapse}
      `}</style>
      <table>
        <thead>
          <tr>
            <th>Movie</th><th>Genre</th><th>Director</th>
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
  )
}

export default Movie;
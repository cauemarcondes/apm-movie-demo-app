import React, { useState } from 'react';
import Director from './Director';
import Genre from './Genre';
import Movie from './Movie';


function MovieList() {

  const [genre, setGenre] = useState(null)
  const [directors, setDirectors] = useState([])


  return (
    <div>
      <Genre onChange={setGenre} />
      <Director onChange={setDirectors} />
      <Movie genre={genre} directors={directors} />
    </div>
  );
}

export default MovieList;
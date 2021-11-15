import React, { useState } from "react";
import Director from "./Director";
import Genre from "./Genre";
import Movie from "./Movie";
//@ts-ignore
import { withTransaction } from "@elastic/apm-rum-react";

function MovieList() {
  const [genre, setGenre] = useState<string | undefined>();
  const [directors, setDirectors] = useState<string[]>([]);

  return (
    <div>
      <Genre onChange={setGenre} />
      <Director onChange={setDirectors} />
      <Movie genre={genre} directors={directors} />
    </div>
  );
}

// export default MovieList;
export default withTransaction("MovieList", "component")(MovieList);

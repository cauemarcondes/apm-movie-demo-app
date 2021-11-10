import express from "express";

// showcase example app with automatic instrumentation
import genreRouter from "./api/genres";
import directorsRouter from "./api/directors";
import { moviesRouter, ParamsNotAllowedError } from "./api/movies";

const app = express();
const port = 3001;

app.use("/genres", genreRouter);
app.use("/directors", directorsRouter);
app.use("/movies", moviesRouter);

// then register any other middleware error handlers
function errorHandler(err: any, req: any, res: any, next: any) {
  if (err instanceof ParamsNotAllowedError) {
    res.status(400);
  } else if (res.status) {
    // catch all
    res.status(500);
  }
  res.json({ error: err.message });
}
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

import express, { Request, Response } from "express";
import directorsRouter from "./api/directors";
// showcase example app with automatic instrumentation
import genreRouter from "./api/genres";
import { moviesRouter, ParamsNotAllowedError } from "./api/movies";

const app = express();
const port = 3001;

app.use("/genres", genreRouter);
app.use("/directors", directorsRouter);
app.use("/movies", moviesRouter);

// then register any other middleware error handlers
function errorHandler(err: Error, req: Request, res: Response) {
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

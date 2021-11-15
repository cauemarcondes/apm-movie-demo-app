// Add this to the VERY top of the first file loaded in your app
var apm = require("elastic-apm-node").start({
  // Set the custom APM Server URL (default: http://localhost:8200)
  serverUrl:
    "https://84124e3c7d844cf09bdd3cd10a3a262a.apm.us-central1.gcp.cloud.es.io:443",
  // Set the service environment
  environment: "production",
  serviceVersion: "1.0",
});
import express, { Request, Response, NextFunction } from "express";
import directorsRouter from "./api/directors";
import genreRouter from "./api/genres";
import { moviesRouter } from "./api/movies";
import { ParamsNotAllowedError } from "./errors";

const app = express();
const port = 3001;

app.use("/genres", genreRouter);
app.use("/directors", directorsRouter);
app.use("/movies", moviesRouter);

// then register any other middleware error handlers
function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("### caue ~ err", err);
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

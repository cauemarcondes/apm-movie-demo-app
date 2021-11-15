import { Router, query } from "express";
import { fetchMovies, fetchMoviesNPlus1 } from "../db";
import { MovieNotFoundError, ParamsNotAllowedError } from "../errors";
import apm from "elastic-apm-node";

const router = Router();

router.get("/", async (request, response, next) => {
  apm.setTransactionName("GET /movies");
  try {
    // only allow one genre to be requested
    if (Array.isArray(request.query.genre)) {
      throw new ParamsNotAllowedError("Only one genre allowed");
    }

    // fake a server side error for demo purposes
    console.log("### caue ~ request.query.genre", request.query.genre);
    if (request.query.genre && request.query.genre === "fail") {
      throw `Server temporarily not available`;
    }
    if (request.query.genre) {
      apm.setLabel("genre", request.query.genre.toString());
    }

    // const movies = await fetchMoviesNPlus1(request.query);

    // uncomment this for solving the N+1 problem
    const movies = await fetchMovies(request.query);
    return response.json(movies);
  } catch (err) {
    if (err instanceof MovieNotFoundError) {
      apm.captureError(err);
      return response.json([]);
    }
    next(err);
  }
});

export { router as moviesRouter };

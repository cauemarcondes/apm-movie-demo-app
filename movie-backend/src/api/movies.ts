import { Router, query } from "express";
import { fetchMovies, fetchMoviesNPlus1, MovieNotFoundError } from "../db";
import url from "url";

const router = Router();

router.get("/", async (request, response, next) => {
  try {
    // only allow one genre to be requested
    if (Array.isArray(request.query.genre)) {
      throw new ParamsNotAllowedError("Only one genre allowed");
    }
    const movies = await fetchMoviesNPlus1(request.query);
    // uncomment this for solving the N+1 problem
    // const movies = await fetchMovies(request.query);
    return response.json(movies);
  } catch (err) {
    if (err instanceof MovieNotFoundError) {
      return response.json([]);
    }
    next(err);
  }
});

export class ParamsNotAllowedError extends Error {
  constructor(msg: any) {
    super(msg);
    this.name = "ParamsNotAllowedError";
  }
}

export { router as moviesRouter };

import { Router, query } from "express";
import * as db from "../db";
import url from "url";

const router = Router();

router.get("/", async (request, response, next) => {
  try {
    // only allow one genre to be requested
    if (Array.isArray(request.query.genre)) {
      throw new ParamsNotAllowedError("Only one genre allowed");
    }
    const movies = await db.fetchMovie(request.query);
    return response.json(movies);
  } catch (err) {
    if (err instanceof db.MovieNotFoundError) {
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

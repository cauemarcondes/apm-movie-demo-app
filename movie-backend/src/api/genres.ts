import { Router } from "express";
import { fetchGenres } from "../db";

const router = Router();

router.get("/", async (request, response, next) => {
  try {
    let genres = await fetchGenres();
    return response.json(genres.map((g) => g.name));
  } catch (err) {
    next(err);
  }
});

export default router;

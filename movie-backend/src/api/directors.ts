import { Router } from "express";
import { fetchDirectors } from "../db";

const router = Router();

router.get("/", async (request, response, next) => {
  try {
    const directors = await fetchDirectors();
    return response.json(directors.map((d) => d.name));
  } catch (err) {
    next(err);
  }
});

export default router;

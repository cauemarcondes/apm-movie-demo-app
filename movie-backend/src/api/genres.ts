import { Router } from "express";
import * as db from "../db";

const router = Router();

router.get("/", async (request, response, next) => {
  try {
    let genres = await db.fetchGenre();
    return response.json(genres.map((g: any) => g.name));
  } catch (err) {
    next(err);
  }
});

export default router;

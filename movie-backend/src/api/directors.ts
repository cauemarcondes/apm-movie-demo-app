import { Router } from "express";
import * as db from "../db";

const router = Router();

router.get("/", async (request, response, next) => {
  try {
    const directors = await db.fetchDirector();
    return response.json(directors.map((d: any) => d.name));
  } catch (err) {
    next(err);
  }
});

export default router;

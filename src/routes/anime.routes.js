import express from "express";
import upload from "../middleware/upload.js";
import { createAnimeController, getAnimeController } from "../controllers/anime.controller.js"

const router = express.Router();

router.post("/", upload.single("file"), (req, res) => createAnimeController(req, res));
router.get("/", (req, res) => getAnimeController(req, res));

export default router;

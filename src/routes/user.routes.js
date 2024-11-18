import express from "express";
import authJwt from "../middleware/authJwt.js";
import { getUserController } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", authJwt, (req, res) => getUserController(req, res));

export default router;

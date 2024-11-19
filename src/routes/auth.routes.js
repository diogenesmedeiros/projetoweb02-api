import express from "express";
import { loginController, registerController } from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/login", (req, res) => loginController(req, res));
router.post("/register", (req, res) => registerController(req, res));

export default router;

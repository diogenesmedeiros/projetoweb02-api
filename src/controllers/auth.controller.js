import { body, validationResult } from "express-validator";
import { loginService, registerService } from "../services/auth.service.js";

export const loginController = async (req, res) => {
  try {
    await Promise.all([
      body("email").isString().trim().escape().notEmpty().run(req),
      body("password").isString().trim().escape().notEmpty().run(req),
    ]);

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Esses campos estão vazios",
      });
    }

    const { email, password } = req.body;

    const validation = await loginService(email, password);

    return res.status(validation.code).json(validation);
  } catch (error) {
    console.error("Erro ao logar user:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao logar user.",
    });
  }
};

export const registerController = async (req, res) => {
  try {
    await Promise.all([
      body("name").isString().trim().escape().notEmpty().run(req),
      body("email").isString().trim().escape().notEmpty().run(req),
      body("password").isString().trim().escape().notEmpty().run(req),
      body("anime_preference")
      .isArray().withMessage("Deve ser um array.")
      .notEmpty().withMessage("O array não pode estar vazio.")
      .custom((array) => array.every(item => typeof item === "string"))
      .withMessage("Todos os itens devem ser strings.")
      .run(req),
    ]);

    const error = validationResult(req);
    if (!error.isEmpty()) {
      console.log(error)
      return res.status(400).json({
        status: "error",
        message: "Esses campos estão vazios",
      });
    }

    const { name, email, password, anime_preference } = req.body;

    const create = await registerService(
      name,
      email,
      password,
      anime_preference
    );

    return res.status(create.code).json(create);
  } catch (error) {
    console.error("Erro ao criar user:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao criar user.",
    });
  }
};

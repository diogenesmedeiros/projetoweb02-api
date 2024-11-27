import { body, validationResult } from "express-validator";
import { loginService, registerService } from "../services/auth.service.js";
import { findAnimeByIdOrTitle, createAnimeService } from "../services/anime.service.js"

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
      body("anime_preference").optional().notEmpty().run(req),
    ]);

    const error = validationResult(req);
    if (!error.isEmpty()) {
      console.log(error);
      return res.status(400).json({
        status: "error",
        message: "Esses campos estão vazios",
      });
    }

    const { name, email, password, anime_preference } = req.body;

    let animePreferencesArray = [];
    if (typeof anime_preference === "string") {
      animePreferencesArray = anime_preference
        .split(",")
        .map((item) => item.trim());
    } else if (Array.isArray(anime_preference)) {
      animePreferencesArray = anime_preference.map((item) =>
        String(item).trim()
      );
    } else {
      return res.status(400).json({
        status: "error",
        message: "O campo anime_preference deve ser uma string ou um array.",
      });
    }

    for (let i = 0; i < animePreferencesArray.length; i++) {
      const preference = animePreferencesArray[i];
      let anime = await findAnimeByIdOrTitle(preference);

      if (!anime) {
        const response = await createAnimeService(preference, null);

        if (response.status === "error") {
          return res.status(400).json({
            status: "error",
            message: `Erro ao registrar o anime: ${preference}.`,
          });
        }

        anime = await findAnimeByIdOrTitle(preference);

        if (!anime) {
          return res.status(500).json({
            status: "error",
            message: `Erro interno ao buscar o anime criado: ${preference}.`,
          });
        }
      }

      animePreferencesArray[i] = anime.id;
    }

    const create = await registerService(
      name,
      email,
      password,
      animePreferencesArray
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

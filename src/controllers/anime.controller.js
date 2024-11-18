import { createAnimeService, getAnimeService } from "../services/anime.service.js";

export const createAnimeController = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Os campos titulo e o arquivo de capa são obrigatórios.",
      });
    }

    const anime = await createAnimeService(title, req.file);

    return res.status(anime.code).json(anime);
  } catch (error) {
    console.error("Erro ao criar anime:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao criar anime.",
    });
  }
};

export const getAnimeController = async (req, res) => {
  try {
    const anime = await getAnimeService();

    return res.status(anime.code).json(anime);
  } catch (error) {
    console.error("Erro ao busca animes:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao criar anime.",
    });
  }
};

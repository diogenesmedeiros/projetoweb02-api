import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import handleResponse from "../middleware/handleResponse.js";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const uploadCover = async (file, fileName) => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    if (!file.buffer) {
      throw new Error("O arquivo não contém dados válidos.");
    }

    const { data, error } = await supabase.storage
      .from("animes-cover")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error("Erro ao fazer upload:", error);
      throw new Error("Erro ao fazer upload da imagem.");
    }

    if (data) {
      console.log("Arquivo enviado com sucesso:", data);
    }

    const publicUrl = `https://wftmarkvdjxisqailfkf.supabase.co/storage/v1/object/public/animes-cover/${data.path}`;

    return publicUrl;
  } catch (error) {
    throw new Error("Erro ao fazer upload da imagem." + error);
  }
};

export const createAnimeService = async (title, coverFile) => {
  try {
    let coverUrl = "https://marketplace.canva.com/EAFSIls90sE/1/0/1600w/canva-meme-gatinho-frase-engra%C3%A7ada-moderno-branco-YTup4mHeHQI.jpg";

    if (coverFile != null) {
      const fileName = `${title.replace(/ /g, "_")}_${Date.now()}-${
        coverFile.originalname
      }`;

      coverUrl = await uploadCover(coverFile, fileName);
    }

    const row = await prisma.anime.create({
      data: {
        title,
        cover: coverUrl,
      },
    });

    return handleResponse(201, "success", "Anime adicionado com sucesso!", {
      anime: { id: row.id },
    });
  } catch (error) {
    console.log(error);
    return handleResponse(
      400,
      "error",
      "Não foi possivel adicionar o anime, verifique os dados e tente novamente!"
    );
  }
};

export const findAnimeByIdOrTitle = async (idOrTitle) => {
  try {
    let anime = null;

    if (typeof idOrTitle === "string") {
      anime = await prisma.anime.findUnique({
        where: {
          id: idOrTitle,
        },
      });
    }

    if (!anime) {
      anime = await prisma.anime.findUnique({
        where: {
          title: idOrTitle,
        },
      });
    }

    if (!anime) {
      return null;
    }

    return anime;
  } catch (error) {
    return handleResponse(
      400,
      "error",
      "Não foi possível buscar os animes, tente novamente!"
    );
  }
};

export const getAnimeService = async () => {
  try {
    const animes = await prisma.anime.findMany();

    if (animes.length <= 0) {
      return handleResponse(
        404,
        "error",
        "Não existe nenhum anime ainda adicionado"
      );
    }

    return handleResponse(200, "success", null, { animes: animes });
  } catch {
    return handleResponse(
      400,
      "error",
      "Não foi possivel busca os animes, tente novamente!"
    );
  }
};

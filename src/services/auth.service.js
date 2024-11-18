import { PrismaClient } from "@prisma/client";
import handleResponse from "../middleware/handleResponse.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export const registerService = async (name, email, password, animes) => {
  try {
    await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: password,
        },
      });

      await prisma.animePreferences.createMany({
        data: animes.map((animeId) => ({
          userId: user.uuid,
          animeId: animeId,
        })),
      });

      return user;
    });

    return handleResponse(201, "success", "Usuário criado com sucesso");
  } catch (error) {
    return handleResponse(500, "error", "Erro interno, tente novamente");
  }
};

export const loginService = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
        password: password,
      },
    });

    const userSession = {
      accessToken: jwt.sign({ uuid: User.uuid }, process.env.SECRET_KEY, {
        expiresIn: "7d",
      }),
      user: {
        user_id: user.uuid,
      },
    };

    return handleResponse(
      200,
      "success",
      "Usuario logado com sucesso",
      userSession
    );
  } catch (error) {
    return handleResponse(500, "error", "Erro no login");
  }
};

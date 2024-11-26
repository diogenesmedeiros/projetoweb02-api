import { PrismaClient } from "@prisma/client";
import handleResponse from "../middleware/handleResponse.js";

const prisma = new PrismaClient();

export const getUserService = async (uuid) => {
  try {
    const row = await prisma.user.findUnique({
      where: {
        uuid: uuid,
      },
    });

    const userData = {
      uuid: row.uuid,
      name: row.name,
      email: row.name
    }

    return handleResponse(200, "success", null, userData);
  } catch (error) {
    return handleResponse(500, "error", "Erro ao busca user");
  }
};

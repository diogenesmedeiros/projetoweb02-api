import { getUserService } from "../services/user.service.js";

export const getUserController = async (req, res) => {
  try {
    const user = getUserService(req.user.uuid);
    return res.status(user.code).json(user);
  } catch (error) {
    console.error("Erro ao buscar user:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao buscar user.",
    });
  }
};

export default { getUserController }

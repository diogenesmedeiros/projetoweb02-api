import dotenv from "dotenv"
import handleResponse from "./handleResponse.js"
import jwt from 'jsonwebtoken'

dotenv.config()

const authJwt = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if(!token) {
        console.log("Access denied because the user does not have a token")

        return res.status(401).json({
            code: 401,
            status: "error",
            message: "Acesso negado",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        req.user = decoded

        console.log(`Access granted to user ${req.user.uuid}`)

        next();
    }catch (error) {
        return res.status(401).json({
            status: "error",
            message: "Token invalido",
            token: token,
            req: req.user
        });
    }
}

export default authJwt
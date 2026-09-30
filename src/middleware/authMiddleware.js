import jwt from "jsonwebtoken";
import { userModel } from "../Models/userModel.js";
import dotenv from "dotenv";
dotenv.config()

export const authMiddleware = async(req, res, next) => {
    try{
        const token = req.cookies["auth-token"];

        if(!token){
            return res.status(404).json({
                message: "No token found or token compromised"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);
        if(!user){
            return res.status(401).json({
                message: `Not authenticated, please signup or login to access.`
            })
        }
        req.user = user
        next();
    }catch (err) {
        if(err instanceof Error){
        console.error(err);
        throw new Error(err);
        }
    }
}

import {Router} from "express"
import { getHome, getAbout, postUser,login, getSingleuser} from "../controllers/userControllers.js"
import {authMiddleware} from "../middleware/authMiddleware.js"


const router = Router()

router.get("/", getHome).get("/about", getAbout).post("/signup", postUser).post("/login", login).get("/dashboard/:id", authMiddleware, getSingleuser)

export default router;



import express from "express";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose"


const app = express()

mongoose.connect(process.env.MONGODB_URI).then(() => console.log("Database connected!")).catch((err) => console.error(err))

app.get("/",(req, res) =>{
    res.send("Homepage!, server is active.")
})

app.get("/", (req, res) =>{
    res.send("This is the about page.")
})
const PORT = 3000

app.use(express.json())
app.use(cookieParser())
app.use(userRoutes)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
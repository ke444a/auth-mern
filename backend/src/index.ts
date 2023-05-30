import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth";
dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB = process.env.MONGODB_URI || "";
const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/", authRoutes);

mongoose.connect(MONGODB).then(() => {
    app.listen(PORT);
}).catch((error) => {
    console.log(error.message);
});
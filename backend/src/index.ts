import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB = process.env.MONGODB_URI || "";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(MONGODB).then(() => {
    app.listen(PORT);
}).catch((error) => {
    console.log(error.message);
});
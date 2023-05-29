"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config({ path: "../.env" });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGODB = process.env.MONGODB_URI || "";
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
mongoose_1.default.connect(MONGODB).then(() => {
    app.listen(PORT);
}).catch((error) => {
    console.log(error.message);
});

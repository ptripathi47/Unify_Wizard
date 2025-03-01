import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import authRoutes from "./Routes/authRoutes.js"
import "dotenv/config";
import cors from "cors";
import { error } from "console";
import { connectDb } from "./Config/dbConnection.js";
const app = express();

// Middleware
app.use(express.json());

//CORS middleware
app.use(cors());

app.use(cookieParser());

connectDb()

app.get('/', (req , res) => {
    res.send("Hello , Welcome to Unify Wizard application");
})

app.use('/api/users/auth' , authRoutes);

const PORT = process.env.Port;
try {
    app.listen(PORT, () => {
        console.log(`Server is listening on Port ${PORT}`);
    })
} catch (error) {
    console.log("Error in Server Connection");
}


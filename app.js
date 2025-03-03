import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import authRoutes from "./Routes/authRoutes.js"
import "dotenv/config";
import cors from "cors";
import { error } from "console";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { connectDb } from "./Config/dbConnection.js";
const app = express();

// Middleware
app.use(express.json());

//CORS middleware
app.use(cors());

app.use(cookieParser());

//Load the swagger specificaation file
const swaggerDocument = YAML.load('./swagger.yaml');

//Use Swagger UI to serve the documentation at /api-docs
app.use('/api-docs' , swaggerUi.serve , swaggerUi.setup(swaggerDocument));

connectDb()

app.get('/', (req , res) => {
    res.send("Hello , Welcome to Unify Wizard application");
})

app.use('/api/users/auth' , authRoutes);

const PORT = process.env.Port;
const ip = process.env.ip;
try {
    app.listen(PORT, ip ,  () => {
        console.log(`Server is listening at http:// ${ip}:${PORT} `);
    })
} catch (error) {
    console.log("Error in Server Connection");
}


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

//middleware to handle CORS
app.use(
    cors({
        origin: "*",
        methods: ["GET","POST","PUT","DELETE"],
        allowedHeaders: ["Content-Type","Authorization"],
    })
);

// Connect Database
connectDB();

//Middleware
app.use(express.json());

//Routes Here


//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Servrr running on port ${PORT}`));
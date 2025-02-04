import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import taskRoutes from "./routes/tasks.js";
import projectRoutes from "./routes/projects.js";
import { initializeDb } from "./config/initializeDb.js";
import { keycloak, memoryStore } from './config/keycloak.js';
import session from 'express-session';
import { authorizeRole, verifyToken } from "./middleware/auth.js";
import { getManagers } from "./controllers/projects.js";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("combined"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const allowedOrigins = [
    process.env.CLIENT_URL, ,
];

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// KEYCLOAK
// app.use(
//     session({
//         secret: 'trB6Jv/v9HKXHomKebEPpA==',
//         resave: false,
//         saveUninitialized: true,
//         store: memoryStore,
//     })
// );

// app.use(keycloak.middleware());

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.get('/api/getManagers', verifyToken, authorizeRole(['manager', 'admin']), getManagers);

app.get('/api', (req, res) => {
    res.send('OK');
});



/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DATABASE }).then(() => {
    console.log("Connected to MongoDB");

    // Run once to clean and seed the Db
    // initializeDb().then(() => {
    //     console.log("Database seeded successfully!");
    // }).catch((err) => {
    //     console.error("Error seeding database:", err);
    // });

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.log(`${err} did 'not connect`);
});
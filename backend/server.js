import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";

import connectDB from "./config/mongodb.js";
import passport from "./middleware/googleAuth.js";

// Routes
import userRouter from "./route/User.route.js";
import paymentrouter from "./route/payment.js";
import geminiRoutes from "./route/gemini.route.js";
import resumeRouter from "./route/resume.route.js";
import liveInterviewRouter from "./route/interview.route.js";
import userRoundsRouter from "./route/userRounds.route.js";
import profileRoutes from "./route/profileRoutes.js";
import authRoutes from "./route/authRoutes.js";
import jobRoutes from "./route/jobRoutes.js";
import round3Routes from "./route/round3.route.js";
import hrRoute from "./route/hr.route.js";

// Socket handler
import initInterviewSocket from "./handler/interViewSocket.js";

// Load environment variables
dotenv.config();

const port = process.env.PORT || 7656;
const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";

const app = express();

// ✅ Handle CORS
app.use(
    cors({
        origin: frontendURL,
        methods: ["GET", "POST"],
        credentials: true,
    })
);

// ✅ Session setup (needed for passport)
app.use(
    session({
        secret: process.env.SESSION_SECRET || "supersecretkey",
        resave: false,
        saveUninitialized: true,
    })
);

// ✅ Core middleware
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// ✅ Base route (health check)
app.get("/", (req, res) => {
    res.send("Motera AI Backend is running ✅");
});

// ✅ API routes
app.use("/user/api/v1", userRouter);
app.use("/api/payment", paymentrouter);
app.use("/api/gemini", geminiRoutes);
app.use("/api", resumeRouter);
app.use("/api", liveInterviewRouter);
app.use("/user/api/v1", userRoundsRouter);
app.use("/user/v1/profile", profileRoutes);
app.use("/auth", authRoutes); // Google login routes
app.use("/user/api/v1", round3Routes);
app.use("/user/api/v1", hrRoute);
app.use("/api", jobRoutes);

// ✅ Start server
const startServer = async () => {
    try {
        await connectDB();

        const httpServer = createServer(app);

        const io = new IOServer(httpServer, {
            cors: {
                origin: frontendURL,
                methods: ["GET", "POST"],
                credentials: true,
            },
            transports: ["websocket", "polling"],
        });

        // Initialize Socket.io handlers
        initInterviewSocket(io);

        httpServer.listen(port, () => {
            console.log(`🚀 Motera AI Backend running at: http://localhost:${port}`);
        });
    } catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
};

startServer();

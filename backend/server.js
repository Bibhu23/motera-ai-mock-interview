import express from "express";
import cors from "cors";
import http from "http";
import { Server as IOServer } from "socket.io";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import userRouter from "./route/User.route.js";
import paymentrouter from "./route/payment.js";
import cookieParser from "cookie-parser";
import geminiRoutes from "./route/gemini.route.js"
import { initInterviewSocket } from "./handler/interViewSocket.js";
import { createServer } from "http";

const port = process.env.PORT || 4000;
const app = express();
//handling cors error
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/user/api/v1", userRouter);
app.use("/api/payment", paymentrouter);
app.use("/api/gemini", geminiRoutes);

const startServer = async () => {
    try {
        await connectDB(); // your existing DB connect
        const httpServer = createServer(app);

        const io = new IOServer(httpServer, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true,
            },
            transports: ["websocket", "polling"]
        });

        // Setup socket handlers (see socket/interviewSocket.js)
        initInterviewSocket(io);

        httpServer.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

startServer(); 
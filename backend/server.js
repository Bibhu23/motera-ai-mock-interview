import express from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import userRouter from "./route/User.route.js";
import paymentrouter from "./route/payment.js";
import cookieParser from "cookie-parser";
import geminiRoutes from "./route/gemini.route.js"

const port = process.env.PORT || 4000;
const app = express();
//handling cors error
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
await connectDB();
app.use("/user/api/v1", userRouter);
app.use("/api/payment", paymentrouter);
app.use("/api/gemini", geminiRoutes);
app.listen(port, () => {
    console.log(`server Running at the localhost:${port}`);

})
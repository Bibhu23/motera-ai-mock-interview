import express from 'express';
import { registerUser, loginUser, userCredit, useCredit } from '../controller/Usercontroller.js';
import { upload } from '../middleware/upload.js';
import authMiddleware from '../middleware/Auth.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/credit", authMiddleware, userCredit);
userRouter.post("/use-credit", authMiddleware, useCredit);
export default userRouter;
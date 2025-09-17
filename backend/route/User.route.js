import express from 'express';
import { registerUser, loginUser, userCredit } from '../controller/Usercontroller.js';
import { upload } from '../middleware/upload.js';
import authMiddleware from '../middleware/Auth.js';
const userRouter = express.Router();

userRouter.post("/register", upload.single("resume"), registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/credit", authMiddleware, userCredit);
export default userRouter;
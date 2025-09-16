import express from 'express';
import { registerUser, loginUser } from '../controller/Usercontroller.js';
import { upload } from '../middleware/upload.js';
const userRouter = express.Router();

userRouter.post("/register", upload.single("resume"), registerUser);
userRouter.post("/login", loginUser);

export default userRouter;

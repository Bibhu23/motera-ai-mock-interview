import express from 'express';
import { registerUser } from '../controller/Usercontroller.js';

const userRouter = express.Router();

// POST /register route
userRouter.post("/register", registerUser);

export default userRouter;

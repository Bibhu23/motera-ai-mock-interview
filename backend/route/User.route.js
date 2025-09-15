import express from 'express';
import { registerUser } from '../controller/Usercontroller.js';

<<<<<<< HEAD
userRouter.post("/register",registerUser);
userRouter.post("/login",registerUser);
=======
const userRouter = express.Router();

// POST /register route
userRouter.post("/register", registerUser);

>>>>>>> main
export default userRouter;

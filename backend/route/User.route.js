import express from 'express';
<<<<<<< HEAD
import { registerUser,loginUser } from '../controller/Usercontroller.js';
import { upload } from '../middleware/upload.js';
const userRouter = express.Router();

userRouter.post("/register",upload.single("resume"),registerUser);
userRouter.post("/login",loginUser);




=======
import { registerUser } from '../controller/Usercontroller.js';

<<<<<<< HEAD
userRouter.post("/register",registerUser);
userRouter.post("/login",registerUser);
=======
const userRouter = express.Router();

// POST /register route
userRouter.post("/register", registerUser);

>>>>>>> main
>>>>>>> main
export default userRouter;

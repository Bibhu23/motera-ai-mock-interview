import expres from 'express';
import { registerUser } from '../controller/Usercontroller.js';
const userRouter=expres.Router();

userRouter.post("/register",registerUser);
export default userRouter;

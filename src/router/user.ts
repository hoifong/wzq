import { Router } from 'express';
import * as controller from '../controllers/user';
import * as passportConfig from '../config/passport';

const userRouter = Router();

userRouter.post('/register', controller.addUser);
userRouter.post('/login', controller.login);
userRouter.post('/logout', controller.logout);
userRouter.get('/userexist/:name', controller.getUsernameExist);
userRouter.post('/createRoom', passportConfig.isAuthenticated, controller.createRoom);

export default userRouter
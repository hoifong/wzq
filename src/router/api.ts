import { Router, Request, Response, NextFunction } from 'express';
import * as UserController from '../controllers/user';
import * as passportConfig from '../config/passport';
import * as HallController from '../controllers/hall';
import { success } from '../controllers/helper';

const apiRouter = Router();

apiRouter.all('/*', (_req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

apiRouter.post('/register', UserController.addUser);
apiRouter.get('/userexist/:name', UserController.getUsernameExist);
apiRouter.post('/login', UserController.login);
apiRouter.post('/logout', UserController.logout);
apiRouter.get('/getUserInfo', passportConfig.isAuthenticated, UserController.getUser);
apiRouter.post('/createRoom', passportConfig.isAuthenticated, UserController.createRoom);
apiRouter.get('/rooms', passportConfig.isAuthenticated, HallController.getRooms);
apiRouter.get('/players', passportConfig.isAuthenticated, HallController.getPlayers);
apiRouter.get('/test', (_, res) => {
    res.json(success());
})


export default apiRouter;
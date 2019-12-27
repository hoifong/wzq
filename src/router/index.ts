import { Router, Request, Response, NextFunction } from 'express';
import hallRouter from './hall';
import userRouter from './user';
import { success } from '../controllers/helper';

const apiRouter = Router();

apiRouter.all('/*', (_req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers  跨域
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

apiRouter.use('/hall', hallRouter);
apiRouter.use('/user', userRouter);
apiRouter.get('/', (_, res: Response) => {
    res.json(success('hh'));
});

export default apiRouter;
import { Router } from 'express';
import * as passportConfig from '../config/passport';
import * as controller from '../controllers/hall';

const hallRouter = Router();

hallRouter.get('rooms', passportConfig.isAuthenticated, controller.getRooms);
hallRouter.get('players', passportConfig.isAuthenticated, controller.getPlayers);

export default hallRouter;
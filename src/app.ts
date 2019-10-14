import express, { Response, Request, NextFunction } from 'express';
import { connect } from 'mongoose';
import session from 'express-session';
import mongo from 'connect-mongo';
import passport from 'passport';
import path from 'path';
import io from 'socket.io';

import { uri } from './config/db';
import { SESSION_SECRET } from './config/server';
import * as UserController from './controllers/user';
import * as HallController from './controllers/hall';
import { logger } from './middlewares';

//  mongodb启动
connect(uri, {useNewUrlParser: true}, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log('mongodb connected...');
    }
});

const MongoStore = mongo(session);

const app = express();

app.use(express.json());

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        url: uri,
        autoReconnect: true
    })
}));

app.use(passport.initialize());
app.use(passport.session());

import './config/passport';
import * as passportConfig from './config/passport';
import { success } from './controllers/helper';

app.use(logger);

app.use(
    express.static(path.join(__dirname, '../public'), {maxAge: 31557600000})
);

//  跨域
app.all('/api/*', (_req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

app.post('/api/register', UserController.addUser);

app.get('/api/userexist/:name', UserController.getUsernameExist);

app.post('/api/login', UserController.login);

app.post('/api/logout', UserController.logout);

app.post('/api/createRoom', passportConfig.isAuthenticated, UserController.createRoom);

app.get('/api/rooms', passportConfig.isAuthenticated, HallController.getRooms);

app.get('/api/players', passportConfig.isAuthenticated, HallController.getPlayers);

app.get('/api/hhh', passportConfig.isAuthenticated, (_, res: Response) => {
    res.json(success('1'));
});

app.get('/*', (req, res) => {
    res.header('Content-Type', 'text/html');
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.set("port", process.env.PORT || 8000);

const server = app.listen(app.get("port"), '0.0.0.0', () => {
    console.log("server running on port: " + app.get('port'));
});

const lServer = io(server);

lServer.of('/ws/hall').on('connection', HallController.server);
import express, { Response, Request, NextFunction } from 'express';
import { connect } from 'mongoose';
import session from 'express-session';
import mongo from 'connect-mongo';
import passport from 'passport';
import path from 'path';
import io from 'socket.io';

import { initHallServer } from './controllers/hall';
import { uri } from './config/db';
import { SESSION_SECRET } from './config/server';
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
import apiRouter from './router';

app.use(logger);

app.use(
    express.static(path.join(__dirname, '../public'), {maxAge: 31557600000})
);

app.use('/api', apiRouter);

app.get('/*', (req, res) => {
    res.header('Content-Type', 'text/html');
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.set("port", process.env.PORT || 8000);

const server = app.listen(app.get("port"), '0.0.0.0', () => {
    console.log("server running on port: " + app.get('port'));
});

const lServer = io(server);

initHallServer(lServer);
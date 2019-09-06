import passport from 'passport';
import passportLocal from 'passport-local';

import User, { IUser } from '../models/user';
import { Request, Response, NextFunction } from 'express';

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((user: IUser, done) => {
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
    User.findOne({username})
        .then((user: IUser) => {
            done(null, user);
        })
        .catch(err => {
            done(err);
        });
});

passport.use(new LocalStrategy({ usernameField: "username", passwordField: 'password' }, (username, password, done) => {
    User.findOne({username, password})
        .then((user: IUser) => {
            if (!user) {
                return done(undefined, false, {message: `用户名或密码错误.`});
            }

            return done(null, user);
        })
        .catch(err => {
            return done(err);
        });
}));

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/login");
};

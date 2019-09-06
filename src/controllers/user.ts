import { Response, Request } from 'express';
import User, { IUser } from '../models/user';
import { success, failed } from './helper';
import passport from 'passport';
import { IVerifyOptions } from 'passport-local';
import { NextFunction } from 'connect';

/**
 * 新建用户
 * @param req
 * @param req.username
 * @param req.password
 */
export const addUser = (req: Request, res: Response) => {
    const { username, password } = req.body;

    //  先判断用户名是否冲突
    res.status(200);
    User.exists({username}).then((exist: boolean) => {
        if (!exist) {
            const user = new User({
                username,
                password,
                createTime: new Date(),
            });
            return user.save();
        } else {
            return Promise.reject(new Error('用户名已存在'));
        }
        
    }).then((user: IUser) => {
        res.json(success(user));
    }).catch((err: any) => {
        res.json(failed(err.message || err));
    });
};

/**
 * 查村用户名是否已被使用
 * @param req 
 * @param req.username
 */
export const getUsernameExist = (req: Request, res: Response) => {
    const username = req.params.name;

    User.exists({username}).then((exist: boolean) => {
        res.status(200);
        if (!exist) {
            res.json(success());
        } else {
            res.json(failed('用户名已存在'));
        }
    }).catch((err) => {
        res.json(failed(err.message || err));
    });
};

/**
 * 登陆
 */

export const login = (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate('local', (err: Error, user: IUser, info: IVerifyOptions) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.json(failed('账户名或密码错误！'));
        }

        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            return res.json(success(user));
        });
    })(req, res, next);
}

/**
 * 退出
 */

export const logout = (req: Request, res: Response) => {
    req.logOut();
    res.json(success());
}
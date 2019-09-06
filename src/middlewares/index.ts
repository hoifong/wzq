import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
    const { url, method, ip } = req;
    console.log(`request from ${ip} to ${method}:${url}`);
    next();
}
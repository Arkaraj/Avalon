import { RequestHandler, Request } from "express";
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';

export type RequestwithUserId = Request<{}, any, any, {}, Record<string, any>> & { userId: Types.ObjectId };

export const isAuth: RequestHandler<{}, any, any, {}> = (req, _res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new Error("Not Authenticated!");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new Error("Not Authenticated!");
    }

    try {

        const payload: any = jwt.verify(token, process.env.SECRET_JWT);
        (req as any).userId = payload.userId;
        next();

    } catch (err) {
        throw new Error("Not Authenticated!");
    }


};
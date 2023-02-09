import { NextFunction, Request, Response } from "express";
import userModel from "../models/User";

export const privateRoute = async (req: Request, res: Response, next: NextFunction) => {

    if(!req.query.token && !req.body.token) {
        res.status(401).json({ notAllowed: true });
        return;
    } 

    let token: string;

    if(req.query.token) {
        token = req.query.token as string;
    } else {
        token = req.body.token as string;
    }

    const user = await userModel.findOne({ token });

    if(!user) {
        res.status(401).json({ notAllowed: true });
        return
    }

    next();
};
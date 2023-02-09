import { Request, Response } from "express";
import bannerModel from "../models/Banners";

export const getBanners = async (req: Request, res: Response) => {

    const banners = await bannerModel.find();

    res.json({ banners });

};
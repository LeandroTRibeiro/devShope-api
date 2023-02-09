import { Request, Response } from "express";
import categoryModel from "../models/Category";

export const getCategories = async (req: Request, res: Response) => {
    const categories = await categoryModel.find();

    res.json({ categories });
};
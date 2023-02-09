import { Request, Response } from "express";

import adsModel from "../models/Ads";
import userModel from "../models/User";
import wishListModel from "../models/WishList";



export const addAndRemoveWish = async (req: Request, res: Response) => {

    const { token, wish } = req.body;

    const user = await userModel.findOne({token});

    if(!user) {
        res.status(401).json({ error: { email: { msg: 'Token e/ou usuário inválido'} } });
        return;
    }
    
    if(!wish) {
        
        res.status(400).json({ error: { wish: { msg: 'Faltam dados'} } });
        return;
        
    }

    try {

        const hasProduct = await adsModel.findOne({ _id: wish });

        const wishList = await wishListModel.findOne({ idUser: user._id.toString()});

        if(!wishList) {
            const newWishList = new wishListModel({
                idUser: user._id.toString(),
                product: [
                    {idProduct: wish}
                ]
            });

            await newWishList.save();

            res.json({ wishList: newWishList });

            return;
        }

        const hasWish = await wishListModel.findOne({
            idUser: user._id.toString(), 
            "product.idProduct": wish});

        if(!hasWish) {

            const newWish = {
                idProduct: wish,
                dateCreated: new Date()
            };

            wishList.product.push(newWish);

            await wishList.save();

            res.json({ wishList });

            return;
        }

        try {

            await wishListModel.findOneAndUpdate({ idUser: user._id.toString() }, { $pull: { product: { idProduct: wish } } }, {new: true});

            const newList = await wishListModel.findOne({ idUser: user._id.toString() });

            res.json({ wishList: newList });

        } catch(error) {

            console.log(error);
        }

    } catch(error) {

        res.status(400).json({ error: { product: { msg: 'Produdo inválido'} } });
        return;

    }

};

export const getWishs = async (req: Request, res: Response) => {

    const { token } = req.body;
    
    const user = await userModel.findOne({token});
    
    if(!user) {
        res.status(401).json({ error: { email: { msg: 'Token e/ou usuário inválido'} } });
        return;
    }

    const wishList = await wishListModel.findOne({ idUser: user._id.toString()});

    res.json({ wishList });
}

export const getWishListProducts = async (req: Request, res: Response) => {

    const { token } = req.body;

    const user = await userModel.findOne({ token });

    if(!user) {
        res.status(401).json({ error: { email: { msg: 'Token e/ou usuário inválido'} } });
        return;
    }

    const wishList = await wishListModel.findOne({ idUser: user._id.toString()});

    if(!wishList) {
        res.status(401).json({ error: { wish: { msg: 'Não há uma lista'} } });
        return;
    }

    const products = [];

    for( let i in wishList.product) {
        products.push(await adsModel.findOne({ _id: wishList.product[i].idProduct }));
    }

    res.json({ products });

}
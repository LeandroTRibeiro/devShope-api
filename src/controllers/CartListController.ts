import { Request, Response } from "express";
import adsModel from "../models/Ads";
import cartListModel from "../models/Cart";
import userModel from "../models/User";

export const addToCart = async (req: Request, res: Response) => {

    const { token, product } = req.body;

    const user = await userModel.findOne({ token });

    if(!user) {
        res.status(401).json({ error: { email: { msg: 'Token e/ou usuário inválido'} } });
        return;
    }

    if(!product) {
        res.status(400).json({ error: { product: { msg: 'Faltam dados'} } });
        return;
    }

    try {

        const hasProduct = await adsModel.findOne({ _id: product });

        const cartList = await cartListModel.findOne({ idUser: user._id.toString()});

        if(!cartList) {
            const newCartList = new cartListModel({
                idUser: user._id.toString(),
                product: [
                    {idProduct: product}
                ]
            });

            await newCartList.save();

            res.json({ cartList: newCartList });

            return;
        }

        const hasCart = await cartListModel.findOne({
            idUser: user._id.toString(), 
            "product.idProduct": product});

        if(!hasCart) {

            const newProduct = {
                idProduct: product,
                amount: 1,
                dateCreated: new Date()
            };

            cartList.product.push(newProduct);

            await cartList.save();

            res.json({ cartList });

            return;
        }

        hasCart.product.map((item) => {
            if(item.idProduct === product) {
                item.amount++;
            }
        });
        
        await hasCart.save()

        res.json({cartList: hasCart});

    } catch(error) {

        res.status(400).json({ error: { product: { msg: 'Produdo inválido'} } });
        return;

    }

}

export const getCart = async (req: Request, res: Response) => {
    const { token } = req.body;
    
    const user = await userModel.findOne({token});
    
    if(!user) {
        res.status(401).json({ error: { email: { msg: 'Token e/ou usuário inválido'} } });
        return;
    }

    const cartList = await cartListModel.findOne({ idUser: user._id.toString()});

    res.json({ cartList });
}
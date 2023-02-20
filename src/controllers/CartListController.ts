import { Request, Response } from "express";
import adsModel from "../models/Ads";
import cartListModel from "../models/Cart";
import userModel from "../models/User";

export const addToCart = async (req: Request, res: Response) => {

    const { token, product, amount } = req.body;

    const user = await userModel.findOne({ token });

    if(!user) {
        res.status(401).json({ error: { email: { msg: 'Token e/ou usuário inválido'} } });
        return;
    }

    if(!product) {
        res.status(400).json({ error: { product: { msg: 'Faltam dados'} } });
        return;
    }

    if(!amount) {
        res.status(400).json({ error: { amount: { msg: 'Faltam dados'} } });
        return;
    }

    try {

        const hasProduct = await adsModel.findOne({ _id: product });

        if(!hasProduct) {
            res.status(400).json({ error: { product: { msg: 'Produdo inválido'} } });
            return;
        }

        const cartList = await cartListModel.findOne({ idUser: user._id.toString()});

        if(!cartList) {
            const newCartList = new cartListModel({
                idUser: user._id.toString(),
                product: [
                    {idProduct: product, amount: hasProduct.stock < amount ? hasProduct.stock : amount}
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
                amount: hasProduct.stock < amount ? hasProduct.stock : amount,
                dateCreated: new Date()
            };

            cartList.product.push(newProduct);

            await cartList.save();

            res.json({ cartList });

            return;
        }

        hasCart.product.map((item) => {
            if(item.idProduct === product) {
                item.amount = hasProduct.stock < (item.amount + amount) ? hasProduct.stock : item.amount + amount;
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

export const getProductCart = async (req: Request, res: Response) => {

    const { token } = req.body;

    const user = await userModel.findOne({ token });

    if(!user) {
        res.status(401).json({ error: { email: { msg: 'Token e/ou usuário inválido'} } });
        return;
    }

    const cartList = await cartListModel.findOne({ idUser: user._id.toString() });

    if(!cartList) {
        res.status(401).json({ error: { cart: { msg: 'Não há uma lista'} } });
        return;
    }

    const products = [];

    for( let i in cartList.product) {

        let product = await adsModel.findOne({ _id: cartList.product[i].idProduct });

        if(product) {
            product.amount = cartList.product[i].amount;

            products.push(product);
        }

    }

    res.json({ products });

}

export const deleteToCart = async (req: Request, res: Response) => {

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

        const cartList = await cartListModel.findOne({ idUser: user._id.toString() });
    
        if(!cartList) {
            res.status(400).json({ error: { cart: { msg: 'Lista inexistente'} } });
            return;
        }
    
        const index = cartList.product.findIndex((item) => {
            if(item.idProduct === product) {
                return true
            }
        });
    
        if(index >= 0) {
    
            await cartListModel.findOneAndUpdate({ idUser: user._id.toString() }, { $pull: { product: { idProduct: product } } }, {new: true});
    
            const newList = await cartListModel.findOne({ idUser: user._id.toString() });
    
            res.json({ cartList: newList });
    
            return;
        }
    
        res.status(400).json({ error: { cart: { msg: 'Produto inexistente na lista'} } });

    } catch(error) {

        res.status(400).json({ error: { product: { msg: 'Produto inexistente'} } });
        return;

    }




}
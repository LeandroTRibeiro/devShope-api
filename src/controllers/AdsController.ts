import { Request, Response } from "express";
import adsModel, { AdsType } from "../models/Ads";
import userModel from "../models/User";
import { FilterType, ImageType, UpdatesProductType } from "../types/types";
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import sharp from "sharp";
import { unlink } from 'fs/promises';
import { delivery } from "../services/DeliveryService";
import { consultarCep, PrecoPrazoResponse } from "correios-brasil/dist";

// dotenv.config();

// cloudinary.v2.config({
//     cloud_name: process.env.CLOUD_NAME as string,
//     api_key: process.env.API_KEY as string,
//     api_secret: process.env.API_SECRET as string
// });

// export const add = async (req: Request, res: Response) => {

//     let { title, description, category, price } = req.body;

//     let token = req.query.token;
 
//     const user = await userModel.findOne({ token });
    
//     if(!title || !category) {
//         res.status(400).json({ error: { ads: { msg: 'Título e/ou categoria não foram preenchidos' } } });
//         return;
//     }
//     if(price) {
//         price = price.replace('.', '').replace(',', '.').replace('R$', '');
//         price = parseFloat(price);
//     } else {
//         price = 0;
//     }

//     const newAd = new adsModel({
//         idUser: user?._id,
//         title,
//         description,
//         category,
//         price,

//     });

//     if(req.files) {
        
//         const images = req.files as ImageType[];

//         for(let image of images) {

//             const fileName = `${image.filename}.png`;

//             await sharp(image.path).resize(400,400).toFormat('png').toFile(`./public/${fileName}`);

//             const cloud = await cloudinary.v2.uploader.upload(`./public/${fileName}`, {public_id: image.filename});

//             await unlink(image.path);
//             await unlink(`./public/${fileName}`);
            
//             newAd.images.push({
//                 url: cloud.url,
//                 public_id: cloud.public_id
//             });

//         }
   
//     } else {

//         res.status(400).json({ error: { images: { msg: 'Imagens não foram adicionadas' } } });
//         return;

//     }

//     if(newAd.images.length > 0 ) {
//         newAd.images[0].default = true;
//     }

//     const info = await newAd.save();

//     res.json({ id: info._id });
    
// };

export const getList = async (req: Request, res: Response) => {

    const q = req.query.q as string;
    const category = req.query.category as string;
    let offset = 0;
    let limit = 8;
    let sort = 'asc';
    let total = 0;

    if(req.query.offset) {
        offset = parseInt(req.query.offset as string);
    }

    if(req.query.limit) {
        limit = parseInt(req.query.limit as string);
    }

    if(req.query.sort) {
        sort = req.query.sort as string;
    }

    let filters: FilterType = { status: true, stock: { $gte: 1 } };

    if(q) {
        let regex = new RegExp(q, 'i');
        filters.title = regex;
    }

    if(category) {
        filters.category = category;
    }

    const adsTotal = await adsModel.find(filters);
    total = adsTotal.length;


    const ads = await adsModel.find(filters)
        .sort({ price: (sort==='desc'?-1:1) })
        .skip(offset)
        .limit(limit);

    res.json({ ads, total });
};

export const getItem = async (req: Request, res: Response) => {

    const id = req.params.id as string;
    const { token } = req.body;

    if(!id) {
        res.status(400).json({ error: { product: { msg: 'O produto não existe' } } });
        return;
    }

    try {

        const product = await adsModel.findOne({ _id: id });

        if(!product) {
            res.status(400).json({ error: { product: { msg: 'O produto não existe' } } });
            return;
        }

        product.views++;

        await product.save();

        const others = await adsModel.find({ status: true , category: product.category});

        let deliveryInfo;
        let destination;

        if(!product.freeDelivery) {

            if(token) {
    
                const user = await userModel.findOne({ token });
    
                if(user) {
    
                    if(user.address.zipCode) {
    
                        deliveryInfo = await delivery.getDelivery(product._id, user.address.zipCode);
                        destination = user.address;
    
                    }

                }
    
            }
        }


        if(others) {

            res.json({product, others: others.reverse(), delivery: deliveryInfo, destination});
            
        } else {
            const otherCategory = await adsModel.find();
            res.json({product, others: otherCategory, delivery: deliveryInfo, destination});
        }

    } catch(error) {
        res.status(400).json({ error: { product: { msg: 'O produto não existe' } } });
        return;
    }

    
};

export const getDeliveryPrice = async (req: Request, res: Response) => {

    const { zipCode, productId } = req.body;

    if(!zipCode) {
        res.status(400).json({ error: { zipCode: { msg: 'Faltam dados' } } });
        return;
    }

    if(!productId) {
        res.status(400).json({ error: { product: { msg: 'Faltam dados' } } });
        return;
    }

    try {

        const zipCodeVerificated = await consultarCep(zipCode);

        try {


            const product = await adsModel.findOne({ _id: productId });

            if(product?.freeDelivery) {

                res.status(400).json({ error: { product: { msg: 'frete gratuito!' } } });
                return;

            } else {

                const deliveryInfo = await delivery.getDelivery(productId, zipCode);

                res.json({deliveryInfo});

            }

        } catch(error) {

            res.status(400).json({ error: { product: { msg: 'produto inválido!' } } });
            return;

        }
    } catch(error) {

        res.status(400).json({ error: { zipCode: { msg: 'CEP inválido!' } } });
        return;
    }

    
}

// export const edit = async (req: Request, res: Response) => {

//     const id = req.params.id as string;

//     let { state, title, description, category, price, status, token } = req.body;

//     try {

//         const product = await adsModel.findOne({ _id: id });

//         if(!product) {

//             res.status(400).json({ error: { product: { msg: 'O produto não existe' } } });
//             return;

//         } else {

//             try {

//                 const user = await userModel.findOne({ token, _id: product.idUser});

//                 if(!user) {

//                     res.status(400).json({ error: { user: { msg: 'O usuário não possui este produto' } } });
//                     return;

//                 } else {

//                     const updates: UpdatesProductType = {};

//                     if(state) {
//                         updates.state = state;
//                     }

//                     if(title) {
//                         updates.title = title;
//                     }

//                     if(description) {
//                         updates.description = description;
//                     }

//                     if(category) {
//                         updates.category = category;
//                     }

//                     if(price) {
//                         price = price.replace('.', '').replace(',', '.').replace('R$', '');
//                         price = parseFloat(price);
//                         updates.price = price;
//                     }

//                     if(status) {
//                         updates.status = status;
//                     }

                    
//                 }

//             } catch(error) {

//                 res.status(400).json({ error: { user: { msg: 'O usuário não possui este produto' } } });
//                 return;

//             }

            
//         }

//     } catch(error) {
//         res.status(400).json({ error: { product: { msg: 'O produto não existe' } } });
//         return;
//     }
    

// };
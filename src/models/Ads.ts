import { Schema, model, connection, Model } from "mongoose";
import { ImageTypeModel } from "../types/types";

export type AdsType = {
    _id: string
    idUser: string,
    dateCreated: Date,
    title: string,
    description: string,
    category: string,
    price: number,
    views: number,
    status: boolean,
    rating: {
        totalRating: number,
        grades: number[]
    },
    thumbnail: {
        url: string,
        public_id: string
    }
    images: ImageTypeModel[],
    stock: number,
    freeDelivery: boolean,
    characteristics: string[],
    discount: number,
    installment: number,
    discountWithInstallment: boolean,
    amount: number,
    cepOrigin: string,
    weight: string,
    format: string,
    length: string,
    height: string,
    width: string,
    deliveryService: string[],
    diameter: string


};

const schema = new Schema<AdsType>({
    idUser: {type: String, required: true},
    dateCreated: {type: Date, required: true, default: new Date()},
    title: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    views: {type: Number, required: true, default: 0},
    status: {type: Boolean, required: true, default: true},
    rating: {
        totalRating: {type: Number, required: true, default: 0},
        grades: {type: [Number]}
    },
    images: {type: [Object], required: true},
    stock: {type: Number, required: true, default: 1},
    freeDelivery: {type: Boolean, required: true, default: false},
    characteristics: {type: [String], required: true},
    discount: {type: Number, required: true, default: 0},
    installment: {type: Number, required: true, default: 0},
    discountWithInstallment: {type: Boolean, required: true, default: false},
    amount: {type: Number, required: false},
    cepOrigin: {type: String, required: true},
    weight: {type: String, required: true},
    format: {type: String, required: true},
    length: {type: String, required: true},
    height: {type: String, required: true},
    width: {type: String, required: true},
    deliveryService: {type: [String], required: true},
    diameter: {type: String, required: true}
});

const modelName = 'Ads';

const adsModel =
connection && connection.models[modelName]
    ? (connection.models[modelName] as Model<AdsType>)
    : model<AdsType>(modelName, schema);

export default adsModel;
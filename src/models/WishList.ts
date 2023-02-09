import { Schema, model, connection, Model } from "mongoose";

type WishListType = {
    idUser: string,
    product: [
        {
            idProduct: string,
            dateCreated: Date
        }
    ]
    
};

const schema = new Schema<WishListType>({
    idUser: {type: String, required: true},
    product: [
        {
            idProduct: {type: String, required: true},
            dateCreated: {type: Date, required: true, default: new Date()}
        }
    ]
});

const modelName = 'WishList';

const wishListModel =
connection && connection.models[modelName]
    ? (connection.models[modelName] as Model<WishListType>)
    : model<WishListType>(modelName, schema);

export default wishListModel;
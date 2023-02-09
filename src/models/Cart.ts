import { Schema, model, connection, Model } from "mongoose";

type CartListType = {
    idUser: string,
    product: [
        {
            idProduct: string,
            amount: number,
            dateCreated: Date
        }
    ]
    
};

const schema = new Schema<CartListType>({
    idUser: {type: String, required: true},
    product: [
        {
            idProduct: {type: String, required: true},
            amount: {type: Number, required: true, default: 1},
            dateCreated: {type: Date, required: true, default: new Date()}
        }
    ]
});

const modelName = 'CartList';

const cartListModel =
connection && connection.models[modelName]
    ? (connection.models[modelName] as Model<CartListType>)
    : model<CartListType>(modelName, schema);

export default cartListModel;
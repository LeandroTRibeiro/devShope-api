import { Schema, model, connection, Model } from "mongoose";
import { ImageTypeModel } from "../types/types";

type CommentsType = {
    dateCreated: Date,
    grade: number,
    idProduct: string,
    idUser: string,
    opinion: string,
    images: ImageTypeModel[]
};

const schema = new Schema<CommentsType>({
    dateCreated: {type: Date, required: true, default: new Date()},
    grade: {type: Number, required: true},
    idProduct: {type: String, required: true},
    idUser: {type: String, required: true},
    opinion: {type: String},
    images: {type: [Object]}
});

const modelName = 'Comment';

const CommentsModel =
connection && connection.models[modelName]
    ? (connection.models[modelName] as Model<CommentsType>)
    : model<CommentsType>(modelName, schema);

export default CommentsModel;
import { Schema, model, connection, Model } from "mongoose";

type BannerType = {
    name: string,
    url: string,
    public_id: string,
    dateCreated: Date
};

const schema = new Schema<BannerType>({
    name: {type: String, required: true},
    url: {type: String, required: true},
    public_id: {type: String, required: true},
    dateCreated: {type: Date, default: new Date()}
});

const modelName = 'Banners';

const bannerModel =
connection && connection.models[modelName]
    ? (connection.models[modelName] as Model<BannerType>)
    : model<BannerType>(modelName, schema);

export default bannerModel;
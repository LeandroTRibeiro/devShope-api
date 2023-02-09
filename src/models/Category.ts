import { Schema, model, connection, Model } from "mongoose";

type CategoryType = {
    name: string,
};

const schema = new Schema<CategoryType>({
    name: {type: String, required: true}
});

const modelName = 'Category';

const categoryModel =
connection && connection.models[modelName]
    ? (connection.models[modelName] as Model<CategoryType>)
    : model<CategoryType>(modelName, schema);

export default categoryModel;
import { Schema, model, connection, Model } from "mongoose";
import { AdsType } from "./Ads";

type Usertype = {
    dateCreated: Date,
    name: {
        firstName: string,
        lastName: string
    },
    email: string,
    phone: number,
    address: {
        zipCode: string,
        country: string,
        city: string,
        district: string,
        street: string,
        number: number,
        complement: string,
        apartment: {
            isApartment: boolean,
            name: string,
            block: string,
            apartmentNumber: number
        }
    }
    password: string,
    token: string,
    purchasing: AdsType[],
    wishList: string[]
    validated: boolean

};

const schema = new Schema<Usertype>({
    dateCreated: {type: Date, required: true, default: new Date()},
    name: {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true}
    },
    email: {type: String, required: true},
    phone: {type: Number},
    address: {
        zipCode: {type: String},
        country: {type: String},
        city: {type: String},
        district: {type: String},
        street: {type: String},
        number: {type: Number},
        complement: {type: String},
        apartment: {
            isApartment: {type: Boolean},
            name: {type: String},
            block: {type: String},
            apartmentNumber: {type: Number}
        }
    },
    password: {type: String, required: true},
    token: {type: String, required: true},
    purchasing: {type: [Object]},
    wishList: {type: [String]},
    validated: {type: Boolean, required: true, default: false}
});

const modelName = 'User';

const userModel =
connection && connection.models[modelName]
    ? (connection.models[modelName] as Model<Usertype>)
    : model<Usertype>(modelName, schema);

export default userModel;
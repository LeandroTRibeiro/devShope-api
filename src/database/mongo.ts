import { connect } from "mongoose";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

mongoose.set('strictQuery', false);

export const mongoConect = async () => {
    try {
        await connect(process.env.MONGO_URL as string);
        console.log('conectado ao MongoDB');
    } catch(error) {
        console.log('erro de conexão : ', error); 
    }
}
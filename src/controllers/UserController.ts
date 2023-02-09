import { Request, Response } from "express";
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

import userModel from "../models/User";

import { validationResult } from "express-validator/src/validation-result";
import { matchedData } from "express-validator/src/matched-data";
import { DecodeType, UserUpdatesType } from "../types/types";

dotenv.config();

export const AddAddress = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        res.status(400).json({ error: error.mapped() });
        return;
    }

    const data = matchedData(req);

    const user = await userModel.findOne({ token: data.token });

    if(!user) {
        res.status(401).json({ error: { email: { msg: 'Token e/ou usuário inválido'} } });
        return;
    }

    user.address.zipCode = data.zipCode;
    user.address.country = data.country;
    user.address.district = data.district;
    user.address.city = data.city;
    user.address.street = data.street;
    user.address.number = data.number;
    
    if(data.complement) {
        user.address.complement = data.complement;
    }

    if(req.body.isApartment) {
        user.address.apartment.isApartment = true;
        if(data.name) {
            user.address.apartment.name = data.name;
        }
        if(data.block) {
            user.address.apartment.block = data.block;
        }
        if(data.apartmentNumber) {
            user.address.apartment.apartmentNumber = data.apartmentNumber;
        }
    }

    if(!req.body.isApartment) {
        user.address.apartment.isApartment = false;
        user.address.apartment.name = '';
        user.address.apartment.block = '';
        user.address.apartment.apartmentNumber = 0;
    }

    await user.save();

    res.json({ address: true });
};

export const UserInfo = async (req: Request, res: Response) => {

    const { token } = req.body;

    const user = await userModel.findOne({token});
    
    if(!user) {
        res.status(401).json({ error: { email: { msg: 'Token e/ou usuário inválido'} } });
        return;
    }

    const password = JWT.verify(user.password, process.env.JWT_SECRET_KEY as string) as DecodeType;

    res.json({ user: {
        _id: user._id,
        name: {
            firstName: user.name.firstName,
            lastName: user.name.lastName
        },
        dateCreated: user.dateCreated,
        purchansing: user.purchasing,
        wishList: user.wishList,
        email: user.email,
        password: password.password,
        phone: user.phone
    } });
};

export const AddressInfo = async (req: Request, res: Response) => {
    const { token } = req.body;

    const user = await userModel.findOne({token});
    
    if(!user) {
        res.status(401).json({ error: { email: { msg: 'Token e/ou usuário inválido'} } });
        return;
    }

    const password = JWT.verify(user.password, process.env.JWT_SECRET_KEY as string) as DecodeType;

    res.json({ user: {
        _id: user._id,
        address: {
            zipCode: user.address.zipCode,
            country: user.address.country,
            city: user.address.city,
            district: user.address.district,
            street: user.address.street,
            number: user.address.number,
            complement: user.address.complement,
            apartment: {
                isApartmente: user.address.apartment.isApartment,
                name: user.address.apartment.name,
                block: user.address.apartment.block,
                apartmentNumber: user.address.apartment.apartmentNumber
            }
        }
    } });
};

export const EditUserInfo = async (req: Request, res: Response) => {

    // Validando os dados
    const error = validationResult(req);
    if(!error.isEmpty()) {
        res.status(400).json({ error: error.mapped() });
        return;
    }

    const data = matchedData(req);

    const user = await userModel.findOne({ token: data.token });

    if(!user) {
        res.status(401).json({ error: { user: { msg: 'Usuário inexistente'} } });
        return;
    }

    if(data.firstName) {
        user.name.firstName = data.firstName;
    }

    if(data.lastName) {
        user.name.lastName = data.lastName;
    }

    if(data.email) {

        const emailCheck = await userModel.findOne({ email: data.email });

        if(emailCheck) {
            res.status(400).json({ error: { email: { msg: 'E-mail já possui cadastro', value: data.email} } });
            return;
        }

        user.email = data.email;
        
    }

    if(data.password) {

        const password = JWT.sign({ 
            email: data.email ? data.email : user.email, 
            password: data.password },
            process.env.JWT_SECRET_KEY as string
        );

        user.password = password;
    }

    if(data.phone) {
        user.phone = data.phone;
    }

    await user.save();

    res.json({ updated: true });
};

export const EditAddressInfo = async (req: Request, res: Response) => {

    const error = validationResult(req);
    if(!error.isEmpty()) {
        res.status(400).json({ error: error.mapped() });
        return;
    }

    const data = matchedData(req);

    const user = await userModel.findOne({ token: data.token });

    if(!user) {
        res.status(401).json({ error: { user: { msg: 'Usuário inexistente'} } });
        return;
    }

    if(data.zipCode) {
        user.address.zipCode = data.zipCode;
    }

    if(data.country) {
        user.address.country = data.country;
    }

    if(data.city) {
        user.address.city = data.city;
    }

    if(data.district) {
        user.address.district = data.district;
    }

    if(data.street) {
        user.address.street = data.street;
    }

    if(data.number) {
        user.address.number = data.number;
    }

    if(data.complement) {
        user.address.complement = data.complement;
    }

    if(req.body.isApartment) {
        
        user.address.apartment.isApartment = true;
        if(data.name) {
            user.address.apartment.name = data.name;
        }
        if(data.block) {
            user.address.apartment.block = data.block;
        }
        if(data.apartmentNumber) {
            user.address.apartment.apartmentNumber = data.apartmentNumber;
        }
    }

    if(req.body.isApartment === false) {
        user.address.apartment.isApartment = false;
        user.address.apartment.name = '';
        user.address.apartment.block = '';
        user.address.apartment.apartmentNumber = 0;
    }
    
    await user.save();

    res.json({ update: true });
};

import { Request, Response } from "express";
import { matchedData } from "express-validator/src/matched-data";
import { validationResult } from "express-validator/src/validation-result";
import userModel from "../models/User";
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { DecodeType, RecoverType } from "../types/types";
import { EmailService } from "../services/EmailService";

dotenv.config();

export const Signin = async (req: Request, res: Response) => {

    const error = validationResult(req);
    if(!error.isEmpty()) {
        res.status(400).json({ error: error.mapped() });
        return;
    }
    
    const data = matchedData(req);

    const user = await userModel.findOne({ email: data.email });

    if(!user) {
        res.status(401).json({ error: { login: { msg: 'E-mail e/ou Senha incorreto'} } });
        return;
    }

    const decode = JWT.verify(
        user.password,
        process.env.JWT_SECRET_KEY as string
    ) as DecodeType;

    if(data.email === decode.email && data.password === decode.password) {

        if(!user.validated) {
            res.status(401).json({ error: { validated: { msg: 'Usuário precisa validar a conta'} } });
            return;
        }

        const token = JWT.sign({
            password: user.password},
            process.env.JWT_SECRET_TOKEN as string
        );
        
        user.token = token;

        await user.save();

        res.status(200).json({ token });

    } else {

        res.status(401).json({ error: { login: { msg: 'E-mail e/ou Senha incorreto'} } });

    }

};

export const tokenSignin = async (req: Request, res: Response) => {

    const { token } = req.body;

    const user = await userModel.findOne({ token });

    if(!user) {

        res.status(401).json({ error: { login: { msg: 'E-mail e/ou Senha incorreto'} } });
        return;

    } else {

        if(!user.validated) {
            res.status(401).json({ error: { validated: { msg: 'Usuário precisa validar a conta'} } });
            return;
        }

        const newToken = JWT.sign({
            password: user?.password},
            process.env.JWT_SECRET_TOKEN as string
        );
    
        user.token = newToken;

        await user.save();

        res.status(200).json({ token: newToken });
    }
}

export const Signup = async (req: Request, res: Response) => {

    // Validando dados
    const error = validationResult(req);
    if(!error.isEmpty()) {
        res.status(400).json({ error: error.mapped() });
        return;
    }
    const data = matchedData(req);

    // Verificando se o usuário já existe
    const user = await userModel.findOne({ email: data.email });

    if(user) {
        res.status(400).json({ error: { email: { msg: 'E-mail já possui cadastro', value: data.email} } });
        return;
    }

    const password = JWT.sign({ 
        email: data.email, 
        password: data.password },
        process.env.JWT_SECRET_KEY as string
    );

    const token = JWT.sign({
        password},
        process.env.JWT_SECRET_TOKEN as string
    );

    const newUser = new userModel;
    newUser.name.firstName = data.firstName;
    newUser.name.lastName = data.lastName;
    newUser.email = data.email;
    newUser.password = password;
    newUser.token = token;
    if(data.phone) {
        newUser.phone = data.phone;
    }

    await newUser.save();

    const sendEmail = await EmailService.accountAuthentication(data.email);

    if(!sendEmail) {
        res.json({ error: { email: { msg: 'Não foi possivel enviar o E-mail'} } });
        return;
    }

    res.status(200).json({token});
 
};

export const AccountAuthentication = async (req: Request, res: Response) => {

    const { token } = req.body;

    if(!token) {
        res.status(401).json({ notAllowed: true });
        return;
    }

    try {

        const decode = JWT.verify(token, process.env.JWT_SECRET_KEY as string) as RecoverType;

        const user = await userModel.findOne({ email: decode.email });

        if(decode.token === process.env.JWT_SECRET_CONFIRM as string && user) {
    
            user.validated = true;
    
            await user.save();
    
            res.json({ token: user.token });
    
        } else {
            res.status(401).json({ error: { email: { msg: 'Token e/ou usuário inválido'} } });
            return;
        }

    } catch(error) {
        res.status(401).json({ error: { email: { msg: 'Token e/ou usuário inválido'} } });
        return;
    }

};

export const RecoverPassword = async (req: Request, res: Response) => {

    const { email } = req.body;

    const user = await userModel.findOne({email});

    if(!user) {
        res.status(401).json({ error: { login: { msg: 'E-mail e incorreto'} } });
        return;
    }

    const sendEmail = await EmailService.recoverPassword(email);

    if(!sendEmail) {
        res.json({ error: { email: { msg: 'Não foi possivel enviar o E-mail'} } });
        return;
    }

    res.json({ send: true });
};

export const UpdatePassword = async (req: Request, res: Response) => {

    const error = validationResult(req);
    if(!error.isEmpty()) {
        res.status(400).json({ error: error.mapped() });
        return;
    }
    
    const data = matchedData(req);

    try {

        const decode = JWT.verify(data.token, process.env.JWT_SECRET_KEY as string) as RecoverType;

        const user = await userModel.findOne({ email: decode.email });

        if(decode.token === process.env.JWT_SECRET_RECOVER as string && user) {

            const password = JWT.sign({ 
                email: user.email, 
                password: data.password },
                process.env.JWT_SECRET_KEY as string
            );
        
            const token = JWT.sign({
                password},
                process.env.JWT_SECRET_TOKEN as string
            );

            user.password = password;
            user.token = token;
    
            await user.save();
    
            res.json({ token });
    
        } else {
            res.status(401).json({ error: { email: { msg: 'Token inválido'} } });
            return;
        }

    } catch(error) {
        res.status(401).json({ error: { email: { msg: 'Token inválido'} } });
        return;
    }

};
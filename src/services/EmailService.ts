import sgMail from '@sendgrid/mail';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import JWT, { TokenExpiredError } from 'jsonwebtoken';

dotenv.config();

export const EmailService = {

    accountAuthentication: async (email: string) => {

        const token = JWT.sign(
            { email: email ,token: process.env.JWT_SECRET_CONFIRM as string },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '1h' }
        );

        let link: string = `http://localhost:2000/accountauthentication?token=${token}`;

        let htmlTxt: string = `
        <html lang='pt-BR'>
        <head>
            <meta charset='UTF-8'>
            <meta http-equiv='X-UA-Compatible' content='IE=edge'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>devShope Autenticação de Conta</title>
        </head>
        <style>
        
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');
        
            * {
                box-sizing: border-box;
                margin: 0;
                font-family: 'Montserrat', sans-serif;
            }
        
            body {
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: center;
                gap: 10px;
                padding: 30px;
            }
        
            h1 {
                color: #f000b8;
            }
        
            p {
                text-align: justify;
                text-indent: 20px;
            }
        
            .btn {
                color: #fff;
                font-weight: 600;
                margin-inline: auto;
                text-decoration: none;
                padding-top: 10px;
                padding-bottom: 10px;
                padding-left: 5px;
                padding-right: 5px;
                border: 2px solid #f000b8;
                background: #f000b8;
                border-radius: 10px;
                width: 200px;
                box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.295);
            }
        
            .btn:hover {
                color:#f000b8;
                background: #fff;
            }
        
            .btn:active {
                opacity: 50%;
            }
        
            label {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
                width: 100%;
                font-weight: 600;
            }
        </style>
        <body>
            <h1>devShope</h1>
            <br>
            <p>Estamos quase lá, para confirmar sua conta de E-mail basta clicar no link abaixo para finalizar seu cadastro</p>
            <br>
            <a href='${link}' target='_blank' class='btn'>Clique Aqui</a>
            <br>
            <label>
                <span>responsável técnico:</span>
                <a href='https://github.com/LeandroTRibeiro' target='_blank'>Leandro Thiago Ribeiro</a>
            </label>
            <label>
                <span>E-mail para contato:</span>
                <a href='mailto:leandrothiago_ribeiro@hotmail.com?subject=Suporte DevChat' target='_blank'>leandrothiago_ribeiro@hotmail.com</a>
            </label>
        </body>
        </html>`;

        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

        const msg = {
            to: email,
            from: 'leandrothiago_ribeiro@hotmail.com',
            subject: 'devShope Confirmação de E-mail',
            html: htmlTxt
        };

        try {

            const emailtxt = await sgMail.send(msg);
            return true;

        } catch(error) {

            console.log(error);
            return false;
        }

    },
    recoverPassword: async (email: string) => {
        const token = JWT.sign(
            { email: email ,token: process.env.JWT_SECRET_RECOVER as string },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: '1h' }
        );

        let link: string = `http://localhost:2000/recoverpassword?token=${token}`;

        let htmlTxt: string = `
        <html lang='pt-BR'>
        <head>
            <meta charset='UTF-8'>
            <meta http-equiv='X-UA-Compatible' content='IE=edge'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>devShope Recuperação de Senha</title>
        </head>
        <style>
        
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap');
        
            * {
                box-sizing: border-box;
                margin: 0;
                font-family: 'Montserrat', sans-serif;
            }
        
            body {
                display: flex;
                flex-direction: column;
                justify-content: center;
                text-align: center;
                gap: 10px;
                padding: 30px;
            }
        
            h1 {
                color: #f000b8;
            }
        
            p {
                text-align: justify;
                text-indent: 20px;
            }
        
            .btn {
                color: #fff;
                font-weight: 600;
                margin-inline: auto;
                text-decoration: none;
                padding-top: 10px;
                padding-bottom: 10px;
                padding-left: 5px;
                padding-right: 5px;
                border: 2px solid #f000b8;
                background: #f000b8;
                border-radius: 10px;
                width: 200px;
                box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.295);
            }
        
            .btn:hover {
                color:#f000b8;
                background: #fff;
            }
        
            .btn:active {
                opacity: 50%;
            }
        
            label {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
                width: 100%;
                font-weight: 600;
            }
        </style>
        <body>
            <h1>devShope</h1>
            <br>
            <p>Estamos quase lá, para liberar a recuperação de Senha basta clicar no link abaixo para encaminharmos você para a página de recupeção de senha</p>
            <br>
            <a href='${link}' target='_blank' class='btn'>Clique Aqui</a>
            <br>
            <label>
                <span>responsável técnico:</span>
                <a href='https://github.com/LeandroTRibeiro' target='_blank'>Leandro Thiago Ribeiro</a>
            </label>
            <label>
                <span>E-mail para contato:</span>
                <a href='mailto:leandrothiago_ribeiro@hotmail.com?subject=Suporte DevChat' target='_blank'>leandrothiago_ribeiro@hotmail.com</a>
            </label>
        </body>
        </html>`;

        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

        const msg = {
            to: email,
            from: 'leandrothiago_ribeiro@hotmail.com',
            subject: 'devShope Recuperação de Senha',
            html: htmlTxt
        };

        try {

            const emailtxt = await sgMail.send(msg);
            return true;

        } catch(error) {

            console.log(error);
            return false;
        }
    }
};


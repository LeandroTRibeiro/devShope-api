import { checkSchema } from "express-validator";

export const AuthValidator = {
    signin: checkSchema({
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail inválido'
        },
        password: {
            trim: true,
            isLength: {
                options: { min: 6 }
            },
            errorMessage: 'Senha precisa ter pelo menor 6 caracteres'
        }
    }),
    signup: checkSchema({
        firstName: {
            trim: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Nome precisa ter pelo menos 2 caracteres!'
        },
        lastName: {
            trim: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Sobrenome precisa ter pelo menos 2 caracteres!'
        },
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail inválido'
        },
        password: {
            trim: true,
            isLength: {
                options: { min: 6 }
            },
            errorMessage: 'Senha precisa ter pelo menos 6 caracteres'
        },
        phone: {
            optional: true,
            isMobilePhone: true,
            errorMessage: 'Telefone precisa ser um número de telefone válido'
        }
    }),
    updatePassword: checkSchema({
        password: {
            trim: true,
            isLength: {
                options: { min: 6 }
            },
            errorMessage: 'Senha precisa ter pelo menos 6 caracteres'
        },
        token: {
            isLength: {
                options: { min: 10 }
            },
            errorMessage: 'Token inválido'
        }
    })
}
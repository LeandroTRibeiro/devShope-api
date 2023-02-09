import { checkSchema } from "express-validator";


export const UserValidator = {
    editInfo: checkSchema({
        token: {
            notEmpty: true
        },
        firstName: {
            optional: true,
            trim: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Nome precisa ter pelo menos 2 caracteres!'
        },
        lastName: {
            optional: true,
            trim: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Sobrenome precisa ter pelo menos 2 caracteres!'
        },
        email: {
            optional: true,
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail inválido'
        },
        password: {
            optional: true,
            trim: true,
            isLength: {
                options: { min: 6 }
            },
            errorMessage: 'Senha precisa ter pelo menor 6 caracteres'
        },
        phone: {
            optional: true,
            isMobilePhone: true,
            errorMessage: 'Telefone precisa ser um número valido'
        }
    })
}
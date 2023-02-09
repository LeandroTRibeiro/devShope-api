import { checkSchema } from "express-validator";

export const AddressValidator = {
    addAddress: checkSchema({
        token: {
            notEmpty: true
        },
        zipCode: {
            trim: true,
            isLength: {
                options: { min: 8, max: 8 }
            },
            errorMessage: 'CEP precisa ter 8 caracteres'
        },
        country: {
            trim: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'País tem que ter pelo menos 2 caracteres'
        },
        city: {
            trim: true,
            isLength: {
                options: { min: 3 }
            },
            errorMessage: 'Cidade deve ter pelo menos 3 caracteres'
        },
        district: {
            trim: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Estado deve ter pelo menos 2 caracteres'
        },
        street: {
            notEmpty: true,
            errorMessage: 'Rua não foi enviado'
        },
        number: {
            notEmpty: true,
            errorMessage: 'Número não foi enviado'
        },
        complement: {
            optional: true,
            notEmpty: true,
            errorMessage: 'Complemento não foi enviado'

        },
        name: {
            optional: true,
            notEmpty: true,
            errorMessage: 'Nome do residencial não foi enviado'
        },
        block: {
            optional: true,
            notEmpty: true,
            errorMessage: 'Nome do bloco não foi enviado'
        },
        apartmentNumber: {
            optional: true,
            notEmpty: true,
            errorMessage: 'Número do apartamento não foi enviado'
        }
    }),
    editAddress: checkSchema({
        token: {
            notEmpty: true
        },
        zipCode: {
            optional: true,
            trim: true,
            isLength: {
                options: { min: 8, max: 8 }
            },
            errorMessage: 'CEP precisa ter 8 caracteres'
        },
        country: {
            optional: true,
            trim: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'País tem que ter pelo menos 2 caracteres'
        },
        city: {
            optional: true,
            trim: true,
            isLength: {
                options: { min: 3 }
            },
            errorMessage: 'Cidade deve ter pelo menos 3 caracteres'
        },
        district: {
            optional: true,
            trim: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Estado deve ter pelo menos 2 caracteres'
        },
        street: {
            optional: true,
            notEmpty: true,
            errorMessage: 'Rua não foi enviado'
        },
        number: {
            optional: true,
            notEmpty: true,
            errorMessage: 'Número não foi enviado'
        },
        complement: {
            optional: true,
            notEmpty: true,
            errorMessage: 'Complemento não foi enviado'

        },
        name: {
            optional: true,
            notEmpty: true,
            errorMessage: 'Nome do residencial não foi enviado'
        },
        block: {
            optional: true,
            notEmpty: true,
            errorMessage: 'Nome do bloco não foi enviado'
        },
        apartmentNumber: {
            optional: true,
            notEmpty: true,
            errorMessage: 'Número do apartamento não foi enviado'
        }
    })
}
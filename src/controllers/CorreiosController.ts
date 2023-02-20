import { consultarCep, calcularPrecoPrazo } from "correios-brasil/dist";
import { Request, Response } from "express";
import adsModel from "../models/Ads";
import userModel from "../models/User";

export const getDelivery = async (req: Request, res: Response) => {

    const { product, zipCode, token } = req.body;

    if(!product) {

        res.status(400).json({ error: { product: { msg: 'Faltam dados'} } });
        return;

    }

    if(zipCode || token) {

        if(token) {

            const user = await userModel.findOne({token});

            if(!user) {
                res.status(401).json({ error: { email: { msg: 'Token e/ou usuário inválido'} } });
                return;
            }

            if(!user.address.zipCode) {

                res.status(401).json({ error: { zipCode: { msg: 'Usuario sem endereço cadastrado'} } });
                return;
            }

            const productDelivery = await adsModel.findOne({ _id: product });

            if(!productDelivery) {
                res.status(400).json({ error: { product: { msg: 'Produto inexistente'} } });
                return;
            }

            const args = {
                sCepOrigem: productDelivery.cepOrigin,
                sCepDestino: user.address.zipCode,
                nVlPeso: productDelivery.weight,
                nCdFormato: productDelivery.format,
                nVlComprimento: productDelivery.length,
                nVlAltura: productDelivery.height,
                nVlLargura: productDelivery.width,
                nCdServico: [productDelivery.deliveryService[0], productDelivery.deliveryService[1]],
                nVlDiametro: productDelivery.diameter
            };

            const deliveryInfo = await calcularPrecoPrazo(args);

            console.log(args);

            res.json({ deliveryInfo });

        }

    } else {

        res.status(400).json({ error: { zipCodeOrToken: { msg: 'Faltam dados'} } });
        return;
    }

}
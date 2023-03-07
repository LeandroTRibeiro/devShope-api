import { calcularPrecoPrazo } from "correios-brasil/dist";
import adsModel from "../models/Ads";

export const delivery = {
    getDelivery: async (product: string, zipCode: string) => {

        const productDelivery = await adsModel.findOne({ _id: product });

        if(productDelivery) {
            const args = {
                sCepOrigem: productDelivery.cepOrigin,
                sCepDestino: zipCode,
                nVlPeso: productDelivery.weight,
                nCdFormato: productDelivery.format,
                nVlComprimento: productDelivery.length,
                nVlAltura: productDelivery.height,
                nVlLargura: productDelivery.width,
                nCdServico: [productDelivery.deliveryService[0], productDelivery.deliveryService[1]],
                nVlDiametro: productDelivery.diameter
            };

            const deliveryInfo = await calcularPrecoPrazo(args);

            if(deliveryInfo[0].Valor === "0,00") {

                const deliveryError = {
                    delivery: "Não é possivel entregar neste endereço!"
                }

                return deliveryError;
            }

            return deliveryInfo;
        }



    }
}
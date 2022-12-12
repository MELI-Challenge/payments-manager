import joi from '@hapi/joi'
import { PaymentModel } from './interfaces'

export const paymentValidateSchema = joi.object<PaymentModel>({
  id_transaccion: joi.number().required(),
  estado: joi.string().required()
})

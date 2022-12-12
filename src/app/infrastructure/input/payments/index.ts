import { Payment } from '@src/app/domain/entities/payment'
import { ResultPromise } from '@src/utils/result'
import { validateSchema, ValidateSchemaError } from '@src/utils/schema'
import { PaymentModel } from './interfaces'
import { paymentValidateSchema } from './schemas'

export const tryToMapPayment = (paymentModel: PaymentModel): ResultPromise<Payment, ValidateSchemaError> => {
  return ResultPromise.fromResult(
    validateSchema(paymentValidateSchema, paymentModel)
      .mapFailure((e) => e)
      .map<Payment>((r) => ({
        id: r.id_transaccion,
        status: r.estado
      }))
  )
}

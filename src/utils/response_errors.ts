import { HttpStatusCode } from './httpStatusCodes'

export enum ErrorsResponseCodes {
  ValidateSchemaError = HttpStatusCode.BadRequest,
  GetPaymentError = HttpStatusCode.InternalServerError,
  PaymentNotFound = HttpStatusCode.NotFound,
  Unknown = HttpStatusCode.InternalServerError
}

type ErrorCodes = 'ValidateSchemaError' | 'GetPaymentError' | 'PaymentNotFound' | 'Unknown'

export const getErrorStatusCode = (code: ErrorCodes) => {
  return ErrorsResponseCodes[code as keyof typeof ErrorsResponseCodes]
}

type BaseError<TCode extends string> = {
  readonly type: 'InfrastructureFailure'
  readonly code: TCode
  readonly message?: string
}
type GetPaymentError = BaseError<'GetPaymentError'>
type PaymentNotFound = BaseError<'PaymentNotFound'>

export type DatabaseOperationError = GetPaymentError | PaymentNotFound

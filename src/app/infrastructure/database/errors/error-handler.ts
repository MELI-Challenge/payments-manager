import { DatabaseOperationError } from './interfaces'

export const databaseOperationErrorHandler = {
  onGetPaymentError: (): DatabaseOperationError => {
    console.error('[InfrastructureFailure] GetPaymentError')
    return {
      type: 'InfrastructureFailure',
      code: 'GetPaymentError'
    }
  },
  onPaymentNotFound: (): DatabaseOperationError => {
    console.error('[InfrastructureFailure] PaymentNotFound')
    return {
      type: 'InfrastructureFailure',
      code: 'PaymentNotFound'
    }
  }
}

import { Failure, Result, ResultPromise, Success } from '@src/utils/result'
import { get, isEmpty } from 'lodash'
import { PaymentModel } from '../input/payments/interfaces'
import { databaseOperationErrorHandler } from './errors/error-handler'
import { DatabaseOperationError } from './errors/interfaces'
import MockUtils from './mocks'

export interface MakeMockDBOperations {
  getPayment: (paymentId: string) => ResultPromise<PaymentModel, DatabaseOperationError>
}

export const loadMockDBClient = (): Result<MockUtils, unknown> => {
  const mockUtils = new MockUtils()
  return Success(mockUtils)
}

const handleDatabaseSuccess = <T>(r: any, notFoundHandler: () => DatabaseOperationError) => {
  return isEmpty(r) ? Failure<T, DatabaseOperationError>(notFoundHandler()) : Success<T, DatabaseOperationError>(r)
}

const handleDatabaseError = <T>(
  e: any,
  notFoundHandler: () => DatabaseOperationError,
  errorHandler: () => DatabaseOperationError
) => {
  const status = get(e, 'status')
  const error = status === 404 ? notFoundHandler() : errorHandler()
  return Failure<T, DatabaseOperationError>(error)
}

export const makeMockDBOperations = (mockUtils: MockUtils): MakeMockDBOperations => {
  const getPayment = (paymentId: string): ResultPromise<PaymentModel, DatabaseOperationError> => {
    return ResultPromise.fromPromise<PaymentModel, DatabaseOperationError>(
      Promise.resolve(
        mockUtils
          .getPayment(paymentId)
          .then((r) => handleDatabaseSuccess<PaymentModel>(r, databaseOperationErrorHandler.onPaymentNotFound))
          .catch((e) =>
            handleDatabaseError<PaymentModel>(
              e,
              databaseOperationErrorHandler.onPaymentNotFound,
              databaseOperationErrorHandler.onGetPaymentError
            )
          )
      )
    )
  }

  return {
    getPayment
  }
}

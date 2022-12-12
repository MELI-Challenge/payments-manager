import { ApiError, ApiResponse } from '@src/utils/interfaces'
import { Request, Response, Router } from 'express'
import { MakeMockDBOperations } from '../../database'
import { tryToMapPayment } from '../../input/payments'
import {
  handleDatabaseOperationError,
  mappingErrorHandler,
  mappingSuccessHandler
} from '../../input/utils/api-responses-handlers'

const getPaymentHandler = async (req: Request, res: Response, databaseOperations: MakeMockDBOperations) => {
  const { paymentId } = req.params
  return databaseOperations
    .getPayment(paymentId)
    .thenMapFailure<ApiError>(handleDatabaseOperationError)
    .thenBindAsync<ApiResponse>((foundPayment) => {
      return tryToMapPayment(foundPayment)
        .thenMap<ApiResponse>(mappingSuccessHandler)
        .thenMapFailure(mappingErrorHandler)
    })
    .then((r) =>
      r.either(
        (apiResponse) => {
          return res.status(apiResponse.status).send(apiResponse.payload)
        },
        (e) => {
          return res.status(e.status).send({
            type: e.type,
            code: e.code
          })
        }
      )
    )
}

export const getPaymentRoute = (router: Router, databaseOperations: MakeMockDBOperations): Router => {
  return router.get('/payment/:paymentId', (req, res) => getPaymentHandler(req, res, databaseOperations))
}

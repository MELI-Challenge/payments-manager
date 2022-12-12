import MockUtils from '@src/app/infrastructure/database/mocks'
import { Router } from 'express'
import { makeMockDBOperations } from '../database'
import { getPaymentRoute } from './payment'

export const routes = (router: Router, mockClient: MockUtils) => {
  const databaseOperations = makeMockDBOperations(mockClient)
  return [getPaymentRoute(router, databaseOperations)]
}

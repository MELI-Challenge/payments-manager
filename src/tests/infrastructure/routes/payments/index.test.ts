import { loadApp } from '@src/app'
import express from 'express'
import supertest from 'supertest'
import { mock, mockDeep } from 'jest-mock-extended'
import MockUtils from '@src/app/infrastructure/database/mocks'
import { cloneDeep, set } from 'lodash'
import { Payment } from '@src/app/domain/entities/payment'
import { PaymentModel } from '@src/app/infrastructure/input/payments/interfaces'
import { HttpStatusCode } from '@src/utils/httpStatusCodes'

const dummyPaymentModel: PaymentModel = {
  id_transaccion: 7010191,
  estado: 'realizada'
}
const dummyPaymentDomain: Payment = {
  id: 7010191,
  status: 'realizada'
}

describe('Client route', () => {
  const app = express()
  const router = express.Router()
  const mockClient = mock<MockUtils>()
  const server = loadApp(app, router, mockClient)
  const apiRoute = '/api/v1/payment/'

  beforeEach(() => {})

  afterEach(async () => {})
  it('Should return payment data and status 200', async () => {
    mockClient.getPayment.mockImplementation(() => Promise.resolve(dummyPaymentModel))

    const request = supertest(server)
    await request
      .get(apiRoute + '7010191')
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual(dummyPaymentDomain)
      })
  })
  it('Should return an error and 404 if no payment found', async () => {
    let error = new Error()
    mockClient.getPayment.mockImplementation(() => Promise.resolve({} as any))

    const request = supertest(server)
    await request
      .get(apiRoute + '7010191')
      .expect(404)
      .then((response) => {
        expect(response.body.code).toBe('PaymentNotFound')
      })
  })
  it('Should return an error and 500 if error is thrown', async () => {
    let error = new Error()
    mockClient.getPayment.mockImplementation(() => Promise.reject(error))

    const request = supertest(server)
    await request
      .get(apiRoute + '7010191')
      .expect(500)
      .then((response) => {
        expect(response.body.code).toBe('GetPaymentError')
      })
  })

  it('Should return an error and 500 if schema validation fails', async () => {
    const dummyBadFormat = cloneDeep(dummyPaymentModel)
    dummyBadFormat.estado = undefined as any
    mockClient.getPayment.mockImplementation(() => Promise.resolve(dummyBadFormat))

    const request = supertest(server)
    await request
      .get(apiRoute + '7010191')
      .expect(HttpStatusCode.BadRequest)
      .then((response) => {
        expect(response.body.code).toBe('ValidateSchemaError')
      })
  })

  it('Should return the error code if not found', async () => {
    let error = new Error('Not found')
    set(error, 'status', 404)
    mockClient.getPayment.mockImplementation(() => Promise.reject(error))

    const request = supertest(server)
    await request
      .get(apiRoute + '7010191')
      .expect(HttpStatusCode.NotFound)
      .then((response) => {
        expect(response.body.code).toBe('PaymentNotFound')
      })
  })
})

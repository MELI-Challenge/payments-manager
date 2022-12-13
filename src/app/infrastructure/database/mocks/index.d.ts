import { PaymentModel } from '../../input/payments/interfaces'

export default class MockUtils {
  private _readJSON(
    jsonFile: Record<string, any>,
    parameter: string | null,
    timeout: number,
    notFoundErrorMessage: string
  ): Promise<any>

  getPayment(paymentId: string): Promise<PaymentModel>
}

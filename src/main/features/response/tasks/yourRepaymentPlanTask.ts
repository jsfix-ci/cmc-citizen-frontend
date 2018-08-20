import { Validator } from 'class-validator'
import { PaymentPlan } from 'shared/components/payment-intention/model/paymentPlan'

const validator = new Validator()

function isValid (input): boolean {
  return input !== undefined && validator.validateSync(input).length === 0
}

export class YourRepaymentPlanTask {
  static isCompleted (paymentPlan: PaymentPlan): boolean {
    return isValid(paymentPlan)
  }
}

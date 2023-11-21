import validator from 'validator'

import {
  serverError,
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  created,
  validateRequiredFields,
} from '../helpers/index.js'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }
  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

      const requiredFieldsValidation = validateRequiredFields(
        params,
        requiredFields,
      )
      if (!requiredFieldsValidation.ok) {
        return badRequest({
          message: `The field "${requiredFieldsValidation.missingField}" is required`,
        })
      }

      const userIdIsValid = checkIfIdIsValid(params.user_id)

      if (!userIdIsValid) {
        return invalidIdResponse()
      }

      if (params.amount <= 0) {
        return badRequest({ message: 'The amount must be greater than 0.' })
      }

      const amountIsValid = validator.isCurrency(params.amount.toString(), {
        digits_after_decimal: [2],
        allow_decimal: false,
        decimal_separator: '.',
      })

      if (!amountIsValid) {
        return badRequest({ message: 'The amount must be a valid currency.' })
      }

      const type = params.type.trim().toUpperCase()

      const typeIsValid = ['EARNING', 'EXPENSIVE', 'INVESTMENT'].includes(type)

      if (!typeIsValid) {
        return badRequest({
          message: 'The type must be EARNING, EXPENSIVE or INVESTMENT',
        })
      }

      const transaction = await this.createTransactionUseCase.execute({
        ...params,
        type,
      })

      return created(transaction)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

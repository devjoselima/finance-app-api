import validator from 'validator'

import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { EmailAlreadyInUseError } from '../errors/user.js'
import { badRequest, serverError, success } from './helpers/http.js'
import {
  emailIsAlreadyInUseResponse,
  invalidPasswordResponse,
  invalidIdResponse,
  checkIfPasswordIsValid,
  checkIfEmailIsValid,
} from './helpers/user.js'

export class UpdateUserController {
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId
      const isIdValid = validator.isUUID(userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      const params = httpRequest.body

      const allowedFields = ['first_name', 'last_name', 'email', 'password']

      const someFieldIsNotAllowed = Object.keys(params).some(
        (field) => !allowedFields.includes(field),
      )

      if (someFieldIsNotAllowed) {
        return badRequest({ message: 'Some provided field is not allowed' })
      }

      if (params.password) {
        const passwordIsValid = checkIfPasswordIsValid(params.password)

        if (!passwordIsValid) {
          return invalidPasswordResponse()
        }
      }

      if (params.email) {
        const emailIsValid = checkIfEmailIsValid(params.email)

        if (!emailIsValid) {
          return emailIsAlreadyInUseResponse()
        }
      }
      const updateUserUseCase = new UpdateUserUseCase()
      const updatedUser = await updateUserUseCase.execute(userId, params)

      return success(updatedUser)
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message })
      }
      console.error(error)
      return serverError()
    }
  }
}

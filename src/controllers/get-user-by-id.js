import validator from 'validator'

import { EmailAlreadyInUseError } from '../errors/user.js'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { notFound, success, badRequest } from './helpers/http.js'
import { invalidIdResponse } from './helpers/user.js'

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const isIdValid = validator.isUUID(httpRequest.params.userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }
      const getUserByIdUseCase = new GetUserByIdUseCase()

      const user = await getUserByIdUseCase.execute(httpRequest.params.userId)

      if (!user) {
        return notFound({ message: 'User not found' })
      }

      return success(user)
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message })
      }
      console.error(error)
      return notFound({ message: "User id doesn't exists" })
    }
  }
}

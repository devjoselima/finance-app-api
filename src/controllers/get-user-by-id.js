import { EmailAlreadyInUseError } from '../errors/user.js'
import { GetUserByIdUseCase } from '../use-cases/index.js'
import {
  checkIfIdIsValid,
  invalidIdResponse,
  notFound,
  success,
  badRequest,
  userNotFoundResponse,
} from './helpers/index.js'

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId
      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }
      const getUserByIdUseCase = new GetUserByIdUseCase()

      const user = await getUserByIdUseCase.execute(httpRequest.params.userId)

      if (!user) {
        return userNotFoundResponse()
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

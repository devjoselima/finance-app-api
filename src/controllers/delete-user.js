import { DeleteUserUseCase } from '../use-cases/index.js'
import {
  checkIfIdIsValid,
  invalidIdResponse,
  userNotFoundResponse,
  serverError,
  success,
} from './helpers/index.js'

export class DeleteUserController {
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId
      const idIsValid = checkIfIdIsValid(userId)

      if (!idIsValid) {
        return invalidIdResponse()
      }

      const deleteUserUseCase = new DeleteUserUseCase()

      const deletedUser = await deleteUserUseCase.execute(userId)

      if (!deletedUser) {
        return userNotFoundResponse()
      }

      return success(deletedUser)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

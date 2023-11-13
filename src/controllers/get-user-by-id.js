import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { notFound, success, badRequest } from './helper.js'
import validator from 'validator'

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const isIdValid = validator.isUUID(httpRequest.params.userId)

      if (!isIdValid) {
        return badRequest({
          message: 'The provided id is not valid',
        })
      }
      const getUserByIdUseCase = new GetUserByIdUseCase()

      const user = await getUserByIdUseCase.execute(httpRequest.params.userId)

      return success(user)
    } catch (error) {
      console.error(error)
      return notFound({ message: "User id doesn't exists" })
    }
  }
}

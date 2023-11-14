import validator from 'validator'
import { CreateUserUseCase } from '../use-cases/create-user.js'
import { badRequest, created, serverError } from './helper.js'

export class CreateUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body
      const requiredFields = ['first_name', 'last_name', 'email', 'password']

      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return badRequest({ message: `Missing param: ${field}` })
        }
      }

      const passwordIsNotValid = params.password.length < 6

      if (passwordIsNotValid) {
        return badRequest({ message: 'Password must be at least 6 characters' })
      }

      const emailIsValid = validator.isEmail(params.email)

      if (!emailIsValid) {
        return badRequest({
          message: 'Invalid e-mail. Please provide a valid one.',
        })
      }

      const createUserUseCase = new CreateUserUseCase()

      const createdUser = await createUserUseCase.execute(params)

      return created(createdUser)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}

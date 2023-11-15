import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import {
  PostgresCreateUserRepository,
  PostgresGetUserByEmailRepository,
} from '../repositories/postgres/index.js'

import { EmailAlreadyInUseError } from '../errors/user.js'
export class CreateUserUseCase {
  async execute(createUserParams) {
    const postgresGetUserByEmailRepository =
      new PostgresGetUserByEmailRepository()

    const userEmailALreadyExistis =
      await postgresGetUserByEmailRepository.execute(createUserParams.email)

    if (userEmailALreadyExistis) {
      throw new EmailAlreadyInUseError(createUserParams.email)
    }

    const userId = uuidv4()
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    }

    const postgresCreateUserRepository = new PostgresCreateUserRepository()

    const createdUser = await postgresCreateUserRepository.execute(user)

    return createdUser
  }
}

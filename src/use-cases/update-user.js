import bcrypt from 'bcrypt'

import { EmailAlreadyInUseError } from '../errors/user.js'
import {
  PostgresGetUserByEmailRepository,
  PostgresUpdateUserRepository,
} from '../repositories/postgres/index.js'

export class UpdateUserUseCase {
  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository()

      const userEmailAlreadyExistis =
        await postgresGetUserByEmailRepository.execute(updateUserParams.email)

      if (userEmailAlreadyExistis && userEmailAlreadyExistis.id !== userId) {
        throw new EmailAlreadyInUseError(updateUserParams.email)
      }
    }

    const user = {
      ...updateUserParams,
    }

    if (updateUserParams.password) {
      const hashedPassword = await bcrypt.hash(updateUserParams.password, 10)
      user.password = hashedPassword
    }

    const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
    const updatedUser = await postgresUpdateUserRepository.execute(
      userId,
      updateUserParams,
    )

    return updatedUser
  }
}

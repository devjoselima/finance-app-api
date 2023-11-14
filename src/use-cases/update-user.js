import bcrypt from 'bcrypt'

import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'
import { EmailAlreadyInUseError } from '../erros/user.js'
import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user.js'

export class UpdateUserUseCase {
  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const postgresGetUserByEmailRepository =
        new PostgresGetUserByEmailRepository()

      const userEmailALreadyExistis =
        await postgresGetUserByEmailRepository.execute(updateUserParams.email)

      if (userEmailALreadyExistis) {
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
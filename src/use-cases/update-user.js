import bcrypt from 'bcrypt'

import { EmailAlreadyInUseError } from '../errors/user.js'
export class UpdateUserUseCase {
  constructor(postgresGetUserByEmailRepository, postgresUpdateUserRepository) {
    this.postgresGetUserByEmailRepository = postgresGetUserByEmailRepository
    this.postgresUpdateUserRepository = postgresUpdateUserRepository
  }
  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const userEmailAlreadyExistis =
        await this.postgresGetUserByEmailRepository.execute(
          updateUserParams.email,
        )

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
    const updatedUser = await this.postgresUpdateUserRepository.execute(
      userId,
      updateUserParams,
    )

    return updatedUser
  }
}

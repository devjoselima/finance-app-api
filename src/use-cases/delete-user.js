import { PostgresDeleteUserRepository } from '../repositories/postgres/index.js'

export class DeleteUserUseCase {
  async execute(userId) {
    const postgresDeleteUserRepository = new PostgresDeleteUserRepository()

    const deletedUser = await postgresDeleteUserRepository.execute(userId)

    return deletedUser
  }
}

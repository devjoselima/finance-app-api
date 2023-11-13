import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'

export class CreateUserUseCase {
  async execute(createUserParams) {
    // gerar ID do usuário
    const userId = uuidv4()

    // criptografar senha
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

    // inserir o usuário no banco
    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    }

    // chamar o repository
    const postgresCreateUserRepository = new PostgresCreateUserRepository()

    const createdUser = await postgresCreateUserRepository.execute(user)

    return createdUser
  }
}

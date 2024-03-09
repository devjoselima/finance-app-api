import { v4 as uuidv4 } from 'uuid'

import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserUseCase {
    constructor(
        postgresGetUserByEmailRepository,
        postgresCreateUserRepository,
        passwordHasherAdapter,
    ) {
        this.postgresGetUserByEmailRepository = postgresGetUserByEmailRepository
        this.postgresCreateUserRepository = postgresCreateUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
    }

    async execute(createUserParams) {
        const userEmailAlreadyExistis =
            await this.postgresGetUserByEmailRepository.execute(
                createUserParams.email,
            )

        if (userEmailAlreadyExistis) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        const userId = uuidv4()
        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password,
        )

        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        const createdUser =
            await this.postgresCreateUserRepository.execute(user)

        return createdUser
    }
}

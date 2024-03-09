import { EmailAlreadyInUseError } from '../../errors/user.js'
export class UpdateUserUseCase {
    constructor(
        postgresGetUserByEmailRepository,
        postgresUpdateUserRepository,
        passwordHasherAdapter,
    ) {
        this.postgresGetUserByEmailRepository = postgresGetUserByEmailRepository
        this.postgresUpdateUserRepository = postgresUpdateUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
    }
    async execute(userId, updateUserParams) {
        if (updateUserParams.email) {
            const userEmailAlreadyExistis =
                await this.postgresGetUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (
                userEmailAlreadyExistis &&
                userEmailAlreadyExistis.id !== userId
            ) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }

        const user = {
            ...updateUserParams,
        }

        if (updateUserParams.password) {
            const hashedPassword = await this.passwordHasherAdapter.execute(
                updateUserParams.password,
            )
            user.password = hashedPassword
        }
        const updatedUser = await this.postgresUpdateUserRepository.execute(
            userId,
            updateUserParams,
        )

        return updatedUser
    }
}

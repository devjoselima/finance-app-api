import {
    checkIfIdIsValid,
    invalidIdResponse,
    userNotFoundResponse,
    serverError,
    success,
} from '../helpers/index.js'

export class DeleteUserController {
    constructor(deleteUserUseCase) {
        this.deleteUserUseCase = deleteUserUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const idIsValid = checkIfIdIsValid(userId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deletedUser = await this.deleteUserUseCase.execute(userId)

            if (!deletedUser) {
                return userNotFoundResponse()
            }

            return success(deletedUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}

import { UserNotFoundError } from '../../errors/user.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    requiredFieldIsMissingResponse,
    serverError,
    success,
    userNotFoundResponse,
} from '../helpers/index.js'

export class getTransactionsByUserIdController {
    constructor(getTransactionsByUserUseCase) {
        this.getTransactionsByUserUseCase = getTransactionsByUserUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId

            if (!userId) {
                return requiredFieldIsMissingResponse('userId')
            }

            const userIdIsValid = checkIfIdIsValid(userId)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            const transactions =
                await this.getTransactionsByUserUseCase.execute({
                    userId,
                })

            return success(transactions)
        } catch (error) {
            console.error(error)

            if (error instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return serverError()
        }
    }
}

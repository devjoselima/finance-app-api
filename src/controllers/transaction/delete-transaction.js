import {
    ServerError,
    checkIfIdIsValid,
    invalidIdResponse,
    success,
} from '../index.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid()
            if (!idIsValid) {
                return invalidIdResponse()
            }

            const transaction = await this.deleteTransactionUseCase.execute(
                httpRequest.params.transactionId,
            )

            return success(transaction)
        } catch (error) {
            console.error(error)
            return ServerError()
        }
    }
}

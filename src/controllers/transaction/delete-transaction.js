import {
    serverError,
    checkIfIdIsValid,
    invalidIdResponse,
    success,
    transactionNotFoundResponse,
} from '../helpers/index.js'

export class DeleteTransactionController {
    constructor(deleteTransactionUseCase) {
        this.deleteTransactionUseCase = deleteTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const transactionId = httpRequest.params.transactionId
            const idIsValid = checkIfIdIsValid(transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const deletedTransaction =
                await this.deleteTransactionUseCase.execute(transactionId)

            if (!deletedTransaction) {
                return transactionNotFoundResponse()
            }

            return success(deletedTransaction)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from '../index.js'

let deleteTransactionUseCase
let sut

describe('Delete Transaction Controller', () => {
    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
    }

    class DeleteTransactionUseCaseStub {
        execute() {
            return {
                id: faker.string.uuid(),
                user_id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount()),
            }
        }
    }

    beforeEach(() => {
        deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        sut = new DeleteTransactionController(deleteTransactionUseCase)
    })

    it('should return 200 when delete a transaction successfully', async () => {
        const response = await sut.execute({
            params: {
                transactionId: faker.string.uuid(),
            },
        })

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when uuid is invalid', async () => {
        const response = await sut.execute({
            params: {
                transactionId: 'invalid_id',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if transaction is not found', async () => {
        jest.spyOn(deleteTransactionUseCase, 'execute').mockImplementationOnce(
            () => null,
        )

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(404)
    })

    it('should return 500 when DeleteTransactionUseCase throws', async () => {
        jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(500)
    })

    it('should call DeleteTransactionUseCase with correct params', async () => {
        const executeSpy = jest.spyOn(deleteTransactionUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
        )
    })
})

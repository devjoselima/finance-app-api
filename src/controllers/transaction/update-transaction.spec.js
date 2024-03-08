import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from '../index.js'

let updateTransactionUseCase
let sut

describe('Update Transaction Controller', () => {
    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            name: faker.lorem.text(),
            date: faker.date.anytime().toISOString(),
            amount: faker.number.int(),
            type: 'EXPENSE',
        },
    }
    class UpdateTransactionUseCaseStub {
        execute(transaction) {
            return transaction
        }
    }

    beforeEach(() => {
        updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        sut = new UpdateTransactionController(updateTransactionUseCase)
    })

    it('should return 200 when update a transaction successfully', async () => {
        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when an invalid id is invalid', async () => {
        const response = await sut.execute({
            params: {
                transactionId: 'invalid_id',
            },
            body: httpRequest.body,
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when an unallowed field is provided', async () => {
        const response = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                unnallowed_field: 'unnallowed_value',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when type is invalid', async () => {
        const response = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                type: 'invalid_type',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 500 if UpdateTransactionUseCase throws generic error', async () => {
        jest.spyOn(updateTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should call UpdateTransactionUseCase with correct params', async () => {
        const executeSpy = jest.spyOn(updateTransactionUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
            httpRequest.body,
        )
    })
})

import { describe, it, expect, beforeEach } from '@jest/globals'
import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from '../index.js'

let deleteTransactionUseCase
let sut

describe('Create Transaction Controller', () => {
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
})

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from '../index.js'
import { UserNotFoundError } from '../../errors/user.js'

let getTransactionByIdUseCase
let sut

describe('Get Transaction By User Id Controller', () => {
    const httpRequest = {
        query: {
            userId: faker.string.uuid(),
        },
    }

    class GetTransactionByIdUseCaseStub {
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
        getTransactionByIdUseCase = new GetTransactionByIdUseCaseStub()
        sut = new GetTransactionsByUserIdController(getTransactionByIdUseCase)
    })

    it('should return 200 when get a transaction successfully', async () => {
        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when id is not provided', async () => {
        const response = await sut.execute({
            query: { userId: undefined },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when id is invalid', async () => {
        const response = await sut.execute({
            query: {
                userId: 'invalid_id',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 404 when GetTransactionByUserIdUseCase throws UserNotFoundError', async () => {
        jest.spyOn(getTransactionByIdUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )

        const response = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        expect(response.statusCode).toBe(404)
    })

    it('should return 500 when GetTransactionByUserIdUseCase throws generic error', async () => {
        jest.spyOn(getTransactionByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const response = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        expect(response.statusCode).toBe(500)
    })

    it('should call GetTransactionByUserIdUseCase with correct params', async () => {
        const executeSpy = jest.spyOn(getTransactionByIdUseCase, 'execute')
        const userId = faker.string.uuid()

        // act
        await sut.execute({
            query: { userId },
        })

        // assert
        expect(executeSpy).toHaveBeenCalledWith({ userId })
    })
})

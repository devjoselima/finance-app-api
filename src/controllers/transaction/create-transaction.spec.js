import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { faker } from '@faker-js/faker'
import { CreateTransactionController } from '../index.js'

let createTransactionUseCase
let sut

describe('Create Transaction Controller', () => {
    const httpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.lorem.text(),
            date: faker.date.anytime().toISOString(),
            amount: faker.number.int(),
            type: 'EXPENSE',
        },
    }
    class CreateTransactionUseCaseStub {
        execute(user) {
            return user
        }
    }

    beforeEach(() => {
        createTransactionUseCase = new CreateTransactionUseCaseStub()
        sut = new CreateTransactionController(createTransactionUseCase)
    })

    it('should return 201 when creating a transaction successfully', async () => {
        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(201)
    })

    it('should return 400 if name is not provided', async () => {
        const response = await sut.execute({
            body: {
                ...httpRequest.body,
                name: undefined,
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if date is not provided', async () => {
        const response = await sut.execute({
            body: {
                ...httpRequest.body,
                date: undefined,
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if amount is not provided', async () => {
        const response = await sut.execute({
            body: {
                ...httpRequest.body,
                amount: undefined,
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if amount is not valid currency', async () => {
        const response = await sut.execute({
            body: {
                ...httpRequest.body,
                amount: 'invalid_amount',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if type is not provided', async () => {
        const response = await sut.execute({
            body: {
                ...httpRequest.body,
                type: undefined,
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 201 if type is INVESTMENT', async () => {
        const response = await sut.execute({
            body: {
                ...httpRequest.body,
                type: 'INVESTMENT',
            },
        })

        expect(response.statusCode).toBe(201)
    })

    it('should return 201 if type is EXPENSE', async () => {
        const response = await sut.execute({
            body: {
                ...httpRequest.body,
                type: 'EXPENSE',
            },
        })

        expect(response.statusCode).toBe(201)
    })

    it('should return 201 if type is EARNING', async () => {
        const response = await sut.execute({
            body: {
                ...httpRequest.body,
                type: 'EARNING',
            },
        })

        expect(response.statusCode).toBe(201)
    })

    it('should return 400 if type is not EXPENSE, EARNING OR INVESTMENT', async () => {
        const response = await sut.execute({
            body: {
                ...httpRequest.body,
                type: 'invalid_type',
            },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 500 when CreateTransactionUseCase throws', async () => {
        jest.spyOn(createTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(500)
    })
})

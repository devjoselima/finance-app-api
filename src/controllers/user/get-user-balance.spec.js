import { describe, it, expect, beforeEach } from '@jest/globals'
import { faker } from '@faker-js/faker'

import { GetUserBalanceController } from '../index.js'

let getUserBalanceUseCase
let sut

describe('Get User Balance Controller', () => {
    class GetUserBalanceUseCaseStub {
        execute() {
            return faker.number.int()
        }
    }

    beforeEach(() => {
        getUserBalanceUseCase = new GetUserBalanceUseCaseStub()
        sut = new GetUserBalanceController(getUserBalanceUseCase)
    })

    it('should return 200 when getting user balance', async () => {
        const httpRequest = {
            params: {
                userId: faker.string.uuid(),
            },
        }

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when userId is invalid', async () => {
        const httpRequest = {
            params: {
                userId: 'invalid_id',
            },
        }

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
})

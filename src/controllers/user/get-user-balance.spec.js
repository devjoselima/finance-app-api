import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { faker } from '@faker-js/faker'

import { GetUserBalanceController } from '../index.js'

let getUserBalanceUseCase
let sut

const httpRequest = {
    params: {
        userId: faker.string.uuid(),
    },
}

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
        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when userId is invalid', async () => {
        const result = await sut.execute({ params: { userId: 'invalid_id' } })

        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if GetUserBalanceUseCase throws', async () => {
        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserBalanceUseCase with correct params', async () => {
        const executeSpy = jest.spyOn(getUserBalanceUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params)
    })
})

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { faker } from '@faker-js/faker'

import { GetUserByIdController } from '../index.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'

let getUserByIdUseCase
let sut

const httpRequest = {
    params: {
        userId: faker.string.uuid(),
    },
}

describe('Get User By Id Controller', () => {
    class GetUserByIdStub {
        execute() {
            return {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
            }
        }
    }

    beforeEach(() => {
        getUserByIdUseCase = new GetUserByIdStub()
        sut = new GetUserByIdController(getUserByIdUseCase)
    })

    it('should return 200 if a user is found', async () => {
        const response = await sut.execute({
            params: { userId: faker.string.uuid() },
        })

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 if the user id is invalid', async () => {
        const response = await sut.execute({
            params: { userId: 'invalid_id' },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 if the user id is invalid', async () => {
        const response = await sut.execute({
            params: { userId: 'invalid_id' },
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 404 if the user id is not exist', async () => {
        jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValue(null)

        const response = await sut.execute({
            params: { userId: faker.string.uuid() },
        })

        expect(response.statusCode).toBe(404)
    })

    it('should return 400 if GetUserByIdUseCase throws EmailAlreadyInUseError', async () => {
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyInUseError(),
        )

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(400)
    })

    it('should return 500 if GetUserByIdUseCase throws an generic error', async () => {
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(500)
    })

    it('should call GetUserByIdUseCase with correct params', async () => {
        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})

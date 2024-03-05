import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { faker } from '@faker-js/faker'

import { UpdateUserController } from '../index.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'

let updateUserUseCase
let sut

const httpRequest = {
    params: {
        userId: faker.string.uuid(),
    },
    body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    },
}

describe('Get User By Id Controller', () => {
    class UpdateUserStub {
        execute(user) {
            return user
        }
    }

    beforeEach(() => {
        updateUserUseCase = new UpdateUserStub()
        sut = new UpdateUserController(updateUserUseCase)
    })

    it('should return 200 when updating a user successfully', async () => {
        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when an invalid id is provided', async () => {
        const response = await sut.execute({
            params: {
                userId: 'invalid_id',
            },
            body: httpRequest.body,
        })

        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when an invalid email is provided', async () => {
        const response = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                email: 'invalid_email',
            },
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

    it('should return 500 if UpdateUserUseCase throws generic error', async () => {
        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should return 500 if UpdateUserUseCase throws EmailAlreadyInUseError', async () => {
        jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyInUseError(faker.internet.email()),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should call UpdateUserUseCase with correct params', async () => {
        const executeSpy = jest.spyOn(updateUserUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.userId,
            httpRequest.body,
        )
    })
})

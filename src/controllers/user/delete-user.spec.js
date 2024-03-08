import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { faker } from '@faker-js/faker'

import { DeleteUserController } from '../index.js'

let deleteUserUseCase
let sut

describe('Delete User Controller', () => {
    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }
    class DeleteUserUseCaseStub {
        execute() {
            return {
                id: faker.string.uuid(),
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
        deleteUserUseCase = new DeleteUserUseCaseStub()
        sut = new DeleteUserController(deleteUserUseCase)
    })

    it('should return 200 when deleting a user successfully', async () => {
        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if id is invalid', async () => {
        const result = await sut.execute({ params: { userId: 'invalid_id' } })

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if user is not found', async () => {
        jest.spyOn(deleteUserUseCase, 'execute').mockImplementationOnce(
            () => null,
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if DeleteUserUseCase throws', async () => {
        jest.spyOn(deleteUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should call DeleteUserUseCase with correct params', async () => {
        const executeSpy = jest.spyOn(deleteUserUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})

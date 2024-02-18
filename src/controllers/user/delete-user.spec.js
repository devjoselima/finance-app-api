import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { faker } from '@faker-js/faker'

import { DeleteUserController } from '../index.js'

let deleteUserUseCase
let sut

describe('Delete User Controller', () => {
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
        const httpRequest = {
            params: {
                userId: faker.string.uuid(),
            },
        }

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if id is invalid', async () => {
        const httpRequest = {
            params: {
                userId: 'invalid_id',
            },
        }

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if user is not found', async () => {
        const httpRequest = {
            params: {
                userId: faker.string.uuid(),
            },
        }

        jest.spyOn(deleteUserUseCase, 'execute').mockImplementationOnce(
            () => null,
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if DeleteUserUseCase throws', async () => {
        const httpRequest = {
            params: {
                userId: faker.string.uuid(),
            },
        }

        jest.spyOn(deleteUserUseCase, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })
})

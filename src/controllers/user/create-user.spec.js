import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { faker } from '@faker-js/faker'

import { CreateUserController } from './create-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'

let createUserUseCase
let sut

describe('Create User Controller', () => {
    const httpRequest = {
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 7,
            }),
        },
    }
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    const makeStub = () => {
        createUserUseCase = new CreateUserUseCaseStub()
        sut = new CreateUserController(createUserUseCase)
    }

    beforeEach(() => {
        makeStub()
    })

    it('should return 201 when creating a user successfully', async () => {
        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(201)
        expect(result.body).toEqual(httpRequest.body)
    })

    it('should return 400 if first_name is not provided', async () => {
        const result = await sut.execute({
            body: {
                httpRequest,
                first_name: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        const result = await sut.execute({
            body: {
                httpRequest,
                last_name: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        const result = await sut.execute({
            body: {
                httpRequest,
                email: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not valid', async () => {
        const result = await sut.execute({
            body: {
                httpRequest,
                email: 'invalid_email',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        const result = await sut.execute({
            body: {
                httpRequest,
                password: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less than 6 digits ', async () => {
        const result = await sut.execute({
            body: {
                httpRequest,
                password: faker.internet.password({ length: 5 }),
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should call CreateUserUseCase with correct params', async () => {
        const executeSpy = jest.spyOn(createUserUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    it('should return 500 if CreateUserUseCase throws', async () => {
        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should return 400 if CreateUserUseCase throws EmailAlreadyInUseError', async () => {
        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyInUseError(httpRequest.body.email),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
})

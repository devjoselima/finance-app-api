import { CreateUserController } from './create-user.js'

import { describe, it, expect, beforeEach } from '@jest/globals'

let createUserUseCase
let sut

describe('Create User Controller', () => {
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
        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@mail.com',
                password: '1234567',
            },
        }

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(201)
        expect(result.body).toBe(httpRequest.body)
    })

    it('should return 400 if first_name is not provided', async () => {
        const httpRequest = {
            body: {
                last_name: 'Doe',
                email: 'johndoe@mail.com',
                password: '1234567',
            },
        }

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        const httpRequest = {
            body: {
                first_name: 'John',
                email: 'johndoe@mail.com',
                password: '1234567',
            },
        }

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                password: '1234567',
            },
        }

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not valid', async () => {
        const httpRequest = {
            body: {
                first_name: 'John',
                email: 'johndoemail.com',
                last_name: 'Doe',
                password: '1234567',
            },
        }

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@mail.com',
            },
        }

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less than 6 digits ', async () => {
        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'johndoe@mail.com',
                password: '12345',
            },
        }

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })
})

import validator from 'validator'
import { badRequest } from './http.js'

export const invalidIdResponse = () => {
    return badRequest({
        message: 'The provided ID is not valid.',
    })
}

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const requiredFieldIsMissingResponse = (field) => {
    badRequest({
        message: `The field ${field} is required`,
    })
}

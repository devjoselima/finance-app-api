import validator from 'validator'
import { badRequest } from '../helpers/index.js'

export const checkIfAmountIsValid = (amount) => {
    return validator.isCurrency(amount.toString(), {
        digits_after_decimal: [2],
        allow_decimal: false,
        decimal_separator: '.',
    })
}

export const checkIfTypeIsValid = (type) => {
    return ['EARNING', 'EXPENSIVE', 'INVESTMENT'].includes(type)
}

export const invalidAmountResponse = () => {
    return badRequest({
        message: 'The amount must be a valid currency.',
    })
}

export const invalidTypeResponse = () => {
    return badRequest({
        message: 'The type must be EARNING, EXPENSIVE or INVESTMENT',
    })
}

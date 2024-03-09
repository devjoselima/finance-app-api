import { notFound } from '../helpers/index.js'

export const transactionNotFoundResponse = () => {
    return notFound({ message: 'Transaction not found.' })
}

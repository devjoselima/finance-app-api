import {
    PostgresCreateTransactionRepository,
    PostgresGetUserByIdRepository,
    PostgresGetTransactionByUserIdRepository,
} from '../../repositories/postgres/index.js'

import {
    CreateTransactionUseCase,
    GetTransactionByUserIdUseCase,
} from '../../use-cases/index.js'

import {
    CreateTransactionController,
    GetTransactionsByUserIdController,
} from '../../controllers/index.js'

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
    )

    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )

    return createTransactionController
}

export const makeGetTransactionByUserIdController = () => {
    const getTransactionByUserIdRepository =
        new PostgresGetTransactionByUserIdRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getTransactionByUserIdUseCase = new GetTransactionByUserIdUseCase(
        getTransactionByUserIdRepository,
        getUserByIdRepository,
    )

    const getTransactionByUserIdController =
        new GetTransactionsByUserIdController(getTransactionByUserIdUseCase)

    return getTransactionByUserIdController
}

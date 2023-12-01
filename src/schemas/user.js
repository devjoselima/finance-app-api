import { z } from 'zod'

export const createUserSchema = z.object({
    first_name: z.string().trim().min(3, {
        message: 'First name is required',
    }),

    last_name: z
        .string({
            required_error: 'Last name is required',
        })
        .trim()
        .min(3, {
            message: 'Last name is required',
        }),

    email: z
        .string({
            required_error: 'Email is required',
        })
        .email({
            message: 'Please provide a valid email.',
        })
        .trim()
        .min(1, {
            message: 'E-mail is required',
        }),

    password: z
        .string({
            required_error: 'Password is required.',
        })
        .trim()
        .min(6, {
            message: 'String must contain at least 6 character(s)',
        }),
})

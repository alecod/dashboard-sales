import { z } from 'zod'

export const signUpSchema = z.object({
	name: z.string().min(1, 'O nome completo é obrigatório.'),
	email: z.string().email('Email inválido.'),
	password: z
		.string()
		.min(8, 'A senha deve ter no mínimo 8 caracteres.')
		.regex(
			/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
			'A senha deve conter pelo menos um número, uma letra maiúscula e um símbolo.',
		),
	accept_policies: z.boolean().optional(),
	cpf: z
		.string()
		.optional()
		//@ts-ignore
		.refine(val => val.replace(/\D/g, '').length === 11, 'CPF inválido.'),
})

export const signInSchema = z.object({
	email: z.string().email('Email inválido.'),
	password: z
		.string()
		.min(8, 'A senha deve ter no mínimo 8 caracteres.')
		.regex(
			/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
			'A senha deve conter pelo menos um número, uma letra maiúscula e um símbolo.',
		),
})

export const recoverySchema = z.object({
	email: z.string().email('Email inválido.'),
})

export const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, 'A senha deve ter no mínimo 8 caracteres.')
			.regex(
				/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
				'A senha deve conter pelo menos um número, uma letra maiúscula e um símbolo.',
			),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'As senhas não são iguais.',
		path: ['confirmPassword'],
	})

export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type RecoveryFormData = z.infer<typeof recoverySchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

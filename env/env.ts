// env/env.ts
'use server'
export const getEnv = async () => ({
	STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
	API_URL: process.env.API_URL,
	FRONT_URL: process.env.FRONT_URL,
	NOVU_BACKEND_URL: process.env.NOVU_BACKEND_URL,
	NOVU_SOCKET_URL: process.env.NOVU_SOCKET_URL,
	NOVU_IDENTIFIER: process.env.NOVU_IDENTIFIER,
	PLAUSIBLE_URL: process.env.PLAUSIBLE_URL,
	PLAUSIBLE_TOKEN: process.env.PLAUSIBLE_TOKEN,
})

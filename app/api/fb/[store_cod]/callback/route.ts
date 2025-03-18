import { ENV } from '@/env/env-store'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(
	req: NextRequest,
	{ params }: { params: { store_cod: string } },
) {
	const { API_URL } = ENV()
	const ck = cookies()
	const code = req.nextUrl.searchParams.get('code')

	const access_token = await fetch(
		`https://graph.facebook.com/v20.0/oauth/access_token?client_id=1300691744239108&redirect_uri=${process.env.NEXT_PUBLIC_FRONT_URL}/api/fb/${params.store_cod}/callback&client_secret=81cd5d40900f41c842c44e4419da8a54&code=${code}`,
		{},
	)
		.then(res => res.json())
		.then(data => data.access_token)

	const data = await fetch(`${API_URL}/app/p/facebook/integration/`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: String(ck.get('k_a_t')?.value),
		},
		body: JSON.stringify({
			access_token,
			store_cod: Number(params.store_cod),
		}),
	}).then(res => res.json())

	return NextResponse.redirect(new URL('/integrations', req.url))
}

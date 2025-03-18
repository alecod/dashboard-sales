import { getRecoveryTokenFetch } from '@/actions/auth/get-recovery-token'
import Form from './form'

export default async function Page({ params }: { params: { token: string } }) {
  const result = await getRecoveryTokenFetch({
    token: params.token,
  })

  if (!result?.data) {
    return null
  }

  return <Form data={result?.data} />
}

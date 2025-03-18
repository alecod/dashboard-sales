import { LoadingModal } from '@/components/global/loading'
import Form from './form'

export default function Page() {
  return (
    <>
      <LoadingModal show={false} />
      <Form />
    </>
  )
}

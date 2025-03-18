'use client'
import { Button } from '@/components/ui/button'
import { ENV } from '@/env/env-store'
import { useAuthHook } from '@/hooks/auth-hook'
import { routes } from '@/routes/routes'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  PiArrowRightBold,
  PiCheckCircleDuotone,
  PiCreditCard,
  PiEnvelope,
} from 'react-icons/pi'

const CheckoutReturnComponent = () => {
  const [status, setStatus] = useState(null)
  const { user } = useAuthHook()
  const { API_URL } = ENV()
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const sessionId = urlParams.get('session_id')
  const token = Cookies.get('k_a_t')
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetch(`${API_URL}/app/p/checkout/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: String(token),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status)
      })
  }, [])

  if (status === 'open') {
    return (
      <section className='container'>
        <div className='flex w-full flex-col gap-10'>
          <div className='mt-5 flex flex-col items-start justify-center'>
            <p className='mt-5 flex items-center gap-3 text-2xl font-bold'>
              <PiArrowRightBold size={30} fill='#19dbfe' />
              Você tem um boleto pendente para pagamento
            </p>
            <p className='mt-3 flex items-center gap-3 text-[1.2rem]'>
              <PiEnvelope size={30} fill='#19dbfe' />
              Seu boleto tem entre 1 á 2 dias úteis para ser confirmando a
              assinatura.
            </p>
            <div className='mt-3 flex items-center gap-3'>
              <PiCreditCard size={30} fill='#19dbfe' />
              <p className='text-[1.2rem]'>
                Caso tenha pago via cartão, estamos processando seu pagamento e
                em breve você receberá um email confirmando sua assinatura.
              </p>
            </div>
            <div className='mt-3 flex items-center gap-3'>
              <p className='text-[1.2rem]'>
                Aguarde enquanto o pagamento é efetuado.
              </p>
            </div>
            <Link href={routes.dashboard}>
              <Button
                className='bg-white hover:text-white mt-5 w-[300px] font-bold text-[#061216] hover:bg-[#0b1e25]'
                type='submit'
                size='lg'
              >
                <span>Voltar para Home</span>{' '}
                <PiArrowRightBold className='ms-2 mt-0.5 h-6 w-6' />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (status === 'complete') {
    return (
      <section className='container flex'>
        <div className='flex w-1/2 flex-col gap-5'>
          <div className='mt-10 flex flex-col items-start justify-start'>
            <p className='mt-5 flex items-center gap-2 text-2xl font-bold'>
              <PiCheckCircleDuotone size={30} fill='#19dbfe' />
              Sua assinatura está sendo processada.
            </p>
            <p className='mt-3 flex items-center gap-2 text-[1.2rem]'>
              <PiEnvelope size={30} fill='#19dbfe' />
              {`Enviamos um email para: ${user?.email} com os dados das
              assinatura.`}
            </p>
          </div>
          <div className='flex flex-col items-start justify-center gap-5'>
            <p className='flex items-center gap-2 text-[1.2rem]'>
              Para finalizar a configuração de seu ambiente Kirorfy, clique no
              botão abaixo.
            </p>
            <Link href={routes.welcome}>
              <Button
                className='bg-white hover:text-white w-[300px] font-bold text-[#061216] hover:bg-[#0b1e25]'
                type='submit'
                size='lg'
              >
                <span>Cadastrar site</span>{' '}
                <PiArrowRightBold className='ms-2 mt-0.5 h-6 w-6' />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return null
}

export default CheckoutReturnComponent

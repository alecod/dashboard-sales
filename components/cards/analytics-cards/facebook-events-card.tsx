'use client'
import { getEventsFetch } from '@/actions/facebook/get-events'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useStoreHook } from '@/hooks/store-hook'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card'
import { useQuery } from '@tanstack/react-query'
import {
  BaggageClaim,
  CreditCard,
  MousePointerClick,
  PanelTop,
  SquareGanttChart,
  Ticket,
  TicketCheck,
} from 'lucide-react'
import { FaFacebook } from 'react-icons/fa'
import { GrCircleAlert } from 'react-icons/gr'

export const FacebookEvents = () => {
  const { selectedStore } = useStoreHook()

  const { data, isPending } = useQuery({
    enabled: !!selectedStore,
    initialData: null,
    queryKey: ['fb-events', selectedStore?.store_cod],
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const res = await getEventsFetch({
        store_cod: selectedStore?.store_cod,
      })
      return res?.data
    },
  })

  const renderEvent = (
    icon: JSX.Element,
    label: string,
    value: number | undefined,
    description: string,
  ) => (
    <div className='flex items-center justify-between border-b border-k-white/40 pb-1'>
      <div className='flex items-center'>
        <div className='flex items-center gap-2'>
          {icon}
          <span className='text-sm font-medium'>{label}</span>
        </div>
        <HoverCard>
          <HoverCardTrigger>
            <GrCircleAlert size={13} className='relative left-2' />
          </HoverCardTrigger>
          <HoverCardContent className='z-50 w-96 space-x-0 rounded-lg bg-k-black p-4'>
            {description}
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className='font-bold'>
        {isPending ? (
          <Skeleton className='h-3 w-10 animate-pulse' />
        ) : (
          (value ?? 0)
        )}
      </div>
    </div>
  )

  return (
    <Card className='mt-5 flex flex-col gap-5 rounded-md px-5 py-5'>
      <CardHeader className='items-stsrt flex flex-col gap-2 p-0'>
        <div className='flex items-center gap-2'>
          <FaFacebook size={20} />
          <CardTitle className='text-sm'>Eventos Meta Pixel</CardTitle>
        </div>

        <CardDescription className='p-0'>
          Relatório que mostra o total de eventos do Facebook Pixel.
        </CardDescription>
      </CardHeader>

      <div className='flex w-full flex-col gap-5'>
        {renderEvent(
          <PanelTop size={17} />,
          'Visualização de página',
          data?.PageView,
          'O evento de Visualização de Página é acionado quando alguém visualiza uma página no seu site.',
        )}
        {renderEvent(
          <SquareGanttChart size={17} />,
          'Visualização de conteúdo',
          data?.ViewContent,
          'Este evento é disparado quando um visitante visualiza uma página de conteúdo específico no site.',
        )}
        {renderEvent(
          <BaggageClaim size={17} />,
          'Adição ao carrinho',
          data?.AddToCart,
          'O evento de Adição ao Carrinho é acionado quando um visitante adiciona um produto ao carrinho.',
        )}
        {renderEvent(
          <Ticket size={17} />,
          'Compra iniciada',
          data?.InitiateCheckout,
          'Este evento é disparado quando alguém começa o processo de checkout.',
        )}
        {renderEvent(
          <CreditCard size={17} />,
          'Adição de informações de pagamento',
          data?.AddPaymentInfo,
          'O evento de Adição de Informações de Pagamento ocorre quando o cliente insere os dados de pagamento.',
        )}
        {renderEvent(
          <TicketCheck size={17} />,
          'Compra realizada',
          data?.Purchase,
          'Este evento é acionado quando um pedido é finalizado e uma compra é realizada.',
        )}
        {renderEvent(
          <MousePointerClick size={17} />,
          'Cliques',
          data?.Click,
          'O evento de Cliques registra quando alguém clica em um elemento do seu site.',
        )}
      </div>
    </Card>
  )
}

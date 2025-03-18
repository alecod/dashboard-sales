'use client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
} from '@/components/ui/sheet'
import { ENV } from '@/env/env-store'
import { useEcommerceIntegrationHook } from '@/hooks/ecommerce-integration-hook'
import { useShopifyIntegrationHook } from '@/hooks/shopify-integration-hook'
import { useStoreHook } from '@/hooks/store-hook'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { FaShopify } from 'react-icons/fa6'
import { LoadingModal } from '../global/loading'
import { Button } from '../ui/button'
import { toast } from '../ui/use-toast'

export function IntegrationDetailsSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { ecommerceIntegration, deleteEcommerceIntegration } =
    useEcommerceIntegrationHook()
  const { selectedStore } = useStoreHook()
  const { shopifyIntegration } = useShopifyIntegrationHook()
  const token = Cookies.get('k_a_t')
  const { API_URL } = ENV()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationKey: ['deleteEcommerceIntegration', selectedStore],
    mutationFn: async () =>
      await fetch(
        `${API_URL}/app/p/ecommerce-integration/${selectedStore?.store_cod}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: String(token),
          },
        },
      ),

    onSuccess: (data) => {
      queryClient.removeQueries({
        queryKey: ['get-ecommerce', selectedStore],
        type: 'all',
        exact: true,
      })
      deleteEcommerceIntegration()
      toast({
        title: 'Integração Removida com sucesso',
        variant: 'success',
      })
    },
    onError: (error: { message: string | string[] }) => {
      toast({
        title: 'Houve um erro ao remover a integração. Tente novamente',
        variant: 'destructive',
      })
    },
  })

  const handleRemoveIntegration = () => {
    mutation.mutate()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <LoadingModal show={mutation.isPending} />
      <SheetOverlay className='flex items-center justify-center bg-kirofy-black bg-opacity-50 backdrop-blur-md' />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detalhes da Integração</SheetTitle>
        </SheetHeader>
        {ecommerceIntegration ? (
          <div className='mt-4 space-y-4'>
            <div className='flex items-center gap-3'>
              <FaShopify size={40} fill='#96bf48' />
              <div>
                <h2 className='text-xl font-semibold'>Shopify</h2>
                <p className='text-gray-600 text-sm'>
                  Integrado em:{' '}
                  {new Date(
                    ecommerceIntegration.created_at,
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div>
              <p className='text-sm'>
                A integração da Shopify com a Kirofy proporciona aos lojistas
                uma solução completa para o gerenciamento de suas lojas
                virtuais. Por meio dessa integração, os dados de vendas,
                pedidos, produtos e clientes da Shopify são automaticamente
                sincronizados com a Kirofy, permitindo uma análise mais profunda
                e detalhada do desempenho da loja.
              </p>
            </div>
            <div className='space-y-2'>
              <Link
                href={`https://${shopifyIntegration?.domain}/admin/apps`}
                target='_blank'
              >
                <Button variant='destructive' className='mt-3'>
                  Remover Integração pela Shopify
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <p className='text-gray-700'>Nenhuma integração encontrada.</p>
        )}
      </SheetContent>
    </Sheet>
  )
}

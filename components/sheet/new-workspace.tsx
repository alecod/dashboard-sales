'use client'
import { createStoreFetch } from '@/actions/store/create-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
} from '@/components/ui/sheet'
import { useAuthHook } from '@/hooks/auth-hook'
import { useDashboardHook } from '@/hooks/dashboard-hook'
import { useStoreHook } from '@/hooks/store-hook'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import { Label } from 'recharts'
import { z } from 'zod'
import { LoadingModal } from '../global/loading'
import { toast } from '../ui/use-toast'

const siteSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
})

type SiteFormData = z.infer<typeof siteSchema>

export function NewWorkspaceSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { user } = useAuthHook()
  const { setShopifyDashboardData } = useDashboardHook()
  const { setSelectedStore } = useStoreHook()
  const queryClient = useQueryClient()

  const methods = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
  })
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['create-store'],
    mutationFn: async (data: SiteFormData) =>
      await createStoreFetch({
        owner_id: user?.id,
        name: data.name,
      }).then((res) => res?.data),
    retry: 0,
    onSuccess(data) {
      setShopifyDashboardData(data?.store_cod)
      // @ts-ignore
      queryClient.setQueryData(['get-store', user?.id], (old) => {
        // @ts-ignore
        return old ? [...old, data] : [data]
      })
      setSelectedStore(data?.store_cod as number)
      onOpenChange(false)
      toast({
        title: 'Loja cadastrada com sucesso!',
        description: 'Para finalizar sua configuração, integre com a Shopify',
        variant: 'success',
      })
    },
    onError(error) {
      console.error('Error:', error)
      toast({
        title: 'Houve um erro ao cadastrar a loja',
        description: 'Verifique os dados e tente novamente.',
        variant: 'destructive',
      })
    },
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <LoadingModal show={isPending} />
      <SheetOverlay className='flex items-center justify-center bg-kirofy-black bg-opacity-50 backdrop-blur-md' />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Criar Novo Ambiente</SheetTitle>
          <SheetDescription>
            Na Kirofy você consegue ter multiplos ambientes para seus diferentes
            negocios, faço o cadastro e na sequecia selecione o plano que melhor
            te atende
          </SheetDescription>
        </SheetHeader>
        <FormProvider {...methods}>
          <form
            className='mt-5 w-full max-w-md'
            onSubmit={handleSubmit(async (data) => await mutateAsync(data))}
          >
            <div>
              <Label>Nome do seu ambiente</Label>
              <Input
                id='name'
                type='text'
                placeholder='Digite o nome do e-commerce'
                className='mt-3 w-full'
                {...register('name')}
              />
              {errors?.name && (
                <p className='h-1 text-xs text-destructive'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <Button type='submit' disabled={isPending} className='mt-5'>
              Cadastrar Ambiente
            </Button>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}

'use client'
import { createStoreFetch } from '@/actions/store/create-store'
import { LoadingModal } from '@/components/global/loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { useAuthHook } from '@/hooks/auth-hook'
import { useDashboardHook } from '@/hooks/dashboard-hook'
import { useStoreHook } from '@/hooks/store-hook'
import { routes } from '@/routes/routes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const siteSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
})

type SiteFormData = z.infer<typeof siteSchema>

export default function Form() {
  const router = useRouter()
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
      createStoreFetch({
        owner_id: user?.id,
        name: data.name,
      }).then((res) => res?.data),
    retry: 0,
    onSuccess(data) {
      setShopifyDashboardData(data?.store_cod)
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      queryClient.setQueryData(['get-store', user?.id], (old: any) => {
        return old ? [...old, data] : [data]
      })
      setSelectedStore(data?.store_cod as number)
      router.push(routes.integrations)
      toast({
        title: 'Loja cadastrada com sucesso!',
        description: 'Para finalizar sua configuração, integre com a Shopify',
        variant: 'success',
      })
    },
    onError(error) {
      toast({
        title: 'Houve um erro ao cadastrar a loja',
        description: 'Verifique os dados e tente novamente.',
        variant: 'destructive',
      })
    },
  })

  return (
    <div className='flex w-full flex-col items-center'>
      <LoadingModal show={isPending} />

      <FormProvider {...methods}>
        <form
          className='mt-5 w-full max-w-md'
          onSubmit={handleSubmit(async (data) => await mutateAsync(data))}
        >
          <div>
            <Label htmlFor='name'>Nome do seu ambiente</Label>
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
    </div>
  )
}

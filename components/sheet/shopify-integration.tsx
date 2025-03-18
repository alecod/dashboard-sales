'use client'
import { createShopifyIntegrationFetch } from '@/actions/shopify/create-shopify-integration'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
} from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { useStoreHook } from '@/hooks/store-hook'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format, isValid } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { FaShopify } from 'react-icons/fa'
import { GrCircleAlert } from 'react-icons/gr'
import { z } from 'zod'
import { LoadingModal } from '../global/loading'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar2'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

interface SheetShopifyProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Tax {
  name: string
  amount_fixed: string
  amount_percentage: string
  type: string
  target: string
  start_at: string
  end_at?: string
}

interface IntegrationForm {
  domain: string
  access_token: string
  site_cod: number
  fees: Tax[]
}

export const formSchema = z.object({
  domain: z.string().min(1, { message: 'Este campo é obrigatório' }),
  fees: z.array(
    z
      .object({
        name: z.string().min(3, 'O nome deve conter pelo menos 3 letras'),
        amount_fixed: z.coerce.number().nonnegative(),
        amount_percentage: z.coerce.number().nonnegative(),
        type: z.string(),
        target: z
          .enum(['product_cost', 'invoicing', 'profit', 'product_cost_and_ads'])
          .optional()
          .nullable(),
        start_at: z.string().refine((event) => isValid(new Date(event)), {
          message: 'A data de inicio é obrigatoria',
        }),
        end_at: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        if (data.amount_fixed === 0 && data.amount_percentage === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Deve haver pelo menos um valor fixo ou percentual',
            path: ['amount_percentage'],
          })
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Deve haver pelo menos um valor fixo ou percentual',
            path: ['amount_fixed'],
          })
        }
        if (!['checkout', 'gateway'].includes(data.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Selecione um tipo válido',
            path: ['type'],
          })
        }
      }),
  ),
  store_cod: z.number().optional(),
})

export function SheetShopify({ open, onOpenChange }: SheetShopifyProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const methods = useForm<IntegrationForm>({
    resolver: zodResolver(formSchema),
  })

  const { selectedStore } = useStoreHook()

  const { control, handleSubmit } = methods
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fees',
  })
  const [step, setStep] = useState(1)

  const watchFields = useWatch({
    control,
    name: ['domain'],
  })

  const isNextButtonDisabled = !watchFields[0]

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['create-shopify-integration'],
    mutationFn: async (data: IntegrationForm) => {
      const res = await createShopifyIntegrationFetch({
        domain: `${data?.domain}.myshopify.com`,
        store_cod: selectedStore?.store_cod,
        // @ts-ignore
        fees: data?.fees,
      })
      if (res?.serverError || (res && !res.data)) {
        throw new Error('Error when logging in. check the data and try again')
      }
      return res?.data
    },

    onSuccess(data, variables) {
      queryClient.setQueryData(['get-ecommerce', selectedStore], () => {
        return {
          ecommerce_integration_cod: data?.ecommerce_integration_cod,
          created_at: data?.created_at,
          store_cod: selectedStore?.store_cod,
          type: 'shopify',
        }
      })
      onOpenChange(false)
      toast({
        title: 'Integração realizada',
        description: 'A integração com a Shopify foi realizada com sucesso.',
        variant: 'success',
      })
    },
    onError: () => {
      onOpenChange(false)
      toast({
        title: 'Erro na integração',
        description:
          'Erro nas credenciais da Shopify. Revise os dados e tente novamente',
        variant: 'destructive',
      })
    },
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetOverlay className='flex items-center justify-center bg-kirofy-black bg-opacity-50 backdrop-blur-md' />
      <LoadingModal show={isPending} />
      <SheetContent className='flex h-dvh flex-col overflow-y-auto'>
        <SheetHeader>
          <div className='mb-4 flex items-center justify-start gap-3'>
            <FaShopify size={40} fill='#96bf48' />
            <SheetTitle>Integração com a Shopify</SheetTitle>
          </div>
        </SheetHeader>

        <div className='relative mb-2 flex items-center justify-between'>
          <div className='flex items-center'>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                step >= 1 ? 'text-white bg-kirofy-greenDark' : 'bg-gray-300'
              }`}
            >
              1
            </div>
            <span className='ml-2 text-sm'>Etapa 1: Shopify</span>
          </div>

          <div className='bg-gray-300 absolute left-0 top-1/2 z-0 h-1 w-full -translate-y-1/2 transform' />

          <div className='relative z-10 flex items-center'>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                step >= 2
                  ? 'text-white bg-kirofy-greenDark'
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              2
            </div>
            <span className='ml-2 text-sm'>Etapa 2: Taxas</span>
          </div>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(async (data) => await mutateAsync(data))}
            className='flex flex-1 flex-col'
          >
            <div className='flex-1 overflow-y-auto'>
              {step === 1 && (
                <>
                  <FormField
                    control={control}
                    name='domain'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex items-center gap-2'>
                          <Label>Domínio Shopify</Label>
                          <HoverCard>
                            <HoverCardTrigger>
                              <GrCircleAlert size={15} />
                            </HoverCardTrigger>
                            <HoverCardContent>
                              Esse campo deve ser preenchido com a URL da
                              Shopify
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                        <FormControl>
                          <div className='flex items-center justify-center gap-2 rounded-md border'>
                            <Input
                              placeholder='Insira seu ID Shopify'
                              {...field}
                              className='border-none'
                            />
                            <p className='pr-3'>.myshopify.com</p>
                          </div>
                        </FormControl>
                        <FormMessage className='h-3 text-xs' />
                      </FormItem>
                    )}
                  />

                  <Button
                    type='button'
                    onClick={() => setStep(2)}
                    className='mt-6 w-full'
                    disabled={isNextButtonDisabled}
                  >
                    Avançar
                  </Button>
                </>
              )}

              {step === 2 && (
                <div className='flex h-full flex-col'>
                  <div>
                    <h2>
                      A Kirofy faz os cálculos de taxas e impostos para seu
                      negócio.
                    </h2>
                    <p className='mt-3 text-sm'>
                      Deseja cadastrar? Se sim, clique no botão abaixo para
                      adicionar ou se preferir você pode cadastrar as taxas e
                      impostos depois. Para cadastrar, acesse o item do menu
                      Custos. Caso tenha terminado sua configuração, clique em
                      finalizar a integração.
                    </p>
                  </div>

                  <div className='mt-5 flex justify-between gap-2'>
                    <Button
                      type='button'
                      onClick={() => setStep(1)}
                      className='w-32'
                      variant='outline'
                    >
                      Voltar
                    </Button>
                    <Button
                      type='button'
                      onClick={() => {
                        append({
                          name: '',
                          amount_fixed: '',
                          amount_percentage: '',
                          type: '',
                          target: 'invoicing',
                          start_at: '',
                        })
                      }}
                      className='w-48'
                    >
                      Adicionar Taxa
                    </Button>
                  </div>

                  <div className='mt-3 overflow-y-auto'>
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className='mb-4 space-y-4 rounded-md border p-4'
                      >
                        <FormField
                          control={control}
                          name={`fees.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <Label>{'Nome da Taxa'}</Label>
                              <FormControl>
                                <Input
                                  type='text'
                                  placeholder={
                                    'Stripe, Yampi, Dom Pagamentos, etc...'
                                  }
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className='h-3 text-xs' />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`fees.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <Label>Tipo</Label>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Selecione uma opção' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectItem value='gateway'>
                                        Gateway de Pagamento
                                      </SelectItem>
                                      <SelectItem value='checkout'>
                                        Checkout
                                      </SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage className='h-3 text-xs' />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`fees.${index}.amount_fixed`}
                          render={({ field }) => (
                            <FormItem>
                              <div className='flex items-center gap-2'>
                                <Label>Taxa Fixa</Label>
                                <HoverCard>
                                  <HoverCardTrigger>
                                    <GrCircleAlert size={15} />
                                  </HoverCardTrigger>
                                  <HoverCardContent>
                                    Caso seu gateway de pagamento ou checkout
                                    cobre um valor fixo (além da porcentagem)
                                    insira o valor neste campo.
                                  </HoverCardContent>
                                </HoverCard>
                              </div>

                              <FormControl>
                                <Input
                                  type='text'
                                  placeholder='R$0,00'
                                  {...field}
                                  value={
                                    field.value
                                      ? Number(field.value).toLocaleString(
                                          'pt-BR',
                                          {
                                            style: 'currency',
                                            currency: 'BRL',
                                          },
                                        )
                                      : ''
                                  }
                                  onChange={(e) => {
                                    const rawValue = e.target.value.replace(
                                      /\D/g,
                                      '',
                                    )
                                    const numberValue = Number(rawValue) / 100
                                    field.onChange(
                                      Number(numberValue) ? 0 : numberValue,
                                    )
                                  }}
                                />
                              </FormControl>
                              <FormMessage className='h-3 text-xs' />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`fees.${index}.amount_percentage`}
                          render={({ field }) => (
                            <FormItem>
                              <div className='flex items-center gap-2'>
                                <Label>Taxa Percentual</Label>
                                <HoverCard>
                                  <HoverCardTrigger>
                                    <GrCircleAlert size={15} />
                                  </HoverCardTrigger>
                                  <HoverCardContent>
                                    Esse valor é o percentual cobrado pelo
                                    gateway de pagamento ou checkout a cada
                                    compra na sua loja.
                                  </HoverCardContent>
                                </HoverCard>
                              </div>
                              <FormControl>
                                <Input
                                  type='text'
                                  step='0.01'
                                  placeholder='Entre 0% e 100%'
                                  {...field}
                                  value={field.value}
                                  onChange={(e) => {
                                    let value = e.target.value

                                    // Permitir apenas números e ponto decimal
                                    value = value.replace(/[^0-9.]/g, '')

                                    // Garantir que há no máximo um ponto decimal
                                    const parts = value.split('.')
                                    if (parts.length > 2) {
                                      value = `${parts[0]}.${parts[1].slice(0, 2)}`
                                    }

                                    // Validar se o valor está entre 0 e 100
                                    if (value) {
                                      const numericValue =
                                        Number.parseFloat(value)
                                      if (numericValue < 0) {
                                        value = '0'
                                      } else if (numericValue > 100) {
                                        value = '100'
                                      }
                                    }

                                    field.onChange(value)
                                  }}
                                  onBlur={(e) => {
                                    if (field.value !== '') {
                                      field.onChange(
                                        Number.parseFloat(field.value).toFixed(
                                          2,
                                        ),
                                      ) // Fixar em 2 casas decimais após a perda de foco
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormMessage className='h-3 text-xs' />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`fees.${index}.start_at`}
                          render={({ field }) => {
                            return (
                              <FormItem className='flex flex-col'>
                                <Label>Data de Início</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={'outline'}
                                      className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !field.value && 'text-muted-foreground',
                                      )}
                                    >
                                      <CalendarIcon className='mr-2 h-4 w-4' />
                                      {field.value ? (
                                        format(field.value, 'PPP')
                                      ) : (
                                        <span>Selecione a data</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className='w-auto p-0'
                                    align='start'
                                  >
                                    <Calendar
                                      mode='single'
                                      selected={new Date(field.value)}
                                      onSelect={(event) =>
                                        field.onChange(event?.toISOString())
                                      }
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage className='text-xs' />
                              </FormItem>
                            )
                          }}
                        />
                        <FormField
                          control={control}
                          name={`fees.${index}.end_at`}
                          render={({ field }) => (
                            <FormItem className='flex flex-col'>
                              <Label>Data de Termino</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'w-full justify-start text-left font-normal',
                                      !field.value && 'text-muted-foreground',
                                    )}
                                  >
                                    <CalendarIcon className='mr-2 h-4 w-4' />
                                    {field.value ? (
                                      format(field.value, 'PPP')
                                    ) : (
                                      <span>Selecione a data</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className='w-auto p-0'
                                  align='start'
                                >
                                  <Calendar
                                    mode='single'
                                    // @ts-ignore
                                    selected={field.value}
                                    onSelect={(event) =>
                                      field.onChange(event?.toISOString())
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage className='text-xs' />
                            </FormItem>
                          )}
                        />
                        <div className='flex space-x-4'>
                          <Button
                            variant='destructive'
                            type='button'
                            onClick={() => remove(index)}
                            className='flex-1'
                          >
                            Remover Taxa
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='sticky bottom-0 mt-3 w-full'>
                    <Button
                      type='submit'
                      disabled={isPending}
                      className='w-full'
                    >
                      {isPending ? 'Integrando...' : 'Finalizar a Integração'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}

'use client'

import { createFeeFetch } from '@/actions/fees/create-fee'
import { LoadingModal } from '@/components/global/loading'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar2'
import { FormControl, FormItem, FormMessage } from '@/components/ui/form'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
} from '@/components/ui/sheet'
import { toast } from '@/components/ui/use-toast'
import { ENV } from '@/env/env-store'
import { useStoreHook } from '@/hooks/store-hook'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format, isValid } from 'date-fns'
import Cookies from 'js-cookie'
import { CalendarIcon } from 'lucide-react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { GrCircleAlert } from 'react-icons/gr'
import { z } from 'zod'

interface ModalCoastProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface TaxForm {
  name: string
  amount_fixed: number
  amount_percentage: number
  type: string
  target: string
  start_at: string
  end_at?: string
}

const formSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'O nome deve conter pelo menos 3 letras' }),
    amount_fixed: z.coerce
      .number()
      .nonnegative({ message: 'Informe um valor fixo válido' }),
    amount_percentage: z.coerce
      .number()
      .nonnegative({ message: 'Informe um valor percentual válido' }),
    type: z.string().min(1, { message: 'Selecione uma das opções' }),
    target: z.string().min(1, { message: 'Selecione uma das opções' }),
    start_at: z.string().refine((date) => isValid(new Date(date)), {
      message: 'A data de início é obrigatória',
    }),
    end_at: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.amount_fixed === 0 && data.amount_percentage === 0) {
        return false
      }
      return true
    },
    {
      message: 'Deve haver pelo menos um valor fixo ou percentual',
      path: ['amount_fixed', 'amount_percentage'],
    },
  )

export default function SheetTaxes({ open, onOpenChange }: ModalCoastProps) {
  const { selectedStore } = useStoreHook()
  const token = Cookies.get('k_a_t')
  const { API_URL } = ENV()
  const queryClient = useQueryClient()
  const methods = useForm<TaxForm>({
    resolver: zodResolver(formSchema),
  })
  const {
    handleSubmit,
    formState: { errors },
  } = methods

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['create-fee', selectedStore],
    mutationFn: async (data: TaxForm) => {
      const res = await createFeeFetch({
        amount_fixed: data.amount_fixed,
        amount_percentage: data.amount_percentage,
        name: data.name,
        type: data.type,
        target: data.target,
        start_at: data.start_at,
        end_at: data.end_at,
        store_cod: Number(selectedStore?.store_cod),
      })

      return res?.data
    },
    onSuccess() {
      methods.reset()
      onOpenChange(false)
      queryClient.refetchQueries({
        queryKey: ['get-fee-data', selectedStore],
      })
      toast({
        title: 'Taxa cadastrada com sucesso!',
        description: 'A taxa ou imposto foi adicionada com sucesso.',
        variant: 'success',
      })
    },
    onError() {
      toast({
        title: 'Houve um erro ao cadastrar a taxa',
        description: 'Verifique os dados e tente novamente.',
        variant: 'destructive',
      })
    },
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <LoadingModal show={isPending} />
      <SheetOverlay className='flex items-center justify-center bg-kirofy-black bg-opacity-50 backdrop-blur-md'>
        <SheetContent className='overflow-y-auto'>
          <SheetHeader>
            <SheetTitle>Cadastrar Taxa ou Imposto</SheetTitle>
            <SheetDescription>
              A Kirofy faz o cálculo das taxas e impostos para seu negócio. Você
              pode cadastrar suas taxas e impostos por período(anterior ou
              futuras) e para datas atuais.
            </SheetDescription>
          </SheetHeader>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(async (data) => await mutateAsync(data))}
            >
              <div className='mt-5'>
                <FormItem>
                  <Label>Nome da Taxa ou Imposto</Label>
                  <FormControl>
                    <Controller
                      name='name'
                      control={methods.control}
                      render={({ field }) => (
                        <Input
                          type='text'
                          placeholder='Stripe, Yampi, Mercado Pago | Imposto Regional, IOF, etc..'
                          {...field}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage>{errors.name?.message}</FormMessage>
                </FormItem>

                <FormItem className='mt-3'>
                  <Label>Tipo</Label>
                  <FormControl>
                    <Controller
                      name='type'
                      control={methods.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value || undefined}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Selecione uma opção' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value='gateway'>
                                Gateway de Pagamento
                              </SelectItem>
                              <SelectItem value='checkout'>Checkout</SelectItem>
                              <SelectItem value='tax'>Impostos</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage>{errors.type?.message}</FormMessage>
                </FormItem>

                <FormItem className='mt-3'>
                  <Label>Aplicar sobre:</Label>
                  <FormControl>
                    <Controller
                      name='target'
                      control={methods.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value || undefined}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Selecione uma opção' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value='product_cost'>
                                Sob Faturamento - Custo de Produto
                              </SelectItem>
                              <SelectItem value='invoicing'>
                                Sob Faturamento
                              </SelectItem>
                              <SelectItem value='product_cost_and_ads'>
                                Sob Faturamento - (Custo de Produtos + Anúncios)
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage>{errors.target?.message}</FormMessage>
                </FormItem>

                <FormItem className='mt-3'>
                  <div className='flex items-center gap-2'>
                    <Label>Taxa Fixa</Label>
                    <HoverCard>
                      <HoverCardTrigger>
                        <GrCircleAlert size={15} />
                      </HoverCardTrigger>
                      <HoverCardContent>
                        Caso seu gateway de pagamento ou checkout cobre um valor
                        fixo (além da porcentagem) insira o valor neste campo.
                      </HoverCardContent>
                    </HoverCard>
                  </div>

                  <FormControl>
                    <Controller
                      name='amount_fixed'
                      control={methods.control}
                      render={({ field }) => (
                        <Input
                          type='text'
                          placeholder='R$0,00'
                          value={
                            field.value
                              ? Number(field.value).toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                })
                              : ''
                          }
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, '')
                            const numberValue = Number(rawValue) / 100
                            field.onChange(
                              Number(numberValue) ? 0 : numberValue,
                            )
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage>{errors.amount_fixed?.message}</FormMessage>
                </FormItem>

                <FormItem className='mt-3'>
                  <div className='flex items-center gap-2'>
                    <Label>Taxa Percentual</Label>
                    <HoverCard>
                      <HoverCardTrigger>
                        <GrCircleAlert size={15} />
                      </HoverCardTrigger>
                      <HoverCardContent>
                        Esse valor é o percentual cobrado pelo gateway de
                        pagamento ou checkout a cada compra na sua loja.
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <FormControl>
                    <Controller
                      name='amount_percentage'
                      control={methods.control}
                      render={({ field }) => (
                        <Input
                          type='text'
                          step='0.01'
                          placeholder='Entre 0% e 100%'
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
                              const numericValue = Number.parseFloat(value)
                              if (numericValue < 0) {
                                value = '0'
                              } else if (numericValue > 100) {
                                value = '100'
                              }
                            }

                            field.onChange(value)
                          }}
                          onBlur={(e) => {
                            if (field.value.toString() !== '') {
                              field.onChange(
                                Number.parseFloat(
                                  field.value.toString(),
                                ).toFixed(2),
                              )
                            }
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage>{errors.amount_percentage?.message}</FormMessage>
                </FormItem>

                <FormItem className='mt-3 flex flex-col'>
                  <Label>Data de Início</Label>
                  <FormControl>
                    <Controller
                      name='start_at'
                      control={methods.control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant='outline'
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              <CalendarIcon className='mr-2 h-4 w-4' />
                              {field.value ? (
                                format(new Date(field.value), 'PPP')
                              ) : (
                                <span>Selecione a data</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  field.onChange(date.toISOString())
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </FormControl>
                  <FormMessage>{errors.start_at?.message}</FormMessage>
                </FormItem>

                <FormItem className='mt-3 flex flex-col'>
                  <Label>Data de Termino</Label>
                  <FormControl>
                    <Controller
                      name='end_at'
                      control={methods.control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant='outline'
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              <CalendarIcon className='mr-2 h-4 w-4' />
                              {field.value ? (
                                format(new Date(field.value), 'PPP')
                              ) : (
                                <span>Selecione a data</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) => {
                                if (date) {
                                  field.onChange(date.toISOString())
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </FormControl>
                  <FormMessage>{errors.end_at?.message}</FormMessage>
                </FormItem>
              </div>

              <Button
                type='submit'
                disabled={isPending}
                className='mt-5 w-full'
              >
                Cadastrar Taxa
              </Button>
            </form>
          </FormProvider>
        </SheetContent>
      </SheetOverlay>
    </Sheet>
  )
}

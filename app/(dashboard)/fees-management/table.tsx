'use client'

import { deleteFeeFetch } from '@/actions/fees/delete-fee'
import { getFeeFetch } from '@/actions/fees/get-fee'
import { updateFeeFetch } from '@/actions/fees/update-fee'
import { LoadingModal } from '@/components/global/loading'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar2'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/use-toast'
import { useStoreHook } from '@/hooks/store-hook'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import SheetTaxes from './sheet'

type TaxData = {
  ecommerce_integration_cod: number
  name: string
  amount_fixed: number
  amount_percentage: number
  type: string
  target: string
  start_at: string
  end_at: string
  fee_cod: number
}

type TaxesData = TaxData[]

const typeMapping = {
  gateway: 'Gateway de Pagamento',
  checkout: 'Checkout',
  tax: 'Impostos',
}

const targetMapping = {
  product_cost: 'Sob Faturamento - Custo de Produto',
  invoicing: 'Sob Faturamento',
  product_cost_and_ads: 'Sob Faturamento - (Custo de Produtos + Anúncios)',
}

export const formSchemaTaxes = z
  .object({
    name: z
      .string()
      .min(3, { message: 'O nome deve conter pelo menos 3 letras' }),
    amount_fixed: z.coerce
      .number()
      .min(1, 'Insira um valor')
      .nonnegative({ message: 'Informe um valor fixo válido' }),
    amount_percentage: z.coerce
      .number()
      .min(1, 'Insira o valor')
      .nonnegative({ message: 'Informe um valor percentual válido' }),
    type: z.string().min(1, { message: 'Selecione uma das opções' }),
    target: z.string().min(1, { message: 'Selecione uma das opções' }),
    start_at: z.string().refine((date) => isValid(new Date(date)), {
      message: 'A data de início é obrigatória',
    }),
    end_at: z.string().optional().nullable(),
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

export function CoastManagementTable() {
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [openSheet, setOpenSheet] = useState(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [feeToDelete, setFeeToDelete] = useState<number | null>(null)
  const { selectedStore } = useStoreHook()
  const queryClient = useQueryClient()
  const methods = useForm<TaxData>({
    resolver: zodResolver(formSchemaTaxes),
  })

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = methods

  const { data, isError } = useQuery({
    queryKey: ['get-fee-data', selectedStore],
    staleTime(query) {
      if (query.state.dataUpdateCount === 0) {
        return 0
      }
      return Number.POSITIVE_INFINITY
    },
    retry: 0,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<TaxesData> => {
      const res = await getFeeFetch({
        store_cod: selectedStore?.store_cod,
      })
      if (res?.serverError || (res && !res.data)) {
        throw new Error('Error for update fee. check the data and try again')
      }
      return res?.data
    },
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isError) {
      queryClient.setQueryDefaults(['get-fee-data', selectedStore], {
        staleTime: Number.POSITIVE_INFINITY,
      })
    }
  }, [isError])

  const { mutateAsync: updateFee, isPending: isPendingEdit } = useMutation({
    mutationKey: ['update-fee', selectedStore],
    mutationFn: async (updatedData: TaxData) =>
      await updateFeeFetch({
        fee_cod: updatedData.fee_cod,
        name: updatedData.name,
        amount_fixed: updatedData.amount_fixed,
        amount_percentage: updatedData.amount_percentage,
        type: updatedData.type,
        target: updatedData.target,
        start_at: updatedData.start_at,
        end_at: updatedData.end_at === null ? undefined : updatedData.end_at,
      }).then((res) => res?.data),

    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['get-fee-data', selectedStore],
      })
      toast({
        title: 'Taxa atualizada com sucesso',
        variant: 'success',
      })
      setEditIndex(null)
      reset()
    },
    onError: () => {
      toast({
        title: 'Houve um erro ao atualizar a taxa',
        description: 'Verifique os dados e tente novamente.',
        variant: 'destructive',
      })
    },
  })

  const { mutateAsync: deleteFee, isPending: isPendingDeleteFee } = useMutation(
    {
      mutationKey: ['delete-fee', selectedStore],
      mutationFn: async (fee_cod: number) => {
        await deleteFeeFetch({
          fee_cod: fee_cod,
        }).then((res) => res?.data)
      },
      onSuccess: () => {
        setOpenDialog(false)
        queryClient.refetchQueries({
          queryKey: ['get-fee-data', selectedStore],
        })
        toast({
          title: 'Taxa excluída com sucesso',
          variant: 'success',
        })
      },
      onError: () => {
        toast({
          title: 'Houve um erro ao excluir a taxa',
          description: 'Verifique os dados e tente novamente.',
          variant: 'destructive',
        })
      },
    },
  )

  const handleDeleteClick = (fee_cod: number) => {
    setFeeToDelete(fee_cod)
    setOpenDialog(true)
  }

  const confirmDelete = async () => {
    if (feeToDelete) {
      await deleteFee(feeToDelete)
      setOpenDialog(false)
      setFeeToDelete(null)
    }
  }

  const handleEditClick = (index: number, taxData: TaxData) => {
    setEditIndex(index)
    reset(taxData)
  }

  return (
    <>
      <LoadingModal show={isPendingEdit || isPendingDeleteFee} />
      <SheetTaxes open={openSheet} onOpenChange={setOpenSheet} />
      <div className='mt-10 flex flex-col justify-end gap-3'>
        <div className='flex w-full justify-end'>
          <Button variant='outline' onClick={() => setOpenSheet(true)}>
            <PlusIcon size={22} /> Adicionar Taxa ou Imposto
          </Button>
        </div>

        <div className='container mx-auto mt-5 p-0'>
          <div className='scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 overflow-x-auto'>
            <div className='min-w-[1500px]'>
              <div className='flex flex-col'>
                <div className='flex border-b bg-kirofy-white font-medium text-muted-foreground dark:bg-kirofy-greenDark'>
                  <div className='flex w-80 items-center justify-center border-r p-4 text-sm'>
                    Nome da Taxa ou Imposto
                  </div>
                  <div className='flex w-36 items-center justify-center border-r text-sm'>
                    Tipo
                  </div>
                  <div className='flex w-48 items-center justify-center border-r text-sm'>
                    Taxa Aplicada em:
                  </div>
                  <div className='flex w-36 items-center justify-center border-r text-sm'>
                    Taxa Fixa
                  </div>
                  <div className='flex w-36 items-center justify-center border-r text-sm'>
                    Taxa Percentual
                  </div>
                  <div className='flex w-48 items-center justify-center border-r text-sm'>
                    Data de Inicio
                  </div>
                  <div className='flex w-48 items-center justify-center border-r text-sm'>
                    Data de Termino
                  </div>
                  <div className='flex w-44 items-center justify-center border-r text-sm'>
                    Ações
                  </div>
                </div>

                {!data ? (
                  <div className='flex flex-col'>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={Number(index)}
                        className='flex h-16 w-full items-center justify-between bg-[#f8f9faff] dark:bg-[#09171d]'
                      >
                        <div className='flex w-80 items-center justify-center'>
                          <Skeleton className='h-4 w-3/4' />
                        </div>
                        <div className='flex w-36 items-center justify-center'>
                          <Skeleton className='h-4 w-3/4' />
                        </div>
                        <div className='flex w-48 items-center justify-center text-center'>
                          <Skeleton className='h-4 w-3/4' />
                        </div>
                        <div className='flex w-36 items-center justify-center text-center'>
                          <Skeleton className='h-4 w-3/4' />
                        </div>
                        <div className='flex w-36 items-center justify-center text-center'>
                          <Skeleton className='h-4 w-3/4' />
                        </div>
                        <div className='flex w-48 items-center justify-center text-center'>
                          <Skeleton className='h-4 w-3/4' />
                        </div>
                        <div className='flex w-48 items-center justify-center text-center'>
                          <Skeleton className='h-4 w-3/4' />
                        </div>
                        <div className='flex w-44 items-center justify-center gap-2'>
                          <Skeleton className='h-8 w-8' />
                          <Skeleton className='h-8 w-8' />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : data && data.length === 0 ? (
                  <div className='flex flex-col items-center justify-center p-10 dark:bg-[#09171d]'>
                    <p className='text-lg text-muted-foreground'>
                      Você ainda não configurou suas taxas e impostos de seu
                      negócio.
                    </p>
                    <Button className='mt-5' onClick={() => setOpenSheet(true)}>
                      Cadastrar agora
                    </Button>
                  </div>
                ) : (
                  <div className='flex items-center justify-start bg-kirofy-greenDark'>
                    <div>
                      {data &&
                        data.length > 0 &&
                        data
                          .map((taxData, index) => (
                            <Fragment key={taxData.fee_cod}>
                              <div className='flex w-full items-center justify-between bg-[#f8f9faff] font-medium dark:bg-[#09171d]'>
                                {editIndex === index ? (
                                  <FormProvider {...methods}>
                                    <form
                                      className='flex h-16 w-full items-center border-b border-kirofy-default/10 text-center'
                                      onSubmit={handleSubmit(
                                        async (data) =>
                                          await updateFee({
                                            ...data,
                                            fee_cod: taxData.fee_cod,
                                          }),
                                      )}
                                    >
                                      <div className='flex w-80 flex-col items-center justify-center p-5 text-sm'>
                                        <Controller
                                          name='name'
                                          control={methods.control}
                                          render={({ field }) => (
                                            <Input
                                              type='text'
                                              className='text-center'
                                              placeholder='Nome da Taxa ou Imposto'
                                              {...field}
                                            />
                                          )}
                                        />
                                        <FormMessage className='text-xs'>
                                          {errors.name?.message}
                                        </FormMessage>
                                      </div>
                                      <div className='flex w-36 flex-col items-center justify-center p-5 text-sm'>
                                        <Controller
                                          name='type'
                                          control={methods.control}
                                          render={({ field }) => (
                                            <Select
                                              onValueChange={(value) =>
                                                field.onChange(value)
                                              }
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
                                                  <SelectItem value='checkout'>
                                                    Checkout
                                                  </SelectItem>
                                                  <SelectItem value='tax'>
                                                    Impostos
                                                  </SelectItem>
                                                </SelectGroup>
                                              </SelectContent>
                                            </Select>
                                          )}
                                        />
                                        <FormMessage>
                                          {errors.type?.message}
                                        </FormMessage>
                                      </div>
                                      <div className='w-48 flex-col items-center justify-center p-5 text-center text-sm'>
                                        <Controller
                                          name='target'
                                          control={methods.control}
                                          render={({ field }) => (
                                            <Select
                                              onValueChange={(value) =>
                                                field.onChange(value)
                                              }
                                              value={field.value || undefined}
                                            >
                                              <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Selecione uma opção' />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectGroup>
                                                  <SelectItem value='product_cost'>
                                                    Sob Faturamento - Custo de
                                                    Produto
                                                  </SelectItem>
                                                  <SelectItem value='invoicing'>
                                                    Sob Faturamento
                                                  </SelectItem>

                                                  <SelectItem value='product_cost_and_ads'>
                                                    Sob Faturamento - (Custo de
                                                    Produtos + Anúncios)
                                                  </SelectItem>
                                                </SelectGroup>
                                              </SelectContent>
                                            </Select>
                                          )}
                                        />
                                        <FormMessage>
                                          {errors.target?.message}
                                        </FormMessage>
                                      </div>
                                      <div className='w-36 flex-col items-center justify-center p-5 text-center text-sm'>
                                        <Controller
                                          name='amount_fixed'
                                          control={methods.control}
                                          render={({ field }) => (
                                            <Input
                                              type='text'
                                              placeholder='R$10,00'
                                              className='text-center'
                                              value={
                                                field.value
                                                  ? Number(
                                                      field.value,
                                                    ).toLocaleString('pt-BR', {
                                                      style: 'currency',
                                                      currency: 'BRL',
                                                    })
                                                  : ''
                                              }
                                              onChange={(e) => {
                                                const rawValue =
                                                  e.target.value.replace(
                                                    /\D/g,
                                                    '',
                                                  )
                                                const numberValue =
                                                  Number(rawValue) / 100
                                                field.onChange(
                                                  Number(numberValue)
                                                    ? 0
                                                    : numberValue,
                                                )
                                              }}
                                            />
                                          )}
                                        />
                                        <FormMessage className='text-xs'>
                                          {errors.amount_fixed?.message}
                                        </FormMessage>
                                      </div>
                                      <div className='w-36 items-center justify-center p-5 text-center text-sm'>
                                        <Controller
                                          name='amount_percentage'
                                          control={methods.control}
                                          render={({ field }) => (
                                            <Input
                                              type='text'
                                              step='0.01'
                                              className='text-center'
                                              placeholder='0% e 100%'
                                              value={field.value}
                                              onChange={(e) => {
                                                let value = e.target.value

                                                // Permitir apenas números e ponto decimal
                                                value = value.replace(
                                                  /[^0-9.]/g,
                                                  '',
                                                )

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
                                                  } else if (
                                                    numericValue > 100
                                                  ) {
                                                    value = '100'
                                                  }
                                                }

                                                field.onChange(value)
                                              }}
                                              onBlur={(e) => {
                                                if (
                                                  field.value.toString() !== ''
                                                ) {
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
                                        <FormMessage className='text-xs'>
                                          {errors.amount_percentage?.message}
                                        </FormMessage>
                                      </div>
                                      <div className='w-48 flex-col items-center justify-center p-5 text-center text-sm'>
                                        <Controller
                                          name='start_at'
                                          control={methods.control}
                                          render={({ field }) => (
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <Button
                                                  variant='outline'
                                                  className={cn(
                                                    'text-xs font-normal',
                                                    !field.value &&
                                                      'text-muted-foreground',
                                                  )}
                                                >
                                                  {field.value ? (
                                                    format(
                                                      new Date(field.value),
                                                      'PPP',
                                                      { locale: ptBR },
                                                    )
                                                  ) : (
                                                    <span>
                                                      Selecione a data
                                                    </span>
                                                  )}
                                                </Button>
                                              </PopoverTrigger>
                                              <PopoverContent
                                                className='p-0'
                                                align='start'
                                              >
                                                <Calendar
                                                  mode='single'
                                                  className='bg-kirofy-greenDark shadow-md'
                                                  locale={ptBR}
                                                  selected={
                                                    field.value
                                                      ? new Date(field.value)
                                                      : undefined
                                                  }
                                                  onSelect={(date) => {
                                                    if (date) {
                                                      field.onChange(
                                                        date.toISOString(),
                                                      )
                                                    }
                                                  }}
                                                />
                                              </PopoverContent>
                                            </Popover>
                                          )}
                                        />
                                        <FormMessage>
                                          {errors.start_at?.message}
                                        </FormMessage>
                                      </div>
                                      <div className='w-48 items-center justify-center p-5 text-center text-sm'>
                                        <Controller
                                          name='end_at'
                                          control={methods.control}
                                          render={({ field }) => (
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <Button
                                                  variant='outline'
                                                  className={cn(
                                                    'text-xs font-normal',
                                                    !field.value &&
                                                      'text-muted-foreground',
                                                  )}
                                                >
                                                  {field.value ? (
                                                    format(
                                                      new Date(field.value),
                                                      'PPP',
                                                      { locale: ptBR },
                                                    )
                                                  ) : (
                                                    <span>
                                                      Selecione a data
                                                    </span>
                                                  )}
                                                </Button>
                                              </PopoverTrigger>
                                              <PopoverContent
                                                className='w-auto p-0'
                                                align='start'
                                              >
                                                <Calendar
                                                  mode='single'
                                                  locale={ptBR}
                                                  className='bg-kirofy-greenDark shadow-md'
                                                  selected={
                                                    field.value
                                                      ? new Date(field.value)
                                                      : undefined
                                                  }
                                                  onSelect={(date) => {
                                                    if (date) {
                                                      field.onChange(
                                                        date.toISOString(),
                                                      )
                                                    }
                                                  }}
                                                />
                                              </PopoverContent>
                                            </Popover>
                                          )}
                                        />
                                      </div>
                                      <div className='flex w-44 items-center justify-center gap-2'>
                                        <Button
                                          type='submit'
                                          variant='outline'
                                          size='sm'
                                        >
                                          Salvar
                                        </Button>
                                        <Button
                                          variant='outline'
                                          size='sm'
                                          onClick={() => {
                                            setEditIndex(null)
                                            reset()
                                          }}
                                        >
                                          Cancelar
                                        </Button>
                                      </div>
                                    </form>
                                  </FormProvider>
                                ) : (
                                  <div className='flex h-16 w-full items-center border-b border-kirofy-default/10 text-center'>
                                    <div className='flex w-80 justify-center text-sm'>
                                      {taxData.name.toLowerCase()}
                                    </div>
                                    <div className='flex w-36 justify-center text-sm'>
                                      {typeMapping[
                                        taxData.type as keyof typeof typeMapping
                                      ] || 'N/A'}
                                    </div>

                                    <div className='w-48 text-sm'>
                                      {targetMapping[
                                        taxData.target as keyof typeof targetMapping
                                      ] || 'N/A'}
                                    </div>
                                    <div className='w-36 text-sm'>
                                      R$ {taxData.amount_fixed.toFixed(2)}
                                    </div>
                                    <div className='w-36 text-sm'>
                                      {taxData.amount_percentage.toFixed(2)}%
                                    </div>
                                    <div className='w-48 text-sm'>
                                      {taxData.start_at
                                        ? format(
                                            new Date(taxData.start_at),
                                            'dd MMM yyyy',
                                            { locale: ptBR },
                                          )
                                        : 'Data de início não cadastrada'}
                                    </div>
                                    <div className='w-48 text-sm'>
                                      {taxData.end_at
                                        ? format(
                                            new Date(taxData.end_at),
                                            'dd MMM yyyy',
                                            { locale: ptBR },
                                          )
                                        : 'Sem data de expiração'}
                                    </div>
                                    <div className='flex w-44 items-center justify-center gap-2'>
                                      <Button
                                        variant='outline'
                                        size='sm'
                                        onClick={() =>
                                          handleEditClick(index, taxData)
                                        }
                                      >
                                        <PencilIcon size={16} />
                                      </Button>

                                      <Button
                                        variant='outline'
                                        size='sm'
                                        onClick={() =>
                                          handleDeleteClick(taxData.fee_cod)
                                        }
                                      >
                                        <TrashIcon size={16} />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </Fragment>
                          ))
                          .reverse()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogOverlay className='bottom-10 h-full bg-kirofy-black bg-opacity-50 backdrop-blur-md' />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deseja excluir essa taxa permanentemente?</DialogTitle>
            <DialogDescription>
              Essa ação não pode ser desfeita. Tem certeza que deseja excluir?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='destructive' onClick={confirmDelete}>
              Sim, excluir agora
            </Button>
            <Button variant='outline' onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

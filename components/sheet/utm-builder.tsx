import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
} from '@/components/ui/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { GrCircleAlert } from 'react-icons/gr'
import { z } from 'zod'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

const urlSchema = z.object({
  siteUrl: z
    .string()
    .url({ message: 'Digite uma URL válida' })
    .refine((url) => url.startsWith('https://'), {
      message: 'A URL deve começar com https://',
    }),
  utmId: z.string().optional(),
  utmSource: z.string().nonempty('Fonte da campanha é obrigatória'),
  utmMedium: z.string().nonempty('Meio da campanha é obrigatório'),
  utmCampaign: z.string().nonempty('Nome da campanha é obrigatório'),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
})

type FormData = z.infer<typeof urlSchema>

export function UtmBuilderSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const methods = useForm<FormData>({
    resolver: zodResolver(urlSchema),
  })
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = methods

  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)

  const onSubmit = (data: FormData) => {
    const url = new URL(data.siteUrl)
    url.searchParams.append('utm_id', data.utmId || '')
    url.searchParams.append('utm_source', data.utmSource)
    url.searchParams.append('utm_medium', data.utmMedium)
    url.searchParams.append('utm_campaign', data.utmCampaign)
    if (data.utmTerm) url.searchParams.append('utm_term', data.utmTerm)
    if (data.utmContent) url.searchParams.append('utm_content', data.utmContent)
    setGeneratedUrl(url.toString())
  }

  const copyToClipboard = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl)
      alert('URL copiada para a área de transferência!')
    }
  }

  const handleReset = () => {
    reset({
      siteUrl: '',
      utmId: '',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmTerm: '',
      utmContent: '',
    })
    setGeneratedUrl('')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetOverlay className='flex items-center justify-center bg-k-black bg-opacity-50 backdrop-blur-md' />
      <SheetContent className='overflow-x-auto'>
        <SheetHeader>
          <SheetTitle>Construtor de URL para campanhas</SheetTitle>
          <SheetDescription>
            Essa funcionalidade permite adicionar facilmente parâmetros de
            campanha a URLs.
          </SheetDescription>
        </SheetHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className='overflow-y-auto'>
            <div className='mt-5'>
              <div className='flex gap-2'>
                <Label>Site URL</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <GrCircleAlert size={13} />
                  </HoverCardTrigger>
                  <HoverCardContent className='w-56 rounded-sm bg-k-greenDark p-3 shadow-md'>
                    Insira a URL completa do site, incluindo o https://.
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Controller
                name='siteUrl'
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder='https://sualojaonline.com.br'
                    className='mt-1'
                    {...field}
                  />
                )}
              />
              {errors.siteUrl && (
                <p className='text-sm text-red-3'>{errors.siteUrl.message}</p>
              )}
            </div>

            <div className='mt-3'>
              <div className='flex gap-2'>
                <Label>ID da Campanha (opcional)</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <GrCircleAlert size={13} />
                  </HoverCardTrigger>
                  <HoverCardContent className='w-56 rounded-sm bg-k-greenDark p-3 shadow-md'>
                    Use utm_id para identificar uma campanha de anúncios
                    específica.
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Controller
                name='utmId'
                control={control}
                render={({ field }) => (
                  <Input placeholder='abc.123' className='mt-1' {...field} />
                )}
              />
            </div>

            <div className='mt-3'>
              <div className='flex gap-2'>
                <Label>Fonte da Campanha</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <GrCircleAlert size={13} />
                  </HoverCardTrigger>
                  <HoverCardContent className='w-56 rounded-sm bg-k-greenDark p-3 shadow-md'>
                    Identifica a origem da campanha, como um mecanismo de busca
                    ou nome de newsletter.
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Controller
                name='utmSource'
                control={control}
                render={({ field }) => (
                  <Input placeholder='Google' className='mt-1' {...field} />
                )}
              />
              {errors.utmSource && (
                <p className='text-sm text-red-3'>{errors.utmSource.message}</p>
              )}
            </div>

            <div className='mt-3'>
              <div className='flex gap-2'>
                <Label>Meio da Campanha</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <GrCircleAlert size={13} />
                  </HoverCardTrigger>
                  <HoverCardContent className='w-56 rounded-sm bg-k-greenDark p-3 shadow-md'>
                    Identifica o meio da campanha, como CPC (custo por clique)
                    ou e-mail.
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Controller
                name='utmMedium'
                control={control}
                render={({ field }) => (
                  <Input placeholder='CPC' className='mt-1' {...field} />
                )}
              />
              {errors.utmMedium && (
                <p className='text-sm text-red-3'>{errors.utmMedium.message}</p>
              )}
            </div>

            <div className='mt-3'>
              <div className='flex gap-2'>
                <Label>Nome da Campanha</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <GrCircleAlert size={13} />
                  </HoverCardTrigger>
                  <HoverCardContent className='w-56 rounded-sm bg-k-greenDark p-3 shadow-md'>
                    Use utm_campaign para identificar uma promoção ou campanha
                    específica.
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Controller
                name='utmCampaign'
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder='Liquidação de Primavera'
                    className='mt-1'
                    {...field}
                  />
                )}
              />
              {errors.utmCampaign && (
                <p className='text-sm text-red-3'>
                  {errors.utmCampaign.message}
                </p>
              )}
            </div>

            <div className='mt-3'>
              <div className='flex gap-2'>
                <Label>Termo da Campanha (opcional)</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <GrCircleAlert size={13} />
                  </HoverCardTrigger>
                  <HoverCardContent className='w-56 rounded-sm bg-k-greenDark p-3 shadow-md'>
                    Usado para pesquisa paga. Especifica as palavras-chave.
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Controller
                name='utmTerm'
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder='Tenis de corrida'
                    className='mt-1'
                    {...field}
                  />
                )}
              />
            </div>

            <div className='mt-3'>
              <div className='flex gap-2'>
                <Label>Conteúdo da Campanha (opcional)</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <GrCircleAlert size={13} />
                  </HoverCardTrigger>
                  <HoverCardContent className='w-56 rounded-sm bg-k-greenDark p-3 shadow-md'>
                    Diferencia anúncios ou links que apontam para a mesma URL.
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Controller
                name='utmContent'
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder='Link do logotipo'
                    className='mt-1'
                    {...field}
                  />
                )}
              />
            </div>

            <SheetFooter className='mt-3 w-full'>
              <Button type='submit' className='w-full'>
                Gerar URL
              </Button>
            </SheetFooter>
          </form>
        </FormProvider>

        {generatedUrl && (
          <div className='mt-5 flex h-auto w-auto flex-col gap-3 border'>
            <strong>URL Gerada:</strong>{' '}
            <div className='w-fit whitespace-normal break-all'>
              <span>{generatedUrl}</span>
            </div>
            <Button variant='outline' onClick={copyToClipboard}>
              Copiar URL
            </Button>
            <Button
              variant='destructive'
              className='mb-5'
              onClick={() => handleReset()}
            >
              Resetar dados
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

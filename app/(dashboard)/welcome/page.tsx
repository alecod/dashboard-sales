import { LogoGlobal } from '@/components/global/logo'
import { ContentLayout } from '@/components/layout/content-layout'
import Form from './form'

export default function WelcomePage() {
  return (
    <ContentLayout>
      <div className='text-white m-auto mt-5 flex max-w-[960px] flex-col items-center justify-center'>
        <div className='flex flex-col items-center text-center'>
          <LogoGlobal />
          <h1 className='mt-5 text-4xl font-bold'>
            Seja bem-vindo(a) à Dashboard
          </h1>
          <p className='mt-5 text-lg'>Para continuar cadastre seu ambiente</p>
        </div>
        <div className='mt-10 flex w-full flex-col justify-between md:flex-row'>
          <div className='md:w-1/2'>
            <Form />
          </div>

          <div className='mt-10 md:mt-0 md:w-1/2 md:pl-10'>
            <h2 className='mb-5 text-2xl font-bold'>Veja nossos recursos:</h2>
            <div className='flex flex-col space-y-5'>
              <div className='flex items-center'>
                <div>
                  <h3 className='text-xl font-semibold'>
                    Dashboard Financeiro
                  </h3>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    Visualize suas vendas e despesas de seu ecommerce, incluindo
                    custo de produtos, taxas de gateway e checkout. Tenha
                    informações sobre seu faturamento bruto e liquido e muito
                    mais.
                  </p>
                </div>
              </div>
              <div className='flex items-center'>
                <div>
                  <h3 className='text-xl font-semibold'>
                    Análise de Desempenho de Campanhas
                  </h3>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    Analise o desempenho das suas campanhas no Facebook Ads e
                    faça retroalimentações utlizando o Facebook Pixel.
                  </p>
                </div>
              </div>

              <div className='flex items-center'>
                <div>
                  <h3 className='text-xl font-semibold'>Gestão de Produtos</h3>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    Visualize seus produtos com maior lucro, ultimos pedidos de
                    seu ecommerce, detalhes dos pedidos.
                  </p>
                </div>
              </div>

              <div className='flex items-center'>
                <div>
                  <h3 className='text-xl font-semibold'>Tracking</h3>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    Monitore os dados analiticos de seu ecoomerce: Navegadores,
                    Metricas de visualizações, Principais paginas,
                    Geolocalização, Distpositvos e muito mais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}

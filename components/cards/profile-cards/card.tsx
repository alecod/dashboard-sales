import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AboutCard() {
  return (
    <Card className='w-96'>
      <CardHeader>
        <CardTitle>Dados Pessoais</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p className='text-sm'>
            <span className='font-bold text-muted-foreground'>Nome: </span>
            Alessandro Junqueira
          </p>
        </div>
        <div className='mt-1'>
          <p className='text-sm'>
            <span className='font-bold text-muted-foreground'>Email: </span>
            alecodx@gmail.com
          </p>
        </div>
        <div className='mt-1'>
          <p className='text-sm'>
            <span className='font-bold text-muted-foreground'>CPF: </span>
            41447074823
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

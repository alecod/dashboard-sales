import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Image from 'next/image'

interface ImageProps {
  id: number
  src: string
  position: number
}

interface Variant {
  id: number
  title: string
  price: string
  sku: string
  position: number
  quantity: number
  taxable: boolean
  cost: string | null
  barcode: string | null
  images: ImageProps[]
}

interface Item {
  id: number
  store_cod: number
  title: string
  variants: Variant[]
  tags: string[]
  images: ImageProps[]
  image: ImageProps
}

interface TableDemoProps {
  items: Item[]
}

export function TableProducts({ items }: TableDemoProps) {
  return (
    <Table className='w-full bg-k-greenDark'>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead>Quantidade</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead className='text-right'>Preço</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.variants[0].id}>
            <TableCell className='flex items-center justify-center font-medium'>
              <Image
                src={item.variants[0].images[0].src}
                alt={item.title}
                width={80}
                height={80}
              />
            </TableCell>
            <TableCell>
              {item.title} - {item.variants[0].title}
            </TableCell>
            <TableCell>{item.variants[0].quantity}</TableCell>
            <TableCell>{item.variants[0].sku || 'Não Cadastrado'}</TableCell>
            <TableCell className='text-right'>
              R${item.variants[0].price}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

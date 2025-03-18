import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import * as React from 'react'

import Banner from '@/public/images/banner-dom.jpg'

import Image from 'next/image'
import Link from 'next/link'

export function Slider() {
  return (
    <Carousel className='hidden w-full lg:block'>
      <CarouselContent>
        {Array.from({ length: 1 }).map((_, index) => (
          <CarouselItem key={Number(index)}>
            <Link href='https://dompagamentos.com.br/' target='_blank'>
              <Image src={Banner} alt='Banner bem vindo ' className='w-full' />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

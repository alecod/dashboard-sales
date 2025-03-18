'use client'
import { Card } from '@/components/ui/card'
import { faqArray } from '@/data/faq'
import { useState } from 'react'
interface Faq {
  question: string
  answer: string
}

interface FaqComponentProps {
  faqArray: Faq[]
}

export function FaqComponent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null)
    } else {
      setOpenIndex(index)
    }
  }

  return (
    <Card className='text-gray-700 p-8'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {faqArray.map((faq, index) => (
          <div key={Number(index)}>
            <button
              className='w-full rounded-md p-2 text-left transition duration-200'
              onClick={() => toggleAccordion(index)}
              type='button'
            >
              <h3 className='text-xl font-semibold'>{faq.question}</h3>
            </button>
            <div
              className={`mt-2 rounded-md p-4 transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? 'max-h-screen opacity-100'
                  : 'max-h-0 overflow-hidden opacity-0'
              }`}
            >
              <p className='text-base'>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

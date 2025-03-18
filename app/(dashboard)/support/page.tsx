'use client'
import { BreadcrumbSupport } from '@/components/breadcrumb/support'
import { ContentLayout } from '@/components/layout/content-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import Image from 'next/image'
import { type SetStateAction, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { IoChatboxEllipsesOutline } from 'react-icons/io5'
import { MdOutlineEmail } from 'react-icons/md'

export default function Chat() {
  const [inputCode, setInputCode] = useState<string>('')
  const [change, setChange] = useState<'chat' | 'email'>('chat')
  const [messages, setMessages] = useState([
    { sender: 'gpt', text: 'Olá, sou o ChatGPT! Como posso te ajudar hoje?' },
    {
      sender: 'user',
      text: 'Oi, gostaria de saber mais sobre a integração com Shopify.',
    },
  ])

  const handleTranslate = () => {
    if (!inputCode) {
      alert('Digite sua mensagem.')
      return
    }

    // Adicionar a mensagem do usuário
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: inputCode },
    ])

    setInputCode('')

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'gpt',
          text: 'A integração com Shopify permite monitorar suas vendas e tráfego.',
        },
      ])
    }, 1000)
  }

  const handleChange = (event: {
    target: { value: SetStateAction<string> }
  }) => {
    setInputCode(event.target.value)
  }

  return (
    <ContentLayout>
      <BreadcrumbSupport />
      <div className='relative flex w-full md:pt-0'>
        <nav className='mt-10 h-36 w-48 space-y-4 border-r border-k-default/50'>
          <div className='flex items-center space-x-2'>
            <button
              className='flex w-full items-center gap-2'
              onClick={() => setChange('chat')}
              type='button'
            >
              <IoChatboxEllipsesOutline />
              <span>k IA</span>
            </button>
          </div>
          <div className='flex items-center space-x-2'>
            <button
              className='flex w-full items-center gap-2'
              onClick={() => setChange('email')}
              type='button'
            >
              <MdOutlineEmail className='text-xl' />
              <span>Enviar email</span>
            </button>
          </div>
          <div className='flex items-center space-x-2'>
            <button className='flex w-full items-center gap-2' type='button'>
              <FaWhatsapp />
              <span>Whatsapp</span>
            </button>
          </div>
        </nav>

        {change === 'chat' ? (
          <div className='w-full'>
    
            <Card className='m-10 flex min-h-[75vh] w-full max-w-[1000px] flex-col'>
              {/* Chat Messages */}
              <div className='mb-5 flex h-[500px] flex-col space-y-4 overflow-y-auto p-5'>
                {messages.map((message, index) => (
                  <div
                    key={Number(index)}
                    className={`flex items-start ${
                      message.sender === 'gpt' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {message.sender === 'gpt' && ''}
                    {message.sender === 'user' && ''}
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === 'gpt'
                          ? 'text-black bg-k-black'
                          : 'text-white bg-k-black'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className='mt-5 flex p-5'>
                <Input
                  className='border-gray-200 mr-2 h-12 rounded-lg border p-4 text-sm font-medium'
                  placeholder='Digite sua mensagem aqui'
                  value={inputCode}
                  onChange={handleChange}
                />
                <Button
                  className='mt-1 w-40 rounded-lg bg-gradient-to-r font-bold md:w-52'
                  onClick={handleTranslate}
                >
                  Enviar
                </Button>
              </div>

              <div className='flex items-center justify-center md:flex-row'>
                <p className='mb-5 text-xs text-muted-foreground'>
                  Nossa IA é uma integração personalizada com o ChatGPT. Fique
                  atento às políticas de privacidade e de uso para utilizar de
                  maneira correta a IA.
                </p>
              </div>
            </Card>
          </div>
        ) : (
          <form className='w-full p-10'>
            <div className='mb-5'>
              <span className='text-2xl font-bold'>Envie seu e-mail</span>
            </div>
            <div>
              <Label>Assunto</Label>
              <Input placeholder='Assunto do email' type='text' required />
            </div>
            <div className='mt-3 grid w-full gap-2'>
              <Label>Mensagem</Label>
              <Textarea placeholder='Conteudo do suporte' />
              <Button className='mt-2 w-80'>Enviar email</Button>
            </div>
          </form>
        )}
      </div>
    </ContentLayout>
  )
}

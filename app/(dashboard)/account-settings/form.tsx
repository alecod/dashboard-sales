'use client'
import { AboutCard } from '@/components/cards/profile-cards/card'
import { IntegrationCard } from '@/components/cards/profile-cards/integrations'
import { PaymentCard } from '@/components/cards/profile-cards/payment'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaLock, FaUser } from 'react-icons/fa'
import { FaPenToSquare } from 'react-icons/fa6'
import { IoWalletOutline } from 'react-icons/io5'

type ProfileEditFormProps = Record<string, unknown>

const Form: React.FC<ProfileEditFormProps> = () => {
  const { register, handleSubmit } = useForm()
  const [change, setChange] = useState<'overview' | 'profile' | 'password'>(
    'overview',
  )

  const onSubmit = () => {
    return
  }

  return (
    <div className='flex w-full items-start gap-5'>
      <nav className='mt-10 h-36 w-64 space-y-4 border-r border-kirofy-default/50'>
        <div className='flex items-center space-x-2'>
          <button
            onClick={() => setChange('overview')}
            type='button'
            className='flex w-full items-center gap-2'
          >
            <FaUser className='text-xl' />
            <span>Visão Geral</span>
          </button>
        </div>
        <div className='flex items-center space-x-2'>
          <button
            onClick={() => setChange('profile')}
            className='flex w-full items-center gap-2'
            type='button'
          >
            <FaPenToSquare />
            <span>Editar Perfil</span>
          </button>
        </div>
        <div className='flex items-center space-x-2'>
          <button
            onClick={() => setChange('password')}
            className='flex w-full items-center gap-2'
            type='button'
          >
            <FaLock className='text-xl' />
            <span>Atualizar Senha</span>
          </button>
        </div>
        <div className='flex items-center space-x-2'>
          <button className='flex w-full items-center gap-2' type='button'>
            <IoWalletOutline size={20} />
            <span>Minhas Assinaturas</span>
          </button>
        </div>
      </nav>

      <div className='mt-10 w-full pl-5'>
        {change === 'profile' ? (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div>
              <Label htmlFor='name'>Nome</Label>
              <Input
                id='name'
                placeholder='Alessandro Junqueira'
                {...register('name')}
                className='mt-1 w-full'
              />
            </div>

            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                placeholder='alecodx@gmail.com'
                {...register('email')}
                className='mt-1 w-full'
              />
            </div>

            <div>
              <Label htmlFor='password'>CPF</Label>
              <Input
                id='password'
                type='text'
                placeholder='41447074823'
                {...register('password')}
                className='mt-1 w-full'
              />
            </div>

            <div>
              <Label htmlFor='language'>Celular</Label>
              <Input
                id='language'
                placeholder='41999174948'
                {...register('language')}
                className='mt-1 w-full'
              />
            </div>

            <Button type='submit' className='w-full lg:w-auto'>
              Atualizar Perfil
            </Button>
          </form>
        ) : change === 'overview' ? (
          <div className='flex w-full items-start gap-5'>
            <div className='flex flex-col gap-3'>
              <AboutCard />
              <IntegrationCard />
            </div>
            <PaymentCard />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div>
              <Label htmlFor='name'>Senha Atual</Label>
              <Input
                id='name'
                placeholder='123456789'
                {...register('name')}
                className='mt-1 w-full'
              />
            </div>
            <div>
              <Label htmlFor='name'>Nova Senha</Label>
              <Input
                id='name'
                placeholder='123456'
                {...register('name')}
                className='mt-1 w-full'
              />
            </div>
            <div>
              <Label htmlFor='name'>Confirmar Senha</Label>
              <Input
                id='name'
                placeholder='123456'
                {...register('name')}
                className='mt-1 w-full'
              />
            </div>

            <Button type='submit' className='w-full lg:w-auto'>
              Atualizar Senha
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Form

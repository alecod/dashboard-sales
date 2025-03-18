'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ENV } from '@/env/env-store'
import { useAuthHook } from '@/hooks/auth-hook'
import { useFacebookAdsDataHook } from '@/hooks/facebook-ads-data-hook'
import { useFacebookIntegrationHook } from '@/hooks/facebook-integration-hook'
import { routes } from '@/routes/routes'
import { getInitials } from '@/utils/get-initals-name'
import { useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { NewWorkspaceSheet } from '../sheet/new-workspace'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import { Notifications } from './notifications'
import { SelectStore } from './select-store'

export function UserMenu() {
  const { user } = useAuthHook()
  const name = user?.name || 'Usuário'
  const queryClient = useQueryClient()
  const { deleteFacebookIntegration } = useFacebookIntegrationHook()
  const { clearFacebookAdsData } = useFacebookAdsDataHook()
  const { API_URL } = ENV()
  const token = Cookies.get('k_a_t')
  const [open, setOpen] = useState(false)

  const router = useRouter()

  const fetchStripePortal = async () => {
    try {
      const response = await fetch(`${API_URL}/app/p/portal/${user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: String(token),
        },
      })
      if (!response.ok) {
        throw new Error('Erro ao obter a URL do portal')
      }
      const data = await response.json()
      // Abrir a URL em uma nova aba
      window.open(data.url, '_blank')
    } catch (error) {
      console.error('Erro ao abrir o portal do Stripe:', error)
    }
  }

  const handleSignOut = () => {
    // @ts-ignore
    queryClient.clear()
    deleteFacebookIntegration()
    clearFacebookAdsData()
    Cookies.remove('k_a_t')
    Cookies.remove('k_r_t')
    router.refresh()
  }

  return (
    <div className='user flex items-center justify-center gap-3'>
      <Button
        variant='outline'
        onClick={() => setOpen(true)}
        className='hidden md:block'
      >
        Criar Ambiente
      </Button>
      <SelectStore />
      {/* <SwitchTheme /> */}
      <Notifications />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className='cursor-pointer'>
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 pl-3' align='end'>
          <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
          <DropdownMenuLabel className='font-normal'>
            {user?.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href={routes.accountSettings}>
              <DropdownMenuItem>Meu perfil</DropdownMenuItem>
            </Link>
            <Link href={routes.checkout}>
              <DropdownMenuItem>Assinar Kirofy</DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => fetchStripePortal()}>
              Minhas Assinaturas
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button type='button' onClick={handleSignOut} className='w-full'>
              Sair
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <NewWorkspaceSheet open={open} onOpenChange={setOpen} />
    </div>
  )
}

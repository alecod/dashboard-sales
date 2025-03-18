import { useAuthHook } from '@/hooks/auth-hook'
import { routes } from '@/routes/routes'
import { formatName } from '@/utils/format-name'
import { getGreeting } from '@/utils/get-greeting'
import { usePathname } from 'next/navigation'
import { SheetMenu } from '../sidebar/sheet-menu'
import { UserMenu } from './profile-menu'

export function Navbar() {
  const { user } = useAuthHook()
  const pathname = usePathname()

  return (
    <header className='container justify-between'>
      <div className='flex h-20 w-full items-center lg:justify-between'>
        <div className='flex items-center space-x-4 sm:w-16 lg:hidden lg:space-x-0'>
          <SheetMenu />
        </div>
        <div className='flex w-full justify-end lg:items-center lg:justify-between'>
          <div className='hidden lg:flex'>
            {pathname === routes.dashboard && user && (
              <span className='text-base'>
                {' '}
                {getGreeting()},{' '}
                <span className='font-bold text-kirofy-default'>
                  {formatName(user?.name)}
                </span>
                {' | '}
                <span className='text-xs'>
                  {' '}
                  Aqui está um resumo das metricas da sua loja nos últimos 7
                  dias.
                </span>
              </span>
            )}
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

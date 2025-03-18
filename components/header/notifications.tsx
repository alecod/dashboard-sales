'use client'
import { ENV } from '@/env/env-store'
import { useAuthHook } from '@/hooks/auth-hook'
import {
  NotificationBell,
  NovuProvider,
  PopoverNotificationCenter,
} from '@novu/notification-center'

export function Notifications() {
  const { user } = useAuthHook()
  const { NOVU_BACKEND_URL, NOVU_IDENTIFIER, NOVU_SOCKET_URL, API_URL } = ENV()
  return (
    <>
      <NovuProvider
        i18n={{
          lang: 'pt-br',
          translations: {
            notifications: 'Notificações',
            settings: 'Configurações',
            markAllAsRead: 'Marcar todos como lido',
            removeMessage: 'Remover mensagem',
            markAsRead: 'Marcar como lido',
            markAsUnRead: 'Marcar como não lido',
            noNewNotification: 'Sem novas notificações',
            poweredBy: 'Kirofy',
          },
        }}
        backendUrl={NOVU_BACKEND_URL}
        socketUrl={NOVU_SOCKET_URL}
        subscriberId={user?.id}
        applicationIdentifier={NOVU_IDENTIFIER as string}
        stores={[
          {
            query: {
              feedIdentifier: '',
            },
            storeId: 'all',
          },
          {
            query: {
              feedIdentifier: 'system',
            },
            storeId: 'system',
          },
          {
            query: {
              feedIdentifier: 'changelog',
            },
            storeId: 'changelog',
          },
        ]}
        styles={{
          layout: {
            root: {
              '*::selection': { background: '#08a4b8' },
              backgroundColor: '#0c2027',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '500',
              padding: '8px 8px',
            },
          },
          header: {
            markAsRead: {
              color: '#fff !important',
            },
            cog: {
              color: '#fff',
            },
          },
          bellButton: {
            root: {
              fill: '#fff',
              fontSize: '14px',
              fontWeight: '500',
              padding: '8px',
              border: '1px solid #1e293b',
              width: '40px',
              height: '40px',
            },
          },

          notifications: {
            listItem: {
              timestamp: {
                color: '#f3f3f3',
              },
              contentLayout: {
                color: '#fff',
                padding: '6px 10px',
              },
            },
          },
          accordion: {
            chevron: {
              color: '#fff',
            },
          },
          footer: {
            root: {
              display: 'none',
            },
          },
          loader: {
            root: {
              '*': { color: '#fff', stroke: '#19dbfe' },
            },
          },
          preferences: {
            root: {
              '&>div>div>button:hover': { background: '#112B35 !important' },
            },
          },
        }}
      >
        <PopoverNotificationCenter
          colorScheme={'dark'}
          tabs={[
            {
              name: 'Todos',
              storeId: 'all',
            },
            {
              name: 'Sistema',
              storeId: 'system',
            },
            {
              name: 'Atualizações',
              storeId: 'changelog',
            },
          ]}
        >
          {({ unseenCount }) => (
            <NotificationBell unseenCount={unseenCount} colorScheme={'dark'} />
          )}
        </PopoverNotificationCenter>
      </NovuProvider>
    </>
  )
}

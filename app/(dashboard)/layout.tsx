import { getRefreshTokenFetch } from '@/actions/auth/get-token'
import { getStoreFetch } from '@/actions/store/get-store'
import { AdminPanelLayout } from '@/components/layout/admin-panel-layout'
import { LoadInitialData } from '@/components/load-initial-data'

export default async function DemoLayout(props: { children: React.ReactNode }) {
  const refreshToken = await getRefreshTokenFetch()
  const storeFetch = await getStoreFetch({
    user_id: refreshToken?.data ? refreshToken?.data?.user?.user_id : undefined,
  })

  return (
    <AdminPanelLayout>
      <LoadInitialData
        refreshToken={refreshToken?.data}
        store={storeFetch?.data ?? undefined}
      />
      {props.children}
    </AdminPanelLayout>
  )
}

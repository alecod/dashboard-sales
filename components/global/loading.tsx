interface LoadingModalProps {
  show: boolean
}

export function LoadingModal({ show }: LoadingModalProps) {
  if (!show) return null

  return (
    <div className='fixed inset-0 z-[99999] flex items-center justify-center bg-kirofy-black bg-opacity-50 backdrop-blur-md'>
      <div className='flex items-center justify-center'>
        <div
          className='border-gray-200 h-10 w-10 animate-spin rounded-full border-4 border-t-4'
          style={{ borderTopColor: '#19dbfe' }}
        />
      </div>
    </div>
  )
}

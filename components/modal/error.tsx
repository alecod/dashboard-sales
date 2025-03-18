import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogOverlay,
} from '@/components/ui/dialog'
import { PiXCircleBold } from 'react-icons/pi'

interface ErrorModalProps {
  messageError: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ErrorModal({
  open,
  onOpenChange,
  messageError,
}: ErrorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className='bg-kirofy-black bg-opacity-50 backdrop-blur-md'>
        <DialogContent className='max-w-[425px]'>
          <div className='rounded p-6'>
            <div className='flex items-center justify-center gap-4'>
              <PiXCircleBold size={50} fill='#B61F21' />
            </div>
            <DialogTitle
              className='text-white mt-5 text-center leading-5'
              aria-describedby='Error message'
            >
              {messageError}
            </DialogTitle>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  )
}

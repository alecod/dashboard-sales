import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from '@/components/ui/sheet'

export function SheetDashboard({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader />
        <div className='grid gap-4 py-4' />
        <SheetFooter />
      </SheetContent>
    </Sheet>
  )
}

export default SheetDashboard

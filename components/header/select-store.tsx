'use client'
import { useStoreHook } from '@/hooks/store-hook'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export function SelectStore() {
  const { stores, setSelectedStore, selectedStore } = useStoreHook()

  const handleChange = (value: string) => {
    const store = stores?.find((store) => store.store_cod.toString() === value)
    if (store) {
      setSelectedStore(store.store_cod)
    }
  }

  return (
    <div className='selects'>
      <Select
        onValueChange={handleChange}
        value={selectedStore?.store_cod.toString() ?? undefined}
        disabled={!stores || stores.length === 0}
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Selecione sua loja:' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {stores?.map((store) => (
              <SelectItem
                key={store.store_cod}
                value={store.store_cod?.toString()}
                className='flex w-full items-center justify-between'
              >
                <div className='flex items-center justify-between gap-2'>
                  <span>{store.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  setUser: (user: UserInput) => void
  logout: () => void
}

export interface UserInput {
  user_id: string
  name: string
  email: string
  created_at: string
  updated_at: string | null
  birth_date: string | null
  deleted_at: string | null
}

import { create } from 'zustand'

export const useAuthHook = create<AuthState>((set) => ({
  user: null,
  setUser: (user: UserInput) => {
    set({ user: { id: user?.user_id, email: user?.email, name: user?.name } })
  },
  logout: () => {
    set({ user: null })
  },
}))

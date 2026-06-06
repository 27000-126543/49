import { create } from 'zustand'
import type { UserInfo } from '@/types'
import { mockUser } from '@/data/mockUser'

interface UserState {
  user: UserInfo
  isLoggedIn: boolean
  setUser: (user: UserInfo) => void
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: mockUser,
  isLoggedIn: true,
  setUser: (user) => set({ user }),
  logout: () => set({ isLoggedIn: false, user: mockUser })
}))

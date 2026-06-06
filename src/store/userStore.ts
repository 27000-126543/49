import { create } from 'zustand'
import { StorageService, type User, generateId, generateBadgeNumber } from '@/utils/storage'
import Taro from '@tarojs/taro'

interface UserState {
  user: User | null
  isLoggedIn: boolean
  login: (phone: string, password: string) => Promise<boolean>
  register: (data: { phone: string; password: string; name: string; enterpriseName: string }) => Promise<boolean>
  inviteEmployee: (data: { phone: string; name: string; role: User['role']; department: string; position: string; accessFloors: number[] }) => Promise<boolean>
  updateCurrentUser: (updates: Partial<User>) => void
  logout: () => void
  initFromStorage: () => void
}

const emptyUser: User = {
  id: '',
  phone: '',
  password: '',
  name: '',
  avatar: '',
  role: 'employee',
  roleName: '员工',
  enterpriseId: '',
  department: '',
  position: '',
  badgeNumber: '',
  accessFloors: [],
  createdAt: ''
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoggedIn: false,

  initFromStorage: () => {
    const stored = StorageService.getCurrentUser()
    if (stored) {
      set({ user: stored, isLoggedIn: true })
    }
  },

  login: async (phone: string, password: string) => {
    const users = StorageService.getUsers()
    const user = users.find(u => u.phone === phone && u.password === password)
    if (user) {
      StorageService.setCurrentUser(user)
      set({ user, isLoggedIn: true })
      StorageService.addMessage({
        id: generateId(),
        userId: user.id,
        title: '登录成功',
        content: `欢迎回来，${user.name}！`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString()
      })
      return true
    }
    Taro.showToast({ title: '手机号或密码错误', icon: 'none' })
    return false
  },

  register: async (data) => {
    const users = StorageService.getUsers()
    if (users.find(u => u.phone === data.phone)) {
      Taro.showToast({ title: '该手机号已注册', icon: 'none' })
      return false
    }

    const enterpriseId = generateId()
    StorageService.addEnterprise({
      id: enterpriseId,
      name: data.enterpriseName,
      adminId: '',
      createdAt: new Date().toISOString()
    })

    const userId = generateId()
    const newUser: User = {
      id: userId,
      phone: data.phone,
      password: data.password,
      name: data.name,
      avatar: `https://picsum.photos/id/${64 + Math.floor(Math.random() * 30)}/200/200`,
      role: 'admin',
      roleName: '企业管理员',
      enterpriseId,
      department: '总经办',
      position: '企业管理员',
      badgeNumber: generateBadgeNumber(),
      accessFloors: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12],
      createdAt: new Date().toISOString()
    }

    const ents = StorageService.getEnterprises()
    const entIdx = ents.findIndex(e => e.id === enterpriseId)
    if (entIdx >= 0) {
      ents[entIdx].adminId = userId
      StorageService.setEnterprises(ents)
    }

    StorageService.addUser(newUser)
    StorageService.setCurrentUser(newUser)

    StorageService.addMessage({
      id: generateId(),
      userId: 'all',
      title: '新企业入驻',
      content: `${data.enterpriseName}已成功入驻智慧园区`,
      type: 'notice',
      read: false,
      createdAt: new Date().toISOString()
    })
    StorageService.addMessage({
      id: generateId(),
      userId: userId,
      title: '注册成功',
      content: `欢迎您，${newUser.roleName}${data.name}！请创建您的企业空间。`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    })

    set({ user: newUser, isLoggedIn: true })
    return true
  },

  inviteEmployee: async (data) => {
    const { user } = get()
    if (!user) return false

    const users = StorageService.getUsers()
    if (users.find(u => u.phone === data.phone)) {
      Taro.showToast({ title: '该手机号已存在', icon: 'none' })
      return false
    }

    const roleNameMap = { employee: '普通员工', finance: '财务人员', executive: '高管', admin: '管理员' }

    const newUser: User = {
      id: generateId(),
      phone: data.phone,
      password: '123456',
      name: data.name,
      avatar: `https://picsum.photos/id/${64 + Math.floor(Math.random() * 30)}/200/200`,
      role: data.role,
      roleName: roleNameMap[data.role],
      enterpriseId: user.enterpriseId,
      department: data.department,
      position: data.position,
      badgeNumber: generateBadgeNumber(),
      accessFloors: data.accessFloors,
      createdAt: new Date().toISOString()
    }

    StorageService.addUser(newUser)

    StorageService.addMessage({
      id: generateId(),
      userId: user.id,
      title: '员工邀请成功',
      content: `已成功邀请${data.name}加入企业，初始密码为123456`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    })

    Taro.showToast({ title: '邀请成功', icon: 'success' })
    return true
  },

  updateCurrentUser: (updates) => {
    const { user } = get()
    if (!user) return
    StorageService.updateUser(user.id, updates)
    const updated = StorageService.getCurrentUser()
    if (updated) set({ user: updated })
  },

  logout: () => {
    StorageService.setCurrentUser(null)
    set({ user: null, isLoggedIn: false })
    Taro.showToast({ title: '已退出登录', icon: 'none' })
  }
}))

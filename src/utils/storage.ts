import Taro from '@tarojs/taro'

const STORAGE_PREFIX = 'smart_park_'

export type UserRole = 'employee' | 'finance' | 'executive' | 'admin'

export interface User {
  id: string
  phone: string
  password: string
  name: string
  avatar: string
  role: UserRole
  roleName: string
  enterpriseId: string
  department: string
  position: string
  badgeNumber: string
  accessFloors: number[]
  createdAt: string
}

export interface Enterprise {
  id: string
  name: string
  adminId: string
  createdAt: string
}

export interface MeetingRoom {
  id: string
  name: string
  floor: number
  capacity: number
  equipment: string[]
  image: string
  status: 'available' | 'occupied' | 'maintenance'
}

export type MeetingBookingStatus = 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled' | 'released'

export interface MeetingBooking {
  id: string
  roomId: string
  roomName: string
  userId: string
  userName: string
  date: string
  startTime: string
  endTime: string
  equipment: string[]
  status: MeetingBookingStatus
  statusText: string
  createdAt: string
  checkedIn: boolean
}

export type VisitorStatus = 'pending' | 'approved' | 'rejected' | 'visited' | 'expired'

export interface Visitor {
  id: string
  name: string
  phone: string
  company: string
  reason: string
  hostId: string
  hostName: string
  hostDept: string
  visitDate: string
  visitTime: string
  status: VisitorStatus
  qrCode: string
  expireTime: string
  createdAt: string
}

export type RepairPriority = 'low' | 'medium' | 'high' | 'urgent'
export type RepairStatus = 'pending' | 'assigned' | 'processing' | 'completed' | 'evaluated' | 'escalated'

export interface RepairOrder {
  id: string
  title: string
  type: string
  priority: RepairPriority
  priorityText: string
  status: RepairStatus
  statusText: string
  description: string
  images: string[]
  location: string
  userId: string
  userName: string
  assignee?: string
  progress: { time: string; desc: string }[]
  createdAt: string
  rating?: number
}

export type CanteenOrderStatus = 'paid' | 'picked' | 'refunded'

export interface CanteenMeal {
  id: string
  name: string
  price: number
  image: string
  category: string
  calories?: number
  available: boolean
}

export interface CanteenOrder {
  id: string
  userId: string
  userName: string
  meals: { mealId: string; name: string; quantity: number; price: number }[]
  totalPrice: number
  pickupCode: string
  date: string
  time: string
  status: CanteenOrderStatus
  createdAt: string
}

export interface Desk {
  id: string
  name: string
  area: string
  pricePerHour: number
  status: 'available' | 'occupied' | 'reserved'
}

export interface DeskBooking {
  id: string
  deskId: string
  deskName: string
  userId: string
  userName: string
  date: string
  startTime: string
  hours: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

export interface EnergyData {
  date: string
  electricity: number
  water: number
  enterpriseId: string
}

export interface Message {
  id: string
  userId: string
  title: string
  content: string
  type: 'system' | 'approval' | 'booking' | 'repair' | 'notice'
  read: boolean
  createdAt: string
}

const KEYS = {
  USERS: STORAGE_PREFIX + 'users',
  CURRENT_USER: STORAGE_PREFIX + 'current_user',
  ENTERPRISES: STORAGE_PREFIX + 'enterprises',
  MEETING_ROOMS: STORAGE_PREFIX + 'meeting_rooms',
  MEETING_BOOKINGS: STORAGE_PREFIX + 'meeting_bookings',
  VISITORS: STORAGE_PREFIX + 'visitors',
  REPAIR_ORDERS: STORAGE_PREFIX + 'repair_orders',
  CANTEEN_MEALS: STORAGE_PREFIX + 'canteen_meals',
  CANTEEN_ORDERS: STORAGE_PREFIX + 'canteen_orders',
  DESKS: STORAGE_PREFIX + 'desks',
  DESK_BOOKINGS: STORAGE_PREFIX + 'desk_bookings',
  ENERGY_DATA: STORAGE_PREFIX + 'energy_data',
  MESSAGES: STORAGE_PREFIX + 'messages',
  INITIALIZED: STORAGE_PREFIX + 'initialized'
}

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = Taro.getStorageSync(key)
    return data ? JSON.parse(data) : defaultValue
  } catch {
    return defaultValue
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    Taro.setStorageSync(key, JSON.stringify(value))
  } catch (e) {
    console.error('Storage set error:', e)
  }
}

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export const generateBadgeNumber = (): string => {
  return 'EP' + Date.now().toString().slice(-6)
}

export const generatePickupCode = (): string => {
  return Math.random().toString(36).substr(2, 6).toUpperCase()
}

export const generateQRCode = (prefix: string, id: string): string => {
  return `${prefix}-${id}-${Date.now()}`
}

function initializeData() {
  const initialized = getStorage<boolean>(KEYS.INITIALIZED, false)
  if (initialized) return

  const defaultMeetingRooms: MeetingRoom[] = [
    { id: 'room1', name: '星辰会议室', floor: 3, capacity: 10, equipment: ['投影', '视频会议', '白板'], image: 'https://picsum.photos/id/1/400/300', status: 'available' },
    { id: 'room2', name: '云海会议室', floor: 5, capacity: 6, equipment: ['投影', '白板'], image: 'https://picsum.photos/id/2/400/300', status: 'available' },
    { id: 'room3', name: '阳光会议室', floor: 8, capacity: 20, equipment: ['投影', '视频会议', '白板', '音响'], image: 'https://picsum.photos/id/3/400/300', status: 'available' },
    { id: 'room4', name: '竹林洽谈室', floor: 3, capacity: 4, equipment: ['白板'], image: 'https://picsum.photos/id/4/400/300', status: 'available' },
    { id: 'room5', name: '梅花厅', floor: 10, capacity: 30, equipment: ['投影', '视频会议', '音响', '麦克风'], image: 'https://picsum.photos/id/5/400/300', status: 'available' },
    { id: 'room6', name: '兰草厅', floor: 6, capacity: 8, equipment: ['投影', '白板'], image: 'https://picsum.photos/id/6/400/300', status: 'maintenance' }
  ]

  const defaultCanteenMeals: CanteenMeal[] = [
    { id: 'meal1', name: '红烧肉套餐', price: 28, image: 'https://picsum.photos/id/292/300/300', category: '热菜', calories: 650, available: true },
    { id: 'meal2', name: '宫保鸡丁套餐', price: 25, image: 'https://picsum.photos/id/312/300/300', category: '热菜', calories: 520, available: true },
    { id: 'meal3', name: '清蒸鲈鱼套餐', price: 38, image: 'https://picsum.photos/id/315/300/300', category: '海鲜', calories: 420, available: true },
    { id: 'meal4', name: '麻婆豆腐套餐', price: 18, image: 'https://picsum.photos/id/326/300/300', category: '素食', calories: 380, available: true },
    { id: 'meal5', name: '番茄鸡蛋面', price: 15, image: 'https://picsum.photos/id/292/300/300', category: '面食', calories: 450, available: true },
    { id: 'meal6', name: '牛肉拉面', price: 22, image: 'https://picsum.photos/id/326/300/300', category: '面食', calories: 580, available: true },
    { id: 'meal7', name: '蔬菜沙拉', price: 12, image: 'https://picsum.photos/id/312/300/300', category: '轻食', calories: 180, available: true },
    { id: 'meal8', name: '咖喱鸡饭', price: 26, image: 'https://picsum.photos/id/315/300/300', category: '热菜', calories: 560, available: true }
  ]

  const defaultDesks: Desk[] = [
    { id: 'desk1', name: 'A01', area: 'A区', pricePerHour: 8, status: 'available' },
    { id: 'desk2', name: 'A02', area: 'A区', pricePerHour: 8, status: 'available' },
    { id: 'desk3', name: 'A03', area: 'A区', pricePerHour: 8, status: 'available' },
    { id: 'desk4', name: 'A04', area: 'A区', pricePerHour: 8, status: 'available' },
    { id: 'desk5', name: 'B01', area: 'B区', pricePerHour: 10, status: 'available' },
    { id: 'desk6', name: 'B02', area: 'B区', pricePerHour: 10, status: 'available' },
    { id: 'desk7', name: 'B03', area: 'B区', pricePerHour: 10, status: 'available' },
    { id: 'desk8', name: 'C01', area: 'C区', pricePerHour: 15, status: 'available' },
    { id: 'desk9', name: 'C02', area: 'C区', pricePerHour: 15, status: 'available' },
    { id: 'desk10', name: 'C03', area: 'C区', pricePerHour: 15, status: 'available' }
  ]

  const today = new Date().toISOString().split('T')[0]
  const defaultEnergyData: EnergyData[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    defaultEnergyData.push({
      date: dateStr,
      electricity: Math.round(100 + Math.random() * 200),
      water: Math.round(10 + Math.random() * 30),
      enterpriseId: 'default'
    })
  }

  setStorage(KEYS.MEETING_ROOMS, defaultMeetingRooms)
  setStorage(KEYS.CANTEEN_MEALS, defaultCanteenMeals)
  setStorage(KEYS.DESKS, defaultDesks)
  setStorage(KEYS.ENERGY_DATA, defaultEnergyData)
  setStorage(KEYS.USERS, [])
  setStorage(KEYS.ENTERPRISES, [])
  setStorage(KEYS.MEETING_BOOKINGS, [])
  setStorage(KEYS.VISITORS, [])
  setStorage(KEYS.REPAIR_ORDERS, [])
  setStorage(KEYS.CANTEEN_ORDERS, [])
  setStorage(KEYS.DESK_BOOKINGS, [])
  setStorage(KEYS.MESSAGES, [])
  setStorage(KEYS.INITIALIZED, true)
}

initializeData()

export const StorageService = {
  getCurrentUser: (): User | null => getStorage<User | null>(KEYS.CURRENT_USER, null),
  setCurrentUser: (user: User | null) => setStorage(KEYS.CURRENT_USER, user),

  getUsers: (): User[] => getStorage<User[]>(KEYS.USERS, []),
  setUsers: (users: User[]) => setStorage(KEYS.USERS, users),
  addUser: (user: User) => {
    const users = StorageService.getUsers()
    users.push(user)
    StorageService.setUsers(users)
  },
  updateUser: (userId: string, updates: Partial<User>) => {
    const users = StorageService.getUsers()
    const idx = users.findIndex(u => u.id === userId)
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates }
      StorageService.setUsers(users)
      const currentUser = StorageService.getCurrentUser()
      if (currentUser && currentUser.id === userId) {
        StorageService.setCurrentUser(users[idx])
      }
    }
  },

  getEnterprises: (): Enterprise[] => getStorage<Enterprise[]>(KEYS.ENTERPRISES, []),
  setEnterprises: (ents: Enterprise[]) => setStorage(KEYS.ENTERPRISES, ents),
  addEnterprise: (ent: Enterprise) => {
    const ents = StorageService.getEnterprises()
    ents.push(ent)
    StorageService.setEnterprises(ents)
  },

  getMeetingRooms: (): MeetingRoom[] => getStorage<MeetingRoom[]>(KEYS.MEETING_ROOMS, []),
  getMeetingRoom: (id: string): MeetingRoom | undefined => StorageService.getMeetingRooms().find(r => r.id === id),

  getMeetingBookings: (): MeetingBooking[] => getStorage<MeetingBooking[]>(KEYS.MEETING_BOOKINGS, []),
  setMeetingBookings: (bookings: MeetingBooking[]) => setStorage(KEYS.MEETING_BOOKINGS, bookings),
  addMeetingBooking: (booking: MeetingBooking) => {
    const bookings = StorageService.getMeetingBookings()
    bookings.push(booking)
    StorageService.setMeetingBookings(bookings)
  },
  updateMeetingBooking: (id: string, updates: Partial<MeetingBooking>) => {
    const bookings = StorageService.getMeetingBookings()
    const idx = bookings.findIndex(b => b.id === id)
    if (idx >= 0) {
      bookings[idx] = { ...bookings[idx], ...updates }
      StorageService.setMeetingBookings(bookings)
    }
  },

  getVisitors: (): Visitor[] => getStorage<Visitor[]>(KEYS.VISITORS, []),
  setVisitors: (visitors: Visitor[]) => setStorage(KEYS.VISITORS, visitors),
  addVisitor: (visitor: Visitor) => {
    const visitors = StorageService.getVisitors()
    visitors.push(visitor)
    StorageService.setVisitors(visitors)
  },
  updateVisitor: (id: string, updates: Partial<Visitor>) => {
    const visitors = StorageService.getVisitors()
    const idx = visitors.findIndex(v => v.id === id)
    if (idx >= 0) {
      visitors[idx] = { ...visitors[idx], ...updates }
      StorageService.setVisitors(visitors)
    }
  },

  getRepairOrders: (): RepairOrder[] => getStorage<RepairOrder[]>(KEYS.REPAIR_ORDERS, []),
  setRepairOrders: (orders: RepairOrder[]) => setStorage(KEYS.REPAIR_ORDERS, orders),
  addRepairOrder: (order: RepairOrder) => {
    const orders = StorageService.getRepairOrders()
    orders.push(order)
    StorageService.setRepairOrders(orders)
  },
  updateRepairOrder: (id: string, updates: Partial<RepairOrder>) => {
    const orders = StorageService.getRepairOrders()
    const idx = orders.findIndex(o => o.id === id)
    if (idx >= 0) {
      orders[idx] = { ...orders[idx], ...updates }
      StorageService.setRepairOrders(orders)
    }
  },

  getCanteenMeals: (): CanteenMeal[] => getStorage<CanteenMeal[]>(KEYS.CANTEEN_MEALS, []),
  getCanteenOrders: (): CanteenOrder[] => getStorage<CanteenOrder[]>(KEYS.CANTEEN_ORDERS, []),
  setCanteenOrders: (orders: CanteenOrder[]) => setStorage(KEYS.CANTEEN_ORDERS, orders),
  addCanteenOrder: (order: CanteenOrder) => {
    const orders = StorageService.getCanteenOrders()
    orders.push(order)
    StorageService.setCanteenOrders(orders)
  },

  getDesks: (): Desk[] => getStorage<Desk[]>(KEYS.DESKS, []),
  getDeskBookings: (): DeskBooking[] => getStorage<DeskBooking[]>(KEYS.DESK_BOOKINGS, []),
  setDeskBookings: (bookings: DeskBooking[]) => setStorage(KEYS.DESK_BOOKINGS, bookings),
  addDeskBooking: (booking: DeskBooking) => {
    const bookings = StorageService.getDeskBookings()
    bookings.push(booking)
    StorageService.setDeskBookings(bookings)
  },

  getEnergyData: (): EnergyData[] => getStorage<EnergyData[]>(KEYS.ENERGY_DATA, []),

  getMessages: (userId: string): Message[] => {
    const all = getStorage<Message[]>(KEYS.MESSAGES, [])
    return all.filter(m => m.userId === userId || m.userId === 'all')
  },
  addMessage: (msg: Message) => {
    const msgs = getStorage<Message[]>(KEYS.MESSAGES, [])
    msgs.push(msg)
    setStorage(KEYS.MESSAGES, msgs)
  },
  markMessageRead: (msgId: string) => {
    const msgs = getStorage<Message[]>(KEYS.MESSAGES, [])
    const idx = msgs.findIndex(m => m.id === msgId)
    if (idx >= 0) {
      msgs[idx].read = true
      setStorage(KEYS.MESSAGES, msgs)
    }
  },
  markAllMessagesRead: (userId: string) => {
    const msgs = getStorage<Message[]>(KEYS.MESSAGES, [])
    msgs.forEach(m => {
      if (m.userId === userId || m.userId === 'all') m.read = true
    })
    setStorage(KEYS.MESSAGES, msgs)
  }
}

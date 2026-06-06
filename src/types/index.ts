export interface UserInfo {
  id: string
  name: string
  avatar: string
  phone: string
  role: 'employee' | 'finance' | 'executive' | 'admin'
  roleName: string
  enterpriseId: string
  enterpriseName: string
  department: string
  position: string
  badgeNumber: string
  accessFloors: number[]
}

export interface StatItem {
  label: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'none'
  trendValue?: string
  color?: string
}

export interface QuickEntryItem {
  id: string
  name: string
  iconColor: string
  iconBg: string
  path: string
  badge?: string
}

export interface NoticeItem {
  id: string
  title: string
  content: string
  time: string
  type: 'system' | 'notice' | 'warning'
}

export interface ServiceItem {
  id: string
  name: string
  desc: string
  iconColor: string
  iconBg: string
  path: string
  status?: 'online' | 'offline'
  badge?: string
}

export type BookingType = 'meeting' | 'desk' | 'visitor'

export interface BookingItem {
  id: string
  type: BookingType
  title: string
  subtitle: string
  time: string
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled' | 'ongoing'
  statusText: string
  location?: string
  qrCode?: string
}

export interface MessageItem {
  id: string
  title: string
  content: string
  time: string
  type: 'system' | 'approval' | 'booking' | 'repair' | 'notice'
  read: boolean
  avatar?: string
}

export interface MeetingRoom {
  id: string
  name: string
  floor: number
  capacity: number
  equipment: string[]
  status: 'available' | 'occupied' | 'maintenance'
  image: string
}

export interface TimeSlot {
  id: string
  start: string
  end: string
  available: boolean
}

export interface VisitorInfo {
  id: string
  name: string
  phone: string
  company: string
  reason: string
  hostName: string
  hostDept: string
  visitDate: string
  visitTime: string
  status: 'pending' | 'approved' | 'rejected' | 'visited' | 'expired'
  qrCode: string
  expireTime: string
}

export interface RepairOrder {
  id: string
  title: string
  type: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  priorityText: string
  status: 'pending' | 'assigned' | 'processing' | 'completed' | 'evaluated'
  statusText: string
  description: string
  images: string[]
  location: string
  createTime: string
  assignee?: string
  progress?: { time: string; desc: string }[]
}

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
  meals: { mealId: string; name: string; quantity: number }[]
  totalPrice: number
  pickupCode: string
  date: string
  time: string
  status: 'paid' | 'picked' | 'refunded'
}

export interface EnergyData {
  date: string
  electricity: number
  water: number
}

export interface DeskInfo {
  id: string
  name: string
  area: string
  pricePerHour: number
  status: 'available' | 'occupied' | 'reserved'
}

import type { EnergyData, DeskInfo } from '@/types'

export const mockEnergyData: EnergyData[] = [
  { date: '6/1', electricity: 856, water: 42 },
  { date: '6/2', electricity: 912, water: 45 },
  { date: '6/3', electricity: 1024, water: 52 },
  { date: '6/4', electricity: 980, water: 48 },
  { date: '6/5', electricity: 876, water: 44 },
  { date: '6/6', electricity: 945, water: 50 }
]

export const mockFloorEnergy = [
  { floor: '12层', enterprise: '智云科技', electricity: 185, water: 8, status: 'normal', percent: 72 },
  { floor: '11层', enterprise: '智云科技', electricity: 156, water: 7, status: 'warning', percent: 92 },
  { floor: '10层', enterprise: '创新互联', electricity: 142, water: 6, status: 'normal', percent: 65 },
  { floor: '9层', enterprise: '创新互联', electricity: 128, water: 5, status: 'normal', percent: 58 },
  { floor: '8层', enterprise: '博远科技', electricity: 168, water: 8, status: 'danger', percent: 98 },
  { floor: '7层', enterprise: '博远科技', electricity: 134, water: 6, status: 'normal', percent: 60 }
]

export const mockDesks: DeskInfo[] = [
  { id: 'd001', name: 'A-001', area: '安静区', pricePerHour: 8, status: 'available' },
  { id: 'd002', name: 'A-002', area: '安静区', pricePerHour: 8, status: 'occupied' },
  { id: 'd003', name: 'A-003', area: '安静区', pricePerHour: 8, status: 'available' },
  { id: 'd004', name: 'A-004', area: '安静区', pricePerHour: 8, status: 'reserved' },
  { id: 'd005', name: 'A-005', area: '安静区', pricePerHour: 8, status: 'available' },
  { id: 'd006', name: 'B-001', area: '协作区', pricePerHour: 10, status: 'available' },
  { id: 'd007', name: 'B-002', area: '协作区', pricePerHour: 10, status: 'available' },
  { id: 'd008', name: 'B-003', area: '协作区', pricePerHour: 10, status: 'occupied' },
  { id: 'd009', name: 'B-004', area: '协作区', pricePerHour: 10, status: 'available' },
  { id: 'd010', name: 'B-005', area: '协作区', pricePerHour: 10, status: 'reserved' },
  { id: 'd011', name: 'C-001', area: '靠窗区', pricePerHour: 12, status: 'available' },
  { id: 'd012', name: 'C-002', area: '靠窗区', pricePerHour: 12, status: 'available' },
  { id: 'd013', name: 'C-003', area: '靠窗区', pricePerHour: 12, status: 'occupied' },
  { id: 'd014', name: 'C-004', area: '靠窗区', pricePerHour: 12, status: 'available' },
  { id: 'd015', name: 'C-005', area: '靠窗区', pricePerHour: 12, status: 'available' }
]

export const mockAdminDashboard = {
  occupancyRate: 92.5,
  meetingUtilization: 78,
  repairAvgTime: '42分钟',
  canteenPeak: 856,
  topEnergy: [
    { name: '博远科技 8层', value: 98 },
    { name: '智云科技 11层', value: 92 },
    { name: '创新互联 5层', value: 85 },
    { name: '智云科技 12层', value: 72 },
    { name: '创新互联 10层', value: 65 }
  ],
  meetingPrediction: [
    { time: '08:00', rate: 35 },
    { time: '09:00', rate: 68 },
    { time: '10:00', rate: 92 },
    { time: '11:00', rate: 85 },
    { time: '12:00', rate: 25 },
    { time: '13:00', rate: 45 },
    { time: '14:00', rate: 88 },
    { time: '15:00', rate: 95 },
    { time: '16:00', rate: 80 },
    { time: '17:00', rate: 55 },
    { time: '18:00', rate: 20 }
  ],
  monthlyReport: {
    totalRent: 2856000,
    totalElectricity: 185600,
    totalRepairCost: 28500,
    meetingUsageRate: 78,
    canteenRevenue: 568200
  }
}

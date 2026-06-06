import type { VisitorInfo } from '@/types'

export const mockVisitors: VisitorInfo[] = [
  {
    id: 'v001',
    name: '王建华',
    phone: '138****5678',
    company: '上海博远科技有限公司',
    reason: '商务合作洽谈',
    hostName: '张明远',
    hostDept: '战略发展部',
    visitDate: '2024-06-09',
    visitTime: '14:30',
    status: 'pending',
    qrCode: '',
    expireTime: ''
  },
  {
    id: 'v002',
    name: '刘思敏',
    phone: '139****4321',
    company: '华兴银行股份有限公司',
    reason: '银行业务对接',
    hostName: '李思琪',
    hostDept: '财务部',
    visitDate: '2024-06-07',
    visitTime: '10:00',
    status: 'approved',
    qrCode: 'VS20240607001',
    expireTime: '2024-06-07 18:00'
  },
  {
    id: 'v003',
    name: '陈志强',
    phone: '137****8765',
    company: '北京智联数据科技',
    reason: '项目方案交流',
    hostName: '王小刚',
    hostDept: '研发部',
    visitDate: '2024-06-10',
    visitTime: '09:30',
    status: 'approved',
    qrCode: 'VS20240610001',
    expireTime: '2024-06-10 18:00'
  },
  {
    id: 'v004',
    name: '赵小燕',
    phone: '136****9876',
    company: '个人（求职者）',
    reason: '面试',
    hostName: '刘子豪',
    hostDept: '人力资源部',
    visitDate: '2024-05-28',
    visitTime: '14:00',
    status: 'visited',
    qrCode: 'VS20240528002',
    expireTime: '2024-05-28 18:00'
  },
  {
    id: 'v005',
    name: '孙伟东',
    phone: '135****6543',
    company: '华南建设集团',
    reason: '装修方案沟通',
    hostName: '陈雨婷',
    hostDept: '市场部',
    visitDate: '2024-05-20',
    visitTime: '15:00',
    status: 'expired',
    qrCode: 'VS20240520001',
    expireTime: '2024-05-20 18:00'
  }
]

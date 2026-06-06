import type { StatItem, QuickEntryItem, NoticeItem } from '@/types'

export const mockStats: StatItem[] = [
  {
    label: '入驻企业',
    value: 86,
    unit: '家',
    trend: 'up',
    trendValue: '+3.2%',
    color: '#165DFF'
  },
  {
    label: '今日在园',
    value: 1247,
    unit: '人',
    trend: 'up',
    trendValue: '+5.8%',
    color: '#00B42A'
  },
  {
    label: '会议室利用率',
    value: 78,
    unit: '%',
    trend: 'down',
    trendValue: '-2.1%',
    color: '#722ED1'
  },
  {
    label: '本月能耗',
    value: 12.8,
    unit: '万度',
    trend: 'down',
    trendValue: '-8.5%',
    color: '#F53F3F'
  }
]

export const mockQuickEntries: QuickEntryItem[] = [
  {
    id: 'meeting',
    name: '会议室',
    iconColor: '#722ED1',
    iconBg: 'rgba(114, 46, 209, 0.1)',
    path: '/pages/meeting-booking/index'
  },
  {
    id: 'desk',
    name: '共享工位',
    iconColor: '#13C2C2',
    iconBg: 'rgba(19, 194, 194, 0.1)',
    path: '/pages/desk-booking/index'
  },
  {
    id: 'visitor',
    name: '访客预约',
    iconColor: '#FA8C16',
    iconBg: 'rgba(250, 140, 22, 0.1)',
    path: '/pages/visitor-booking/index',
    badge: '2'
  },
  {
    id: 'repair',
    name: '物业报修',
    iconColor: '#EB2F96',
    iconBg: 'rgba(235, 47, 150, 0.1)',
    path: '/pages/repair/index'
  },
  {
    id: 'canteen',
    name: '食堂订餐',
    iconColor: '#52C41A',
    iconBg: 'rgba(82, 196, 26, 0.1)',
    path: '/pages/canteen/index'
  },
  {
    id: 'energy',
    name: '能耗监控',
    iconColor: '#F5222D',
    iconBg: 'rgba(245, 34, 45, 0.1)',
    path: '/pages/energy/index'
  },
  {
    id: 'access',
    name: '门禁通行',
    iconColor: '#165DFF',
    iconBg: 'rgba(22, 93, 255, 0.1)',
    path: ''
  },
  {
    id: 'admin',
    name: '管理看板',
    iconColor: '#0FC6C2',
    iconBg: 'rgba(15, 198, 194, 0.1)',
    path: '/pages/admin/index'
  }
]

export const mockNotices: NoticeItem[] = [
  {
    id: 'n001',
    title: '园区通知',
    content: '本周五14:00将进行消防应急演练，请各企业做好配合。',
    time: '10分钟前',
    type: 'notice'
  },
  {
    id: 'n002',
    title: '系统提醒',
    content: '您的会议室「创新厅」将于15分钟后开始，请准时到达。',
    time: '30分钟前',
    type: 'system'
  },
  {
    id: 'n003',
    title: '能耗预警',
    content: 'A栋8层今日用电量已达阈值，建议检查空调和照明设备。',
    time: '2小时前',
    type: 'warning'
  }
]

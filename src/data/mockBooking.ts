import type { BookingItem } from '@/types'

export const mockBookings: BookingItem[] = [
  {
    id: 'b001',
    type: 'meeting',
    title: '创新厅会议室',
    subtitle: 'Q2季度战略评审会',
    time: '今天 14:00 - 16:00',
    status: 'ongoing',
    statusText: '进行中',
    location: 'A栋12层 1201',
    qrCode: 'MR20240606001'
  },
  {
    id: 'b002',
    type: 'meeting',
    title: '星空厅会议室',
    subtitle: '产品需求评审',
    time: '明天 10:00 - 12:00',
    status: 'approved',
    statusText: '已确认',
    location: 'A栋5层 503'
  },
  {
    id: 'b003',
    type: 'desk',
    title: '共享工位 A-086',
    subtitle: '独立工位，配备显示器',
    time: '6月8日 09:00 - 18:00',
    status: 'approved',
    statusText: '已预订',
    location: 'B栋3层 开放办公区'
  },
  {
    id: 'b004',
    type: 'visitor',
    title: '访客：王建华',
    subtitle: '上海博远科技 - 商务总监',
    time: '6月9日 14:30',
    status: 'pending',
    statusText: '待审批',
    qrCode: '待审批通过后生成'
  },
  {
    id: 'b005',
    type: 'meeting',
    title: '启明厅会议室',
    subtitle: '跨部门周例会',
    time: '6月3日 09:00 - 10:30',
    status: 'completed',
    statusText: '已完成',
    location: 'A栋8层 802'
  },
  {
    id: 'b006',
    type: 'desk',
    title: '共享工位 B-023',
    subtitle: '靠窗安静工位',
    time: '6月1日 09:00 - 12:00',
    status: 'completed',
    statusText: '已完成',
    location: 'B栋6层 开放办公区'
  },
  {
    id: 'b007',
    type: 'visitor',
    title: '访客：刘思敏',
    subtitle: '华兴银行 - 客户经理',
    time: '5月28日 10:00',
    status: 'completed',
    statusText: '已到访',
    qrCode: 'VS20240528001'
  },
  {
    id: 'b008',
    type: 'meeting',
    title: '博雅厅会议室',
    subtitle: '供应商洽谈',
    time: '5月25日 15:00 - 17:00',
    status: 'cancelled',
    statusText: '已取消',
    location: 'A栋10层 1001'
  }
]

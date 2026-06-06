import type { ServiceItem } from '@/types'

export interface ServiceGroup {
  id: string
  title: string
  items: ServiceItem[]
}

export const mockServiceGroups: ServiceGroup[] = [
  {
    id: 'work',
    title: '办公服务',
    items: [
      {
        id: 'meeting',
        name: '会议室预约',
        desc: '在线预约，智能分配',
        iconColor: '#722ED1',
        iconBg: 'rgba(114, 46, 209, 0.1)',
        path: '/pages/meeting-booking/index',
        status: 'online'
      },
      {
        id: 'desk',
        name: '共享工位',
        desc: '灵活办公，按时计费',
        iconColor: '#13C2C2',
        iconBg: 'rgba(19, 194, 194, 0.1)',
        path: '/pages/desk-booking/index',
        status: 'online'
      },
      {
        id: 'visitor',
        name: '访客管理',
        desc: '预约审批，二维码通行',
        iconColor: '#FA8C16',
        iconBg: 'rgba(250, 140, 22, 0.1)',
        path: '/pages/visitor-booking/index',
        status: 'online'
      },
      {
        id: 'access',
        name: '门禁通行',
        desc: '电子工牌，无感通行',
        iconColor: '#165DFF',
        iconBg: 'rgba(22, 93, 255, 0.1)',
        path: '',
        status: 'online'
      }
    ]
  },
  {
    id: 'life',
    title: '生活服务',
    items: [
      {
        id: 'canteen',
        name: '食堂订餐',
        desc: '提前预订，免排队取餐',
        iconColor: '#52C41A',
        iconBg: 'rgba(82, 196, 26, 0.1)',
        path: '/pages/canteen/index',
        status: 'online'
      },
      {
        id: 'repair',
        name: '物业报修',
        desc: '智能派单，实时跟进',
        iconColor: '#EB2F96',
        iconBg: 'rgba(235, 47, 150, 0.1)',
        path: '/pages/repair/index',
        status: 'online'
      },
      {
        id: 'parking',
        name: '停车服务',
        desc: '车位查询，无感支付',
        iconColor: '#1677FF',
        iconBg: 'rgba(22, 119, 255, 0.1)',
        path: '',
        status: 'online'
      },
      {
        id: 'courier',
        name: '快递服务',
        desc: '快递代收，取件通知',
        iconColor: '#722ED1',
        iconBg: 'rgba(114, 46, 209, 0.1)',
        path: '',
        status: 'online'
      }
    ]
  },
  {
    id: 'manage',
    title: '企业管理',
    items: [
      {
        id: 'enterprise',
        name: '企业空间',
        desc: '员工管理，权限配置',
        iconColor: '#165DFF',
        iconBg: 'rgba(22, 93, 255, 0.1)',
        path: '/pages/enterprise/index',
        status: 'online'
      },
      {
        id: 'energy',
        name: '能耗监控',
        desc: '用量统计，节能分析',
        iconColor: '#F5222D',
        iconBg: 'rgba(245, 34, 45, 0.1)',
        path: '/pages/energy/index',
        status: 'online'
      },
      {
        id: 'admin',
        name: '管理看板',
        desc: '数据大屏，运营分析',
        iconColor: '#0FC6C2',
        iconBg: 'rgba(15, 198, 194, 0.1)',
        path: '/pages/admin/index',
        status: 'online'
      },
      {
        id: 'report',
        name: '报表中心',
        desc: '多维度报表，一键导出',
        iconColor: '#FA8C16',
        iconBg: 'rgba(250, 140, 22, 0.1)',
        path: '',
        status: 'online'
      }
    ]
  }
]

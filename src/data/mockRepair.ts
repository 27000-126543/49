import type { RepairOrder } from '@/types'

export const mockRepairs: RepairOrder[] = [
  {
    id: 'rp001',
    title: '空调不制冷',
    type: '空调维修',
    priority: 'high',
    priorityText: '高优先级',
    status: 'assigned',
    statusText: '已派单',
    description: '8层802办公室中央空调不出冷风，室温已达30度，影响正常办公。',
    images: [
      'https://picsum.photos/id/201/400/300',
      'https://picsum.photos/id/160/400/300'
    ],
    location: 'A栋8层 802办公室',
    createTime: '2024-06-06 09:15',
    assignee: '李师傅',
    progress: [
      { time: '09:15', desc: '您已提交报修申请' },
      { time: '09:18', desc: '系统已智能派单给空调维修组' },
      { time: '09:22', desc: '李师傅已接单，预计30分钟内到达' }
    ]
  },
  {
    id: 'rp002',
    title: '打印机频繁卡纸',
    type: '办公设备',
    priority: 'medium',
    priorityText: '中优先级',
    status: 'completed',
    statusText: '已完成',
    description: '5层打印区的HP打印机频繁卡纸，已清理过一次但问题依旧。',
    images: [
      'https://picsum.photos/id/1/400/300'
    ],
    location: 'A栋5层 打印区',
    createTime: '2024-06-05 14:30',
    assignee: '王师傅',
    progress: [
      { time: '14:30', desc: '您已提交报修申请' },
      { time: '14:32', desc: '系统已智能派单给设备维修组' },
      { time: '14:35', desc: '王师傅已接单' },
      { time: '14:50', desc: '王师傅已到达现场开始维修' },
      { time: '15:20', desc: '维修完成，已更换搓纸轮' }
    ]
  },
  {
    id: 'rp003',
    title: '茶水间水龙头漏水',
    type: '水电维修',
    priority: 'urgent',
    priorityText: '紧急',
    status: 'processing',
    statusText: '维修中',
    description: '12层茶水间洗手池水龙头严重漏水，地面已有积水。',
    images: [
      'https://picsum.photos/id/2/400/300'
    ],
    location: 'A栋12层 茶水间',
    createTime: '2024-06-06 10:45',
    assignee: '张师傅',
    progress: [
      { time: '10:45', desc: '您已提交报修申请' },
      { time: '10:46', desc: '系统检测为紧急工单，已通知主管' },
      { time: '10:48', desc: '已紧急派单给水电维修组' },
      { time: '10:55', desc: '张师傅已到达现场处理中' }
    ]
  },
  {
    id: 'rp004',
    title: '走廊灯不亮',
    type: '照明维修',
    priority: 'low',
    priorityText: '低优先级',
    status: 'evaluated',
    statusText: '已评价',
    description: 'B栋3层东侧走廊有两盏灯不亮，晚上光线较暗。',
    images: [],
    location: 'B栋3层 东侧走廊',
    createTime: '2024-06-04 18:20',
    assignee: '刘师傅',
    progress: [
      { time: '18:20', desc: '您已提交报修申请' },
      { time: '06-05 08:30', desc: '系统已智能派单给电工组' },
      { time: '06-05 09:00', desc: '刘师傅已接单' },
      { time: '06-05 10:30', desc: '维修完成，已更换LED灯管' }
    ]
  },
  {
    id: 'rp005',
    title: '电梯有异响',
    type: '电梯维修',
    priority: 'high',
    priorityText: '高优先级',
    status: 'pending',
    statusText: '待派单',
    description: 'A栋2号电梯运行时发出异常摩擦声，乘坐时有轻微晃动。',
    images: [],
    location: 'A栋 2号电梯',
    createTime: '2024-06-06 11:20'
  }
]

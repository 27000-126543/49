import type { MessageItem } from '@/types'

export const mockMessages: MessageItem[] = [
  {
    id: 'm001',
    title: '预约提醒',
    content: '您的会议室「创新厅」将于15分钟后开始，请准时到达。',
    time: '刚刚',
    type: 'booking',
    read: false
  },
  {
    id: 'm002',
    title: '访客审批',
    content: '王建华（上海博远科技）申请于6月9日14:30拜访，请审批。',
    time: '10分钟前',
    type: 'approval',
    read: false,
    avatar: 'https://picsum.photos/id/1012/200/200'
  },
  {
    id: 'm003',
    title: '报修进度更新',
    content: '您的报修单「空调不制冷」已派单给维修组李师傅，预计30分钟内到达。',
    time: '30分钟前',
    type: 'repair',
    read: false
  },
  {
    id: 'm004',
    title: '能耗预警',
    content: 'A栋8层今日用电量已达阈值85%，建议检查空调和照明设备使用情况。',
    time: '1小时前',
    type: 'system',
    read: true
  },
  {
    id: 'm005',
    title: '签到通知',
    content: '您预订的会议室「星空厅」将于明天10:00开始，请记得准时签到。',
    time: '2小时前',
    type: 'booking',
    read: true
  },
  {
    id: 'm006',
    title: '订单确认',
    content: '您的食堂订单已支付成功，取餐码：A827，请在午餐时段前往3号窗口取餐。',
    time: '3小时前',
    type: 'notice',
    read: true
  },
  {
    id: 'm007',
    title: '报修完成',
    content: '您的报修单「打印机卡纸」已处理完成，请您确认并评价服务。',
    time: '昨天',
    type: 'repair',
    read: true
  },
  {
    id: 'm008',
    title: '园区通知',
    content: '本周五14:00将进行消防应急演练，请各企业做好配合。',
    time: '昨天',
    type: 'notice',
    read: true
  },
  {
    id: 'm009',
    title: '访客已到访',
    content: '刘思敏（华兴银行）已于10:02扫码进入园区，正在前往您的办公室。',
    time: '5月28日',
    type: 'approval',
    read: true,
    avatar: 'https://picsum.photos/id/1013/200/200'
  },
  {
    id: 'm010',
    title: '系统通知',
    content: '本周会议室高峰时段为10:00-11:30和14:00-16:00，建议错峰预订。',
    time: '5月27日',
    type: 'system',
    read: true
  }
]

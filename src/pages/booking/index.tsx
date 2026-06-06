import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import BookingItem from '@/components/BookingItem'
import EmptyState from '@/components/EmptyState'
import { StorageService } from '@/utils/storage'
import type { BookingType } from '@/types'
import type { BookingItem as BookingItemType } from '@/types'
import type { MeetingBooking, DeskBooking, Visitor } from '@/utils/storage'

const tabs: { key: BookingType | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'meeting', label: '会议室' },
  { key: 'desk', label: '工位' },
  { key: 'visitor', label: '访客' }
]

const meetingStatusMap: Record<string, { text: string; status: BookingItemType['status'] }> = {
  pending: { text: '待确认', status: 'pending' },
  confirmed: { text: '已确认', status: 'approved' },
  ongoing: { text: '进行中', status: 'ongoing' },
  completed: { text: '已完成', status: 'completed' },
  cancelled: { text: '已取消', status: 'cancelled' },
  released: { text: '已释放', status: 'cancelled' }
}

const deskStatusMap: Record<string, { text: string; status: BookingItemType['status'] }> = {
  pending: { text: '待确认', status: 'pending' },
  confirmed: { text: '已预订', status: 'approved' },
  completed: { text: '已完成', status: 'completed' },
  cancelled: { text: '已取消', status: 'cancelled' }
}

const visitorStatusMap: Record<string, { text: string; status: BookingItemType['status'] }> = {
  pending: { text: '待审批', status: 'pending' },
  approved: { text: '已通过', status: 'approved' },
  rejected: { text: '已拒绝', status: 'rejected' },
  visited: { text: '已到访', status: 'completed' },
  expired: { text: '已过期', status: 'cancelled' }
}

function convertMeetingToBookingItem(b: MeetingBooking): BookingItemType {
  const s = meetingStatusMap[b.status] || meetingStatusMap.pending
  return {
    id: b.id,
    type: 'meeting',
    title: b.roomName,
    subtitle: b.equipment.length > 0 ? `设备：${b.equipment.join('、')}` : '会议室预约',
    time: `${b.date} ${b.startTime} - ${b.endTime}`,
    status: s.status,
    statusText: s.text,
    location: `${b.roomName}`
  }
}

function convertDeskToBookingItem(b: DeskBooking): BookingItemType {
  const s = deskStatusMap[b.status] || deskStatusMap.pending
  return {
    id: b.id,
    type: 'desk',
    title: `共享工位 ${b.deskName}`,
    subtitle: `共 ${b.hours} 小时，¥${b.totalPrice}`,
    time: `${b.date} ${b.startTime} - 共${b.hours}小时`,
    status: s.status,
    statusText: s.text,
    location: b.deskName
  }
}

function convertVisitorToBookingItem(v: Visitor): BookingItemType {
  const s = visitorStatusMap[v.status] || visitorStatusMap.pending
  return {
    id: v.id,
    type: 'visitor',
    title: `访客：${v.name}`,
    subtitle: `${v.company} - ${v.reason}`,
    time: `${v.visitDate} ${v.visitTime}`,
    status: s.status,
    statusText: s.text,
    qrCode: v.qrCode || undefined
  }
}

const BookingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BookingType | 'all'>('all')

  const user = StorageService.getCurrentUser()
  const meetingBookings = StorageService.getMeetingBookings()
  const deskBookings = StorageService.getDeskBookings()
  const visitors = StorageService.getVisitors()

  const allBookings = useMemo<BookingItemType[]>(() => {
    const userId = user?.id
    const meetings = userId
      ? meetingBookings.filter((b) => b.userId === userId).map(convertMeetingToBookingItem)
      : []
    const desks = userId
      ? deskBookings.filter((b) => b.userId === userId).map(convertDeskToBookingItem)
      : []
    const visitorItems = userId
      ? visitors
          .filter((v) => v.hostId === userId || (userId && v.id.includes(userId)))
          .map(convertVisitorToBookingItem)
      : []
    const selfVisitors = userId
      ? visitors.filter((v) => v.id.includes('self')).map(convertVisitorToBookingItem)
      : []

    return [...meetings, ...desks, ...visitorItems, ...selfVisitors].sort((a, b) =>
      b.time.localeCompare(a.time)
    )
  }, [user, meetingBookings, deskBookings, visitors])

  const filteredBookings = useMemo(() => {
    if (activeTab === 'all') return allBookings
    return allBookings.filter((b) => b.type === activeTab)
  }, [activeTab, allBookings])

  const handleNewBooking = () => {
    Taro.showActionSheet({
      itemList: ['预约会议室', '预订工位', '访客预约'],
      success: (res) => {
        const paths = [
          '/pages/meeting-booking/index',
          '/pages/desk-booking/index',
          '/pages/visitor-booking/index'
        ]
        Taro.navigateTo({ url: paths[res.tapIndex] }).catch((err) => {
          console.error('[Booking] 跳转失败:', err)
        })
      }
    })
  }

  return (
    <View>
      <ScrollView scrollY>
        <View className={styles.page}>
          <View className={styles.tabBar}>
            {tabs.map((tab) => (
              <View
                key={tab.key}
                className={classnames(styles.tabItem, activeTab === tab.key && styles.tabActive)}
                onClick={() => setActiveTab(tab.key)}
              >
                <Text>{tab.label}</Text>
              </View>
            ))}
          </View>

          {filteredBookings.length > 0 ? (
            <View className={styles.list}>
              {filteredBookings.map((booking) => (
                <BookingItem key={booking.id} data={booking} />
              ))}
            </View>
          ) : (
            <EmptyState text="暂无预约记录" icon="📅" />
          )}
        </View>
      </ScrollView>

      <View className={styles.fab} onClick={handleNewBooking}>
        <Text className={styles.fabText}>+</Text>
      </View>
    </View>
  )
}

export default BookingPage

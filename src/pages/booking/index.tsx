import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import BookingItem from '@/components/BookingItem'
import EmptyState from '@/components/EmptyState'
import { mockBookings } from '@/data/mockBooking'
import type { BookingType } from '@/types'

const tabs: { key: BookingType | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'meeting', label: '会议室' },
  { key: 'desk', label: '工位' },
  { key: 'visitor', label: '访客' }
]

const BookingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BookingType | 'all'>('all')

  const filteredBookings = useMemo(() => {
    if (activeTab === 'all') return mockBookings
    return mockBookings.filter((b) => b.type === activeTab)
  }, [activeTab])

  const handleNewBooking = () => {
    console.log('[Booking] 新建预约')
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

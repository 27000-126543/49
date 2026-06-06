import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatCard from '@/components/StatCard'
import QuickEntry from '@/components/QuickEntry'
import { useUserStore } from '@/store/userStore'
import { StorageService } from '@/utils/storage'
import { mockQuickEntries } from '@/data/mockIndex'
import type { StatItem, NoticeItem } from '@/types'

const quickIconMap: Record<string, string> = {
  meeting: '会',
  desk: '位',
  visitor: '访',
  repair: '修',
  canteen: '餐',
  energy: '能',
  access: '门',
  admin: '管'
}

const formatTime = (isoString: string): string => {
  const now = new Date()
  const date = new Date(isoString)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)
  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin}分钟前`
  if (diffHour < 24) return `${diffHour}小时前`
  if (diffDay < 7) return `${diffDay}天前`
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const HomePage: React.FC = () => {
  const { user, isLoggedIn } = useUserStore()
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    if (!isLoggedIn || !user) {
      Taro.reLaunch({ url: '/pages/login/index' })
      return
    }
    forceUpdate((n) => n + 1)
  }, [isLoggedIn, user])

  const enterpriseName = useMemo(() => {
    if (!user) return ''
    const ents = StorageService.getEnterprises()
    const ent = ents.find((e) => e.id === user.enterpriseId)
    return ent?.name || ''
  }, [user])

  const stats: StatItem[] = useMemo(() => {
    if (!user) return []
    const today = new Date().toISOString().split('T')[0]
    const meetingRoomsCount = StorageService.getMeetingRooms().length
    const todayBookingsCount = StorageService.getMeetingBookings().filter((b) => b.date === today).length
    const pendingRepairCount = StorageService.getRepairOrders().filter(
      (r) => r.status === 'pending' || r.status === 'assigned' || r.status === 'processing'
    ).length
    const unreadMsgCount = StorageService.getMessages(user.id).filter((m) => !m.read).length
    return [
      { label: '会议室数', value: meetingRoomsCount, unit: '间', color: '#165DFF' },
      { label: '今日预约', value: todayBookingsCount, unit: '条', color: '#00B42A' },
      { label: '待处理报修', value: pendingRepairCount, unit: '单', color: '#722ED1' },
      { label: '未读消息', value: unreadMsgCount, unit: '条', color: '#F53F3F' }
    ]
  }, [user])

  const notices: NoticeItem[] = useMemo(() => {
    const msgs = StorageService.getMessages(user?.id || 'all')
    const typeMap: Record<string, 'system' | 'notice' | 'warning'> = {
      system: 'system',
      notice: 'notice',
      approval: 'system',
      booking: 'notice',
      repair: 'warning'
    }
    return msgs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((m) => ({
        id: m.id,
        title: m.title,
        content: m.content,
        time: formatTime(m.createdAt),
        type: typeMap[m.type] || 'notice'
      }))
  }, [user])

  const unreadCount = useMemo(() => {
    if (!user) return 0
    return StorageService.getMessages(user.id).filter((m) => !m.read).length
  }, [user])

  const handleNoticeClick = (item: NoticeItem) => {
    console.log('[Home] 点击通知:', item.title)
    Taro.showToast({ title: '查看通知详情', icon: 'none' })
  }

  const getTagClass = (type: string) => {
    return classnames({
      [styles.tagSystem]: type === 'system',
      [styles.tagNotice]: type === 'notice',
      [styles.tagWarning]: type === 'warning'
    })
  }

  if (!user) {
    return <ScrollView scrollY className={styles.page} />
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.header}>
        <View className={styles.topRow}>
          <View className={styles.greeting}>
            <View className={styles.avatar}>
              <Image className={styles.avatarImg} src={user.avatar} mode="aspectFill" />
            </View>
            <View className={styles.greetingText}>
              <Text className={styles.greetingHi}>你好，{user.name}</Text>
              <Text className={styles.roleTag}>{user.roleName} · {user.department}</Text>
            </View>
          </View>
          <View className={styles.headerRight}>
            <View
              className={styles.noticeIcon}
              onClick={() => Taro.switchTab({ url: '/pages/messages/index' })}
            >
              <Text>🔔</Text>
              {unreadCount > 0 && <View className={styles.badge}>{unreadCount}</View>}
            </View>
          </View>
        </View>
        <View className={styles.enterpriseCard}>
          <Text className={styles.enterpriseName}>🏢 {enterpriseName}</Text>
          <View className={styles.enterpriseInfo}>
            <Text>工号：{user.badgeNumber}</Text>
            <Text>门禁：{user.accessFloors.length}层权限</Text>
          </View>
        </View>
      </View>

      <View className={styles.mainContent}>
        <View className={styles.statsRow}>
          {stats.map((stat) => (
            <StatCard key={stat.label} data={stat} />
          ))}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>快捷入口</Text>
            <Text className={styles.sectionMore}>更多 ›</Text>
          </View>
          <View className={styles.quickEntries}>
            <View className={styles.entriesGrid}>
              {mockQuickEntries.map((item) => (
                <QuickEntry
                  key={item.id}
                  data={item}
                  iconChar={quickIconMap[item.id] || '功'}
                />
              ))}
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>园区通知</Text>
            <Text
              className={styles.sectionMore}
              onClick={() => Taro.switchTab({ url: '/pages/messages/index' })}
            >
              全部 ›
            </Text>
          </View>
          <View className={styles.noticeList}>
            {notices.length === 0 ? (
              <View className={styles.noticeCard}>
                <View className={styles.noticeContent}>
                  <Text className={styles.noticeTitle}>暂无通知</Text>
                </View>
              </View>
            ) : (
              notices.map((notice) => (
                <View
                  key={notice.id}
                  className={styles.noticeCard}
                  onClick={() => handleNoticeClick(notice)}
                >
                  <View className={classnames(styles.noticeTag, getTagClass(notice.type))}>
                    {notice.type === 'system' ? '系统' : notice.type === 'notice' ? '通知' : '预警'}
                  </View>
                  <View className={styles.noticeContent}>
                    <Text className={styles.noticeTitle}>{notice.title}</Text>
                    <Text className={styles.noticeText}>{notice.content}</Text>
                  </View>
                  <Text className={styles.noticeTime}>{notice.time}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default HomePage

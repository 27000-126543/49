import React, { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatCard from '@/components/StatCard'
import QuickEntry from '@/components/QuickEntry'
import { useUserStore } from '@/store/userStore'
import { mockStats, mockQuickEntries, mockNotices } from '@/data/mockIndex'
import type { NoticeItem } from '@/types'

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

const HomePage: React.FC = () => {
  const { user } = useUserStore()
  const [unreadCount] = useState(3)

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
          <Text className={styles.enterpriseName}>🏢 {user.enterpriseName}</Text>
          <View className={styles.enterpriseInfo}>
            <Text>工号：{user.badgeNumber}</Text>
            <Text>门禁：{user.accessFloors.length}层权限</Text>
          </View>
        </View>
      </View>

      <View className={styles.mainContent}>
        <View className={styles.statsRow}>
          {mockStats.map((stat) => (
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
            {mockNotices.map((notice) => (
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
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default HomePage

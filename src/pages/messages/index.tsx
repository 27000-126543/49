import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import MessageItemComp from '@/components/MessageItem'
import EmptyState from '@/components/EmptyState'
import { mockMessages } from '@/data/mockMessages'
import type { MessageItem } from '@/types'

const filters: { key: MessageItem['type'] | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'system', label: '系统' },
  { key: 'approval', label: '审批' },
  { key: 'booking', label: '预约' },
  { key: 'repair', label: '报修' },
  { key: 'notice', label: '通知' }
]

const MessagesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<MessageItem['type'] | 'all'>('all')

  const filteredMessages = useMemo(() => {
    if (activeFilter === 'all') return mockMessages
    return mockMessages.filter((m) => m.type === activeFilter)
  }, [activeFilter])

  const handleReadAll = () => {
    console.log('[Messages] 全部已读')
    Taro.showToast({ title: '已全部标记为已读', icon: 'success' })
  }

  return (
    <ScrollView scrollY>
      <View className={styles.page}>
        <View className={styles.header}>
          <Text className={styles.title}>消息中心</Text>
          <Text className={styles.readAll} onClick={handleReadAll}>全部已读</Text>
        </View>

        <ScrollView scrollX className={styles.filterRow}>
          {filters.map((f) => (
            <View
              key={f.key}
              className={classnames(styles.filterItem, activeFilter === f.key && styles.filterActive)}
              onClick={() => setActiveFilter(f.key)}
            >
              <Text>{f.label}</Text>
            </View>
          ))}
        </ScrollView>

        {filteredMessages.length > 0 ? (
          <View className={styles.list}>
            {filteredMessages.map((msg) => (
              <MessageItemComp key={msg.id} data={msg} />
            ))}
          </View>
        ) : (
          <EmptyState text="暂无消息" icon="💬" />
        )}
      </View>
    </ScrollView>
  )
}

export default MessagesPage

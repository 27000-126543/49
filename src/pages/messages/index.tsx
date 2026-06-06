import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { StorageService, type Message as StorageMessage } from '@/utils/storage'
import { useUserStore } from '@/store/userStore'
import EmptyState from '@/components/EmptyState'
import messageItemStyles from '@/components/MessageItem/index.module.scss'

const typeIconMap: Record<string, string> = {
  system: '系',
  approval: '审',
  booking: '约',
  repair: '修',
  notice: '通'
}

const typeLabelMap: Record<string, string> = {
  system: '系统',
  approval: '审批',
  booking: '预约',
  repair: '报修',
  notice: '通知'
}

const filters: { key: StorageMessage['type'] | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'system', label: '系统' },
  { key: 'approval', label: '审批' },
  { key: 'booking', label: '预约' },
  { key: 'repair', label: '报修' },
  { key: 'notice', label: '通知' }
]

interface MessageDisplay {
  id: string
  title: string
  content: string
  time: string
  type: StorageMessage['type']
  read: boolean
  avatar?: string
  createdAt: string
}

const formatTime = (isoStr: string): string => {
  const now = new Date()
  const date = new Date(isoStr)
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`

  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${month}月${day}日`
}

const MessagesPage: React.FC = () => {
  const { user, isLoggedIn } = useUserStore()
  const [activeFilter, setActiveFilter] = useState<StorageMessage['type'] | 'all'>('all')
  const [messages, setMessages] = useState<MessageDisplay[]>([])
  const [showDetail, setShowDetail] = useState(false)
  const [selectedMsg, setSelectedMsg] = useState<MessageDisplay | null>(null)

  const loadMessages = useCallback(() => {
    if (!user) return
    const storageMsgs = StorageService.getMessages(user.id)
    const displayMsgs: MessageDisplay[] = storageMsgs.map(msg => ({
      ...msg,
      time: formatTime(msg.createdAt)
    }))
    setMessages(displayMsgs)
  }, [user])

  useEffect(() => {
    if (!isLoggedIn || !user) {
      Taro.reLaunch({ url: '/pages/login/index' })
      return
    }
    loadMessages()
  }, [isLoggedIn, user, loadMessages])

  const filteredMessages = useMemo(() => {
    const filtered = activeFilter === 'all'
      ? messages
      : messages.filter(m => m.type === activeFilter)
    return [...filtered].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [activeFilter, messages])

  const handleReadAll = () => {
    if (!user) return
    StorageService.markAllMessagesRead(user.id)
    loadMessages()
    Taro.showToast({ title: '已全部标记为已读', icon: 'success' })
  }

  const handleMessageClick = (msg: MessageDisplay) => {
    StorageService.markMessageRead(msg.id)
    loadMessages()
    setSelectedMsg(msg)
    setShowDetail(true)
  }

  if (!user) {
    return <ScrollView scrollY className={styles.page} />
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
              <View
                key={msg.id}
                className={classnames(messageItemStyles.item, msg.read && messageItemStyles.read)}
                onClick={() => handleMessageClick(msg)}
              >
                <View className={messageItemStyles.avatar}>
                  {msg.avatar ? (
                    <Image className={messageItemStyles.avatarImg} src={msg.avatar} mode="aspectFill" />
                  ) : (
                    <Text className={messageItemStyles.avatarIcon}>{typeIconMap[msg.type] || '通'}</Text>
                  )}
                </View>
                <View className={messageItemStyles.content}>
                  <View className={messageItemStyles.header}>
                    <Text className={messageItemStyles.title}>{msg.title}</Text>
                    <Text className={messageItemStyles.time}>{msg.time}</Text>
                  </View>
                  <Text className={messageItemStyles.text}>{msg.content}</Text>
                </View>
                {!msg.read && <View className={messageItemStyles.unreadDot} />}
              </View>
            ))}
          </View>
        ) : (
          <EmptyState text="暂无消息" icon="💬" />
        )}

        {showDetail && selectedMsg && (
          <View className={styles.modalMask} onClick={() => setShowDetail(false)}>
            <View className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
              <View className={styles.detailHeader}>
                <View className={styles.detailTypeTag}>
                  <Text>{typeLabelMap[selectedMsg.type] || '通知'}</Text>
                </View>
                <Text className={styles.detailTime}>{selectedMsg.time}</Text>
              </View>
              <Text className={styles.detailTitle}>{selectedMsg.title}</Text>
              <View className={styles.detailContent}>
                <Text>{selectedMsg.content}</Text>
              </View>
              <View className={styles.modalBtnClose} onClick={() => setShowDetail(false)}>
                <Text>知道了</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default MessagesPage

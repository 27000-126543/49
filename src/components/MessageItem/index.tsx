import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'
import type { MessageItem } from '@/types'

const typeIconMap: Record<string, string> = {
  system: '系',
  approval: '审',
  booking: '约',
  repair: '修',
  notice: '通'
}

interface Props {
  data: MessageItem
}

const MessageItemComp: React.FC<Props> = ({ data }) => {
  return (
    <View className={classnames(styles.item, data.read && styles.read)}>
      <View className={styles.avatar}>
        {data.avatar ? (
          <Image className={styles.avatarImg} src={data.avatar} mode="aspectFill" />
        ) : (
          <Text className={styles.avatarIcon}>{typeIconMap[data.type] || '通'}</Text>
        )}
      </View>
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.title}>{data.title}</Text>
          <Text className={styles.time}>{data.time}</Text>
        </View>
        <Text className={styles.text}>{data.content}</Text>
      </View>
      {!data.read && <View className={styles.unreadDot} />}
    </View>
  )
}

export default MessageItemComp

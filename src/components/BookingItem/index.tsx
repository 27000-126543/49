import React from 'react'
import { View, Text, Button } from '@tarojs/components'
import styles from './index.module.scss'
import StatusTag from '@/components/StatusTag'
import type { BookingItem as BookingItemType } from '@/types'

interface BookingItemProps {
  data: BookingItemType
}

const typeIconMap: Record<string, { char: string; bg: string; color: string }> = {
  meeting: { char: '会', bg: 'rgba(114, 46, 209, 0.1)', color: '#722ED1' },
  desk: { char: '位', bg: 'rgba(19, 194, 194, 0.1)', color: '#13C2C2' },
  visitor: { char: '访', bg: 'rgba(250, 140, 22, 0.1)', color: '#FA8C16' }
}

const BookingItemComponent: React.FC<BookingItemProps> = ({ data }) => {
  const iconInfo = typeIconMap[data.type] || typeIconMap.meeting

  return (
    <View className={styles.item}>
      <View className={styles.header}>
        <View className={styles.titleRow}>
          <View
            className={styles.typeIcon}
            style={{ backgroundColor: iconInfo.bg, color: iconInfo.color }}
          >
            <Text>{iconInfo.char}</Text>
          </View>
          <Text className={styles.title}>{data.title}</Text>
        </View>
        <StatusTag status={data.status} text={data.statusText} />
      </View>
      <Text className={styles.subtitle}>{data.subtitle}</Text>
      <View className={styles.infoRow}>
        <Text className={styles.infoLabel}>时间：</Text>
        <Text className={styles.infoValue}>{data.time}</Text>
      </View>
      {data.location && (
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>地点：</Text>
          <Text className={styles.infoValue}>{data.location}</Text>
        </View>
      )}
      <View className={styles.footer}>
        <Text className={styles.timeText}>{data.time}</Text>
        <Button className={styles.actionBtn}>查看详情</Button>
      </View>
    </View>
  )
}

export default BookingItemComponent

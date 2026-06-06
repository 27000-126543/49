import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'
import type { StatItem } from '@/types'

interface StatCardProps {
  data: StatItem
}

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  const trendClass = classnames({
    [styles.trendUp]: data.trend === 'up',
    [styles.trendDown]: data.trend === 'down',
    [styles.trendNone]: data.trend === 'none' || !data.trend
  })

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.label}>{data.label}</Text>
        <View className={styles.dot} style={{ backgroundColor: data.color }} />
      </View>
      <View className={styles.valueRow}>
        <Text className={styles.value} style={{ color: data.color }}>{data.value}</Text>
        {data.unit && <Text className={styles.unit}>{data.unit}</Text>}
      </View>
      {data.trendValue && (
        <View className={styles.trendRow}>
          <Text className={trendClass}>
            {data.trend === 'up' ? '↑' : data.trend === 'down' ? '↓' : ''} {data.trendValue}
          </Text>
        </View>
      )}
    </View>
  )
}

export default StatCard

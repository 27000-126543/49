import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import type { QuickEntryItem } from '@/types'

interface QuickEntryProps {
  data: QuickEntryItem
  iconChar: string
}

const QuickEntry: React.FC<QuickEntryProps> = ({ data, iconChar }) => {
  const handleClick = () => {
    console.log('[QuickEntry] 点击:', data.name, '路径:', data.path)
    if (data.path) {
      Taro.navigateTo({ url: data.path }).catch((err) => {
        console.error('[QuickEntry] 跳转失败:', err)
        Taro.showToast({ title: '功能开发中', icon: 'none' })
      })
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' })
    }
  }

  return (
    <View className={styles.item} onClick={handleClick}>
      <View className={styles.iconBox} style={{ backgroundColor: data.iconBg }}>
        <Text className={styles.iconText} style={{ color: data.iconColor }}>{iconChar}</Text>
        {data.badge && <View className={styles.badge}>{data.badge}</View>}
      </View>
      <Text className={styles.name}>{data.name}</Text>
    </View>
  )
}

export default QuickEntry

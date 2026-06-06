import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import type { ServiceItem } from '@/types'

const TAB_BAR_PAGES = [
  '/pages/home/index',
  '/pages/services/index',
  '/pages/booking/index',
  '/pages/messages/index',
  '/pages/profile/index'
]

interface ServiceCardProps {
  data: ServiceItem
  iconChar: string
}

const ServiceCard: React.FC<ServiceCardProps> = ({ data, iconChar }) => {
  const handleClick = () => {
    if (!data.path) {
      Taro.showToast({ title: '功能开发中', icon: 'none' })
      return
    }
    if (TAB_BAR_PAGES.includes(data.path)) {
      Taro.switchTab({ url: data.path })
    } else {
      Taro.navigateTo({ url: data.path }).catch(() => {
        Taro.showToast({ title: '功能开发中', icon: 'none' })
      })
    }
  }

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.iconBox} style={{ backgroundColor: data.iconBg }}>
        <Text className={styles.iconText} style={{ color: data.iconColor }}>{iconChar}</Text>
      </View>
      <View className={styles.content}>
        <View className={styles.nameRow}>
          <Text className={styles.name}>{data.name}</Text>
          {data.badge && (
            <View className={styles.badge}>
              <Text className={styles.badgeText}>{data.badge}</Text>
            </View>
          )}
        </View>
        <Text className={styles.desc}>{data.desc}</Text>
      </View>
      <Text className={styles.arrow}>›</Text>
    </View>
  )
}

export default ServiceCard

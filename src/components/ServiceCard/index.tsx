import React from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import type { ServiceItem } from '@/types'

interface ServiceCardProps {
  data: ServiceItem
  iconChar: string
}

const ServiceCard: React.FC<ServiceCardProps> = ({ data, iconChar }) => {
  const handleClick = () => {
    console.log('[ServiceCard] 点击:', data.name, '路径:', data.path)
    if (data.path) {
      Taro.navigateTo({ url: data.path }).catch((err) => {
        console.error('[ServiceCard] 跳转失败:', err)
        Taro.showToast({ title: '功能开发中', icon: 'none' })
      })
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' })
    }
  }

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.iconBox} style={{ backgroundColor: data.iconBg }}>
        <Text className={styles.iconText} style={{ color: data.iconColor }}>{iconChar}</Text>
      </View>
      <View className={styles.content}>
        <Text className={styles.name}>{data.name}</Text>
        <Text className={styles.desc}>{data.desc}</Text>
      </View>
      {data.status === 'online' && (
        <View className={classnames(styles.status, styles.statusOnline)}>在线</View>
      )}
      <Text className={styles.arrow}>›</Text>
    </View>
  )
}

export default ServiceCard

import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import styles from './index.module.scss'
import ServiceCard from '@/components/ServiceCard'
import { mockServiceGroups } from '@/data/mockServices'

const serviceIconMap: Record<string, string> = {
  meeting: '会',
  desk: '位',
  visitor: '访',
  access: '门',
  canteen: '餐',
  repair: '修',
  parking: '停',
  courier: '递',
  enterprise: '企',
  energy: '能',
  admin: '管',
  report: '报'
}

const ServicesPage: React.FC = () => {
  return (
    <ScrollView scrollY>
      <View className={styles.page}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Text className={styles.searchPlaceholder}>搜索服务...</Text>
        </View>

        {mockServiceGroups.map((group) => (
          <View key={group.id} className={styles.group}>
            <Text className={styles.groupTitle}>{group.title}</Text>
            <View className={styles.groupList}>
              {group.items.map((item) => (
                <ServiceCard
                  key={item.id}
                  data={item}
                  iconChar={serviceIconMap[item.id] || '服'}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default ServicesPage

import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import styles from './index.module.scss'
import ServiceCard from '@/components/ServiceCard'
import { useUserStore } from '@/store/userStore'
import { StorageService } from '@/utils/storage'
import type { ServiceItem } from '@/types'

interface ServiceGroup {
  id: string
  title: string
  adminOnly?: boolean
  items: ServiceItem[]
}

const serviceIconMap: Record<string, string> = {
  meeting: '会',
  desk: '位',
  visitor: '访',
  access: '门',
  canteen: '餐',
  repair: '修',
  energy: '能',
  enterprise: '企',
  admin: '管'
}

const baseServiceGroups: ServiceGroup[] = [
  {
    id: 'work',
    title: '办公服务',
    items: [
      {
        id: 'meeting',
        name: '会议室预约',
        desc: '在线预约，智能分配',
        iconColor: '#722ED1',
        iconBg: 'rgba(114, 46, 209, 0.1)',
        path: '/pages/meeting-booking/index'
      },
      {
        id: 'desk',
        name: '共享工位',
        desc: '灵活办公，按时计费',
        iconColor: '#13C2C2',
        iconBg: 'rgba(19, 194, 194, 0.1)',
        path: '/pages/desk-booking/index'
      },
      {
        id: 'visitor',
        name: '访客预约',
        desc: '预约审批，二维码通行',
        iconColor: '#FA8C16',
        iconBg: 'rgba(250, 140, 22, 0.1)',
        path: '/pages/visitor-booking/index'
      },
      {
        id: 'access',
        name: '门禁权限',
        desc: '电子工牌，无感通行',
        iconColor: '#165DFF',
        iconBg: 'rgba(22, 93, 255, 0.1)',
        path: '/pages/enterprise/index'
      }
    ]
  },
  {
    id: 'life',
    title: '生活服务',
    items: [
      {
        id: 'canteen',
        name: '食堂订餐',
        desc: '提前预订，免排队取餐',
        iconColor: '#52C41A',
        iconBg: 'rgba(82, 196, 26, 0.1)',
        path: '/pages/canteen/index'
      },
      {
        id: 'repair',
        name: '物业报修',
        desc: '智能派单，实时跟进',
        iconColor: '#EB2F96',
        iconBg: 'rgba(235, 47, 150, 0.1)',
        path: '/pages/repair/index'
      },
      {
        id: 'energy',
        name: '能耗监控',
        desc: '用量统计，节能分析',
        iconColor: '#F5222D',
        iconBg: 'rgba(245, 34, 45, 0.1)',
        path: '/pages/energy/index'
      }
    ]
  },
  {
    id: 'manage',
    title: '管理服务',
    adminOnly: true,
    items: [
      {
        id: 'enterprise',
        name: '企业管理',
        desc: '员工管理，权限配置',
        iconColor: '#165DFF',
        iconBg: 'rgba(22, 93, 255, 0.1)',
        path: '/pages/enterprise/index'
      },
      {
        id: 'admin',
        name: '管理看板',
        desc: '数据大屏，运营分析',
        iconColor: '#0FC6C2',
        iconBg: 'rgba(15, 198, 194, 0.1)',
        path: '/pages/admin/index'
      }
    ]
  }
]

const ServicesPage: React.FC = () => {
  const { user, isLoggedIn, initFromStorage } = useUserStore()
  const [searchText, setSearchText] = useState('')
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([])

  const loadDynamicBadges = () => {
    const rooms = StorageService.getMeetingRooms()
    const availableRoomsCount = rooms.filter(r => r.status === 'available').length

    const meals = StorageService.getCanteenMeals()
    const availableMealsCount = meals.filter(m => m.available).length

    const repairOrders = StorageService.getRepairOrders()
    const pendingRepairCount = repairOrders.filter(
      o => o.status === 'pending' || o.status === 'assigned' || o.status === 'processing'
    ).length

    const groups: ServiceGroup[] = baseServiceGroups.map(group => ({
      ...group,
      items: group.items.map(item => {
        let badge: string | undefined
        if (item.id === 'meeting') {
          badge = `今日可预约 ${availableRoomsCount}`
        } else if (item.id === 'canteen') {
          badge = `今日热卖 ${availableMealsCount}`
        } else if (item.id === 'repair') {
          badge = `待处理 ${pendingRepairCount}`
        }
        return badge ? { ...item, badge } : item
      })
    }))

    setServiceGroups(groups)
  }

  useEffect(() => {
    initFromStorage()
  }, [])

  useEffect(() => {
    if (!isLoggedIn) {
      Taro.redirectTo({ url: '/pages/login/index' })
      return
    }
    loadDynamicBadges()
  }, [isLoggedIn])

  useDidShow(() => {
    if (isLoggedIn) {
      loadDynamicBadges()
    }
  })

  const filteredGroups = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()
    const visibleGroups = serviceGroups.filter(
      g => !g.adminOnly || user?.role === 'admin'
    )

    if (!keyword) return visibleGroups

    return visibleGroups
      .map(group => ({
        ...group,
        items: group.items.filter(item =>
          item.name.toLowerCase().includes(keyword)
        )
      }))
      .filter(group => group.items.length > 0)
  }, [serviceGroups, searchText, user])

  if (!isLoggedIn) {
    return null
  }

  return (
    <ScrollView scrollY>
      <View className={styles.page}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder='搜索服务...'
            placeholderClass={styles.searchPlaceholder}
            value={searchText}
            onInput={(e) => setSearchText(e.detail.value)}
            confirmType='search'
          />
        </View>

        {filteredGroups.length === 0 ? (
          <Text className={styles.emptyState}>未找到相关服务</Text>
        ) : (
          filteredGroups.map((group) => (
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
          ))
        )}
      </View>
    </ScrollView>
  )
}

export default ServicesPage

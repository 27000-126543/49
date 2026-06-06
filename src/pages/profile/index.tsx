import React from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { useUserStore } from '@/store/userStore'

const menus = [
  { id: 'enterprise', name: '企业管理', icon: '企', color: '#165DFF', bg: 'rgba(22, 93, 255, 0.1)', path: '/pages/enterprise/index' },
  { id: 'booking', name: '我的预约', icon: '约', color: '#722ED1', bg: 'rgba(114, 46, 209, 0.1)', path: '' },
  { id: 'order', name: '我的订单', icon: '订', color: '#52C41A', bg: 'rgba(82, 196, 26, 0.1)', path: '' },
  { id: 'repair', name: '我的报修', icon: '修', color: '#EB2F96', bg: 'rgba(235, 47, 150, 0.1)', path: '' },
  { id: 'evaluation', name: '我的评价', icon: '评', color: '#FA8C16', bg: 'rgba(250, 140, 22, 0.1)', path: '' },
  { id: 'settings', name: '系统设置', icon: '设', color: '#86909C', bg: 'rgba(134, 144, 156, 0.1)', path: '' }
]

const ProfilePage: React.FC = () => {
  const { user } = useUserStore()

  const handleMenuClick = (menu: typeof menus[0]) => {
    console.log('[Profile] 点击菜单:', menu.name)
    if (menu.path) {
      Taro.navigateTo({ url: menu.path }).catch((err) => {
        console.error('[Profile] 跳转失败:', err)
        Taro.showToast({ title: '功能开发中', icon: 'none' })
      })
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' })
    }
  }

  const handleShowBadge = () => {
    console.log('[Profile] 显示电子工牌')
    Taro.showToast({ title: '电子工牌已展开', icon: 'none' })
  }

  return (
    <ScrollView scrollY>
      <View className={styles.page}>
        <View className={styles.header}>
          <View className={styles.userRow}>
            <View className={styles.avatar}>
              <Image className={styles.avatarImg} src={user.avatar} mode="aspectFill" />
            </View>
            <View className={styles.userInfo}>
              <Text className={styles.userName}>{user.name}</Text>
              <View className={styles.userRole}>{user.roleName}</View>
              <Text className={styles.userDept}>{user.department} · {user.position}</Text>
            </View>
          </View>
        </View>

        <View className={styles.badgeCard} onClick={handleShowBadge}>
          <View className={styles.badgeHeader}>
            <Text className={styles.badgeTitle}>🎫 电子工牌</Text>
            <Text className={styles.badgeNumber}>工号 {user.badgeNumber}</Text>
          </View>
          <View className={styles.badgeMain}>
            <View className={styles.qrPlaceholder}>
              <Text className={styles.qrText}>📱</Text>
            </View>
            <View className={styles.badgeInfo}>
              <Text className={styles.badgeName}>{user.name}</Text>
              <Text className={styles.badgeDept}>{user.department} · {user.position}</Text>
              <Text className={styles.badgeEnt}>{user.enterpriseName}</Text>
            </View>
          </View>
          <View className={styles.badgeFooter}>
            <View className={styles.accessInfo}>
              <Text className={styles.accessLabel}>门禁权限：</Text>
              <Text className={styles.accessValue}>{user.accessFloors.length}层可通行</Text>
            </View>
            <Text className={styles.badgeAction}>展开 ›</Text>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>常用功能</Text>
          <View className={styles.menuList}>
            {menus.map((menu) => (
              <View
                key={menu.id}
                className={styles.menuItem}
                onClick={() => handleMenuClick(menu)}
              >
                <View className={styles.menuIcon} style={{ backgroundColor: menu.bg }}>
                  <Text style={{ color: menu.color }}>{menu.icon}</Text>
                </View>
                <View className={styles.menuContent}>
                  <Text className={styles.menuName}>{menu.name}</Text>
                </View>
                <Text className={styles.menuArrow}>›</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default ProfilePage

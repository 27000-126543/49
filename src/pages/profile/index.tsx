import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'
import { useUserStore } from '@/store/userStore'
import { StorageService } from '@/utils/storage'

const menus = [
  { id: 'booking', name: '我的预约', icon: '约', color: '#722ED1', bg: 'rgba(114, 46, 209, 0.1)', path: '' },
  { id: 'repair', name: '我的报修', icon: '修', color: '#EB2F96', bg: 'rgba(235, 47, 150, 0.1)', path: '' },
  { id: 'canteen', name: '我的订餐', icon: '餐', color: '#52C41A', bg: 'rgba(82, 196, 26, 0.1)', path: '' },
  { id: 'enterprise', name: '企业管理', icon: '企', color: '#165DFF', bg: 'rgba(22, 93, 255, 0.1)', path: '/pages/enterprise/index' },
  { id: 'password', name: '修改密码', icon: '密', color: '#FA8C16', bg: 'rgba(250, 140, 22, 0.1)', path: '' },
  { id: 'logout', name: '退出登录', icon: '退', color: '#F53F3F', bg: 'rgba(245, 63, 63, 0.1)', path: '' }
]

const ProfilePage: React.FC = () => {
  const { user, isLoggedIn, logout, updateCurrentUser } = useUserStore()
  const [badgeExpanded, setBadgeExpanded] = useState(false)
  const [showPwdModal, setShowPwdModal] = useState(false)
  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')

  useEffect(() => {
    if (!isLoggedIn || !user) {
      Taro.reLaunch({ url: '/pages/login/index' })
    }
  }, [isLoggedIn, user])

  const enterpriseName = useMemo(() => {
    if (!user) return ''
    const ents = StorageService.getEnterprises()
    const ent = ents.find((e) => e.id === user.enterpriseId)
    return ent?.name || ''
  }, [user])

  const qrContent = useMemo(() => {
    if (!user) return ''
    return JSON.stringify({
      name: user.name,
      badgeNumber: user.badgeNumber,
      phone: user.phone,
      accessFloors: user.accessFloors
    })
  }, [user])

  const handleMenuClick = (menu: typeof menus[0]) => {
    console.log('[Profile] 点击菜单:', menu.name)
    if (menu.id === 'logout') {
      Taro.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            logout()
            Taro.reLaunch({ url: '/pages/login/index' })
          }
        }
      })
      return
    }
    if (menu.id === 'password') {
      setOldPwd('')
      setNewPwd('')
      setConfirmPwd('')
      setShowPwdModal(true)
      return
    }
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
    setBadgeExpanded(!badgeExpanded)
  }

  const handleChangePwd = () => {
    if (!user) return
    if (!oldPwd || !newPwd || !confirmPwd) {
      Taro.showToast({ title: '请填写完整', icon: 'none' })
      return
    }
    if (oldPwd !== user.password) {
      Taro.showToast({ title: '原密码错误', icon: 'none' })
      return
    }
    if (newPwd.length < 6) {
      Taro.showToast({ title: '新密码至少6位', icon: 'none' })
      return
    }
    if (newPwd !== confirmPwd) {
      Taro.showToast({ title: '两次密码不一致', icon: 'none' })
      return
    }
    updateCurrentUser({ password: newPwd })
    Taro.showToast({ title: '修改成功', icon: 'success' })
    setShowPwdModal(false)
  }

  if (!user) {
    return <ScrollView scrollY className={styles.page} />
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
              <Text className={styles.badgeEnt}>{enterpriseName}</Text>
            </View>
          </View>
          <View className={styles.badgeFooter}>
            <View className={styles.accessInfo}>
              <Text className={styles.accessLabel}>门禁权限：</Text>
              <Text className={styles.accessValue}>{user.accessFloors.length}层可通行</Text>
            </View>
            <Text className={styles.badgeAction}>{badgeExpanded ? '收起 ∧' : '展开 ›'}</Text>
          </View>

          {badgeExpanded && (
            <View className={styles.badgeExpanded}>
              <View className={styles.qrBigBox}>
                <Text className={styles.qrBigText}>QR</Text>
              </View>
              <Text className={styles.qrContentText}>{qrContent}</Text>
            </View>
          )}
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

        {showPwdModal && (
          <View className={styles.modalMask} onClick={() => setShowPwdModal(false)}>
            <View className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
              <Text className={styles.modalTitle}>修改密码</Text>
              <View className={styles.modalInputRow}>
                <Text className={styles.modalInputLabel}>原密码</Text>
                <Input
                  className={styles.modalInput}
                  type="password"
                  placeholder="请输入原密码"
                  value={oldPwd}
                  onInput={(e) => setOldPwd(e.detail.value)}
                />
              </View>
              <View className={styles.modalInputRow}>
                <Text className={styles.modalInputLabel}>新密码</Text>
                <Input
                  className={styles.modalInput}
                  type="password"
                  placeholder="请输入新密码(至少6位)"
                  value={newPwd}
                  onInput={(e) => setNewPwd(e.detail.value)}
                />
              </View>
              <View className={styles.modalInputRow}>
                <Text className={styles.modalInputLabel}>确认新密码</Text>
                <Input
                  className={styles.modalInput}
                  type="password"
                  placeholder="请再次输入新密码"
                  value={confirmPwd}
                  onInput={(e) => setConfirmPwd(e.detail.value)}
                />
              </View>
              <View className={styles.modalActions}>
                <View className={`${styles.modalBtn} ${styles.modalBtnCancel}`} onClick={() => setShowPwdModal(false)}>
                  <Text>取消</Text>
                </View>
                <View className={`${styles.modalBtn} ${styles.modalBtnConfirm}`} onClick={handleChangePwd}>
                  <Text>确认</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default ProfilePage

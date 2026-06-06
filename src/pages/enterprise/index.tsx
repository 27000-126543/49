import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, ScrollView, Button, Image, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { StorageService, type User, type UserRole } from '@/utils/storage'
import { useUserStore } from '@/store/userStore'

const allFloors = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]
const roleColors: Record<string, { color: string; bg: string }> = {
  executive: { color: '#FF7D00', bg: 'rgba(255, 125, 0, 0.1)' },
  finance: { color: '#722ED1', bg: 'rgba(114, 46, 209, 0.1)' },
  employee: { color: '#165DFF', bg: 'rgba(22, 93, 255, 0.1)' },
  admin: { color: '#F53F3F', bg: 'rgba(245, 63, 63, 0.1)' }
}

const inviteRoleOptions: { key: UserRole; label: string }[] = [
  { key: 'employee', label: '普通员工' },
  { key: 'finance', label: '财务' },
  { key: 'executive', label: '高管' }
]

const EnterprisePage: React.FC = () => {
  const { user, isLoggedIn, inviteEmployee, updateCurrentUser } = useUserStore()
  const [tab, setTab] = useState<'employees' | 'floors'>('employees')
  const [selectedFloors, setSelectedFloors] = useState<number[]>([])
  const [employees, setEmployees] = useState<User[]>([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    name: '',
    phone: '',
    department: '',
    position: '',
    role: 'employee' as UserRole,
    accessFloors: [] as number[]
  })

  useEffect(() => {
    if (!isLoggedIn || !user) {
      Taro.reLaunch({ url: '/pages/login/index' })
      return
    }
    setSelectedFloors(user.accessFloors)
    refreshEmployees()
  }, [isLoggedIn, user])

  const refreshEmployees = () => {
    if (!user) return
    const allUsers = StorageService.getUsers()
    const sameEnterpriseUsers = allUsers.filter(u => u.enterpriseId === user.enterpriseId)
    setEmployees(sameEnterpriseUsers)
  }

  const enterpriseName = useMemo(() => {
    if (!user) return ''
    const ents = StorageService.getEnterprises()
    const ent = ents.find(e => e.id === user.enterpriseId)
    return ent?.name || ''
  }, [user])

  const execCount = employees.filter(e => e.role === 'executive').length
  const financeCount = employees.filter(e => e.role === 'finance').length
  const empCount = employees.filter(e => e.role === 'employee').length

  const toggleFloor = (floor: number) => {
    setSelectedFloors(prev =>
      prev.includes(floor) ? prev.filter(f => f !== floor) : [...prev, floor]
    )
  }

  const toggleInviteFloor = (floor: number) => {
    setInviteForm(prev => ({
      ...prev,
      accessFloors: prev.accessFloors.includes(floor)
        ? prev.accessFloors.filter(f => f !== floor)
        : [...prev.accessFloors, floor]
    }))
  }

  const handleSaveFloors = () => {
    updateCurrentUser({ accessFloors: selectedFloors })
    Taro.showToast({ title: '权限已更新', icon: 'success' })
  }

  const openInviteModal = () => {
    setInviteForm({
      name: '',
      phone: '',
      department: '',
      position: '',
      role: 'employee',
      accessFloors: []
    })
    setShowInviteModal(true)
  }

  const handleSubmitInvite = async () => {
    if (!inviteForm.name.trim()) {
      Taro.showToast({ title: '请输入姓名', icon: 'none' })
      return
    }
    if (!inviteForm.phone.trim()) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    if (!inviteForm.department.trim()) {
      Taro.showToast({ title: '请输入部门', icon: 'none' })
      return
    }
    if (!inviteForm.position.trim()) {
      Taro.showToast({ title: '请输入职位', icon: 'none' })
      return
    }
    if (inviteForm.accessFloors.length === 0) {
      Taro.showToast({ title: '请选择门禁楼层', icon: 'none' })
      return
    }

    const success = await inviteEmployee({
      name: inviteForm.name,
      phone: inviteForm.phone,
      department: inviteForm.department,
      position: inviteForm.position,
      role: inviteForm.role,
      accessFloors: inviteForm.accessFloors
    })

    if (success) {
      setShowInviteModal(false)
      refreshEmployees()
    }
  }

  if (!user) {
    return <ScrollView scrollY className={styles.page} />
  }

  return (
    <ScrollView scrollY>
      <View className={styles.page}>
        <View className={styles.entCard}>
          <Text className={styles.entName}>🏢 {enterpriseName}</Text>
          <View className={styles.entInfo}>
            <Text>员工总数：{employees.length}人</Text>
            <Text>门禁楼层：{user.accessFloors.length}层</Text>
          </View>
        </View>

        <View className={styles.tabs}>
          <View className={classnames(styles.tab, tab === 'employees' && styles.tabActive)} onClick={() => setTab('employees')}>
            <Text>员工管理</Text>
          </View>
          <View className={classnames(styles.tab, tab === 'floors' && styles.tabActive)} onClick={() => setTab('floors')}>
            <Text>门禁权限</Text>
          </View>
        </View>

        {tab === 'employees' ? (
          <View>
            <View className={styles.summaryRow}>
              <View className={styles.sumCard}>
                <Text className={styles.sumNum}>{execCount}</Text>
                <Text className={styles.sumLabel}>高管</Text>
              </View>
              <View className={styles.sumCard}>
                <Text className={styles.sumNum}>{financeCount}</Text>
                <Text className={styles.sumLabel}>财务</Text>
              </View>
              <View className={styles.sumCard}>
                <Text className={styles.sumNum}>{empCount}</Text>
                <Text className={styles.sumLabel}>员工</Text>
              </View>
            </View>

            {employees.map(e => (
              <View key={e.id} className={styles.empCard}>
                <View className={styles.avatar}>
                  <Image className={styles.avatarImg} src={e.avatar} mode="aspectFill" />
                </View>
                <View className={styles.empBody}>
                  <Text className={styles.empName}>{e.name}</Text>
                  <Text className={styles.empPos}>{e.department} · {e.position}</Text>
                  <Text className={styles.empFloors}>门禁：{e.accessFloors.map(f => f + '层').join('、')}</Text>
                </View>
                <View className={styles.roleTag} style={{ color: roleColors[e.role]?.color || '#165DFF', backgroundColor: roleColors[e.role]?.bg || 'rgba(22, 93, 255, 0.1)' }}>
                  <Text>{e.roleName}</Text>
                </View>
              </View>
            ))}

            <Button className={styles.addBtn} onClick={openInviteModal}>+ 邀请员工</Button>
          </View>
        ) : (
          <View>
            <View className={styles.floorConfig}>
              <Text className={styles.floorTitle}>选择可通行楼层（当前：{user.name}）</Text>
              <View className={styles.floorGrid}>
                {allFloors.map(f => (
                  <View key={f}
                    className={classnames(styles.floorItem, selectedFloors.includes(f) && styles.floorActive)}
                    onClick={() => toggleFloor(f)}
                  >
                    <Text>{f}F</Text>
                  </View>
                ))}
              </View>
            </View>
            <Button className={styles.addBtn} onClick={handleSaveFloors}>保存门禁配置</Button>
          </View>
        )}

        {showInviteModal && (
          <View className={styles.modalMask} onClick={() => setShowInviteModal(false)}>
            <View className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
              <Text className={styles.modalTitle}>邀请员工</Text>

              <View className={styles.modalInputRow}>
                <Text className={styles.modalInputLabel}>姓名</Text>
                <Input
                  className={styles.modalInput}
                  placeholder="请输入员工姓名"
                  value={inviteForm.name}
                  onInput={(e) => setInviteForm(prev => ({ ...prev, name: e.detail.value }))}
                />
              </View>

              <View className={styles.modalInputRow}>
                <Text className={styles.modalInputLabel}>手机号</Text>
                <Input
                  className={styles.modalInput}
                  type="number"
                  placeholder="请输入手机号"
                  value={inviteForm.phone}
                  onInput={(e) => setInviteForm(prev => ({ ...prev, phone: e.detail.value }))}
                />
              </View>

              <View className={styles.modalInputRow}>
                <Text className={styles.modalInputLabel}>部门</Text>
                <Input
                  className={styles.modalInput}
                  placeholder="请输入部门"
                  value={inviteForm.department}
                  onInput={(e) => setInviteForm(prev => ({ ...prev, department: e.detail.value }))}
                />
              </View>

              <View className={styles.modalInputRow}>
                <Text className={styles.modalInputLabel}>职位</Text>
                <Input
                  className={styles.modalInput}
                  placeholder="请输入职位"
                  value={inviteForm.position}
                  onInput={(e) => setInviteForm(prev => ({ ...prev, position: e.detail.value }))}
                />
              </View>

              <View className={styles.modalInputRow}>
                <Text className={styles.modalInputLabel}>角色</Text>
                <View className={styles.roleOptions}>
                  {inviteRoleOptions.map(opt => (
                    <View
                      key={opt.key}
                      className={classnames(styles.roleOption, inviteForm.role === opt.key && styles.roleOptionActive)}
                      onClick={() => setInviteForm(prev => ({ ...prev, role: opt.key }))}
                    >
                      <Text>{opt.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.modalInputRow}>
                <Text className={styles.modalInputLabel}>门禁楼层（多选）</Text>
                <View className={styles.floorSelectGrid}>
                  {allFloors.map(f => (
                    <View
                      key={f}
                      className={classnames(styles.floorSelectItem, inviteForm.accessFloors.includes(f) && styles.floorSelectActive)}
                      onClick={() => toggleInviteFloor(f)}
                    >
                      <Text>{f}F</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.modalActions}>
                <View className={classnames(styles.modalBtn, styles.modalBtnCancel)} onClick={() => setShowInviteModal(false)}>
                  <Text>取消</Text>
                </View>
                <View className={classnames(styles.modalBtn, styles.modalBtnConfirm)} onClick={handleSubmitInvite}>
                  <Text>确认邀请</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default EnterprisePage

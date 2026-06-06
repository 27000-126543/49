import React, { useState } from 'react'
import { View, Text, ScrollView, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { mockEmployees, mockUser } from '@/data/mockUser'

const allFloors = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]
const roleColors: Record<string, { color: string; bg: string }> = {
  executive: { color: '#FF7D00', bg: 'rgba(255, 125, 0, 0.1)' },
  finance: { color: '#722ED1', bg: 'rgba(114, 46, 209, 0.1)' },
  employee: { color: '#165DFF', bg: 'rgba(22, 93, 255, 0.1)' },
  admin: { color: '#F53F3F', bg: 'rgba(245, 63, 63, 0.1)' }
}

const EnterprisePage: React.FC = () => {
  const [tab, setTab] = useState<'employees' | 'floors'>('employees')
  const [selectedFloors, setSelectedFloors] = useState<number[]>(mockUser.accessFloors)

  const toggleFloor = (floor: number) => {
    setSelectedFloors(prev => prev.includes(floor) ? prev.filter(f => f !== floor) : [...prev, floor])
  }

  const handleAddEmp = () => {
    console.log('[Enterprise] 添加员工')
    Taro.showToast({ title: '邀请链接已生成', icon: 'success' })
  }

  const handleSaveFloors = () => {
    console.log('[Enterprise] 保存门禁权限:', selectedFloors)
    Taro.showToast({ title: '权限已更新', icon: 'success' })
  }

  const execCount = mockEmployees.filter(e => e.role === 'executive').length
  const financeCount = mockEmployees.filter(e => e.role === 'finance').length
  const empCount = mockEmployees.filter(e => e.role === 'employee').length

  return (
    <ScrollView scrollY>
      <View className={styles.page}>
        <View className={styles.entCard}>
          <Text className={styles.entName}>🏢 {mockUser.enterpriseName}</Text>
          <View className={styles.entInfo}>
            <Text>员工总数：{mockEmployees.length}人</Text>
            <Text>门禁楼层：{mockUser.accessFloors.length}层</Text>
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

            {mockEmployees.map(e => (
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

            <Button className={styles.addBtn} onClick={handleAddEmp}>+ 邀请员工</Button>
          </View>
        ) : (
          <View>
            <View className={styles.floorConfig}>
              <Text className={styles.floorTitle}>选择可通行楼层（当前：{mockUser.name}）</Text>
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
      </View>
    </ScrollView>
  )
}
export default EnterprisePage

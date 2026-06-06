import React, { useState, useMemo, useEffect } from 'react'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { StorageService } from '@/utils/storage'
import { formatMoney } from '@/utils'

const timeFilters = ['今日', '本周', '本月', '本季度']
const rankColors = ['#F53F3F', '#FF7D00', '#165DFF', '#13C2C2', '#86909C']

const TOTAL_MEETING_ROOMS = 6
const TOTAL_SLOTS_PER_DAY = 24

const AdminPage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('本月')

  const user = StorageService.getCurrentUser()
  const enterprises = StorageService.getEnterprises()
  const meetingBookings = StorageService.getMeetingBookings()
  const repairOrders = StorageService.getRepairOrders()
  const canteenOrders = StorageService.getCanteenOrders()
  const energyData = StorageService.getEnergyData()

  useEffect(() => {
    if (!user) {
      Taro.redirectTo({ url: '/pages/login/index' })
    }
  }, [user])

  const todayStr = new Date().toISOString().split('T')[0]

  const occupancyRate = useMemo(() => {
    return Math.min(100, enterprises.length * 20)
  }, [enterprises.length])

  const meetingUtilization = useMemo(() => {
    const todayBookings = meetingBookings.filter(
      (b) => b.date === todayStr && b.status !== 'cancelled'
    )
    const bookedSlots = todayBookings.reduce((count, b) => {
      const startH = parseInt(b.startTime.split(':')[0], 10)
      const endH = parseInt(b.endTime.split(':')[0], 10)
      const startM = parseInt(b.startTime.split(':')[1], 10)
      const endM = parseInt(b.endTime.split(':')[1], 10)
      const hours = endH - startH + (endM - startM) / 60
      return count + Math.ceil(hours * 2)
    }, 0)
    const totalSlots = TOTAL_MEETING_ROOMS * TOTAL_SLOTS_PER_DAY
    return Math.round((bookedSlots / totalSlots) * 100)
  }, [meetingBookings, todayStr])

  const repairAvgTime = useMemo(() => {
    const completedOrders = repairOrders.filter((o) => o.status === 'completed' || o.status === 'evaluated')
    if (completedOrders.length === 0) return '0分钟'
    const totalMinutes = completedOrders.reduce((sum) => {
      return sum + Math.floor(30 + Math.random() * 90)
    }, 0)
    const avg = Math.round(totalMinutes / completedOrders.length)
    return `${avg}分钟`
  }, [repairOrders])

  const canteenPeak = useMemo(() => {
    return canteenOrders.length * 3
  }, [canteenOrders.length])

  const meetingPrediction = useMemo(() => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    const todayIdx = new Date().getDay()
    const adjustedTodayIdx = todayIdx === 0 ? 6 : todayIdx - 1
    return days.map((day, idx) => {
      const baseRate = 40 + Math.random() * 40
      const dayOffset = Math.abs(idx - adjustedTodayIdx) * 3
      let rate = Math.round(baseRate + (idx < adjustedTodayIdx ? -5 : 5) - dayOffset)
      rate = Math.max(15, Math.min(98, rate))
      return { time: day, rate }
    })
  }, [])

  const topEnergy = useMemo(() => {
    const agg: Record<string, number> = {}
    energyData.forEach((d) => {
      const key = d.enterpriseId || '园区公共'
      agg[key] = (agg[key] || 0) + d.electricity
    })
    const defaultFloors = [
      { name: '博远科技 8层', base: 180 },
      { name: '智云科技 11层', base: 160 },
      { name: '创新互联 5层', base: 145 },
      { name: '智云科技 12层', base: 135 },
      { name: '创新互联 10层', base: 120 },
      { name: '启明星 7层', base: 110 }
    ]
    const list = defaultFloors.map((f, i) => ({
      name: f.name,
      value: Math.min(99, Math.max(50, Math.round(f.base + (Object.values(agg)[i] || 0) * 0.1 + Math.random() * 20)))
    }))
    list.sort((a, b) => b.value - a.value)
    return list.slice(0, 5)
  }, [energyData])

  const monthlyReport = useMemo(() => {
    const totalRent = enterprises.length * 50000
    const totalElectricityKWh = energyData.reduce((sum, d) => sum + d.electricity, 0) * 4
    const totalElectricity = totalElectricityKWh * 1.5
    const totalRepairCost = repairOrders.length * 200
    const canteenRevenue = canteenOrders.reduce((sum, o) => sum + o.totalPrice, 0)
    return {
      totalRent,
      totalElectricity,
      totalRepairCost,
      canteenRevenue
    }
  }, [enterprises, energyData, repairOrders, canteenOrders])

  const handleExport = () => {
    console.log('[Admin] 导出月度报表')
    Taro.showLoading({ title: '生成中...' })
    setTimeout(() => {
      Taro.hideLoading()
      Taro.showToast({ title: '报表已生成并下载', icon: 'success' })
    }, 1500)
  }

  if (!user) return null

  return (
    <ScrollView scrollY>
      <View className={styles.page}>
        <View className={styles.filterBar}>
          {timeFilters.map((f) => (
            <View
              key={f}
              className={classnames(styles.filterTag, timeFilter === f && styles.filterActive)}
              onClick={() => setTimeFilter(f)}
            >
              <Text>{f}</Text>
            </View>
          ))}
        </View>

        <View className={styles.statsGrid}>
          <View className={styles.statCard}>
            <Text className={styles.statIcon}>🏢</Text>
            <Text className={styles.statLabel}>园区入驻率</Text>
            <Text className={styles.statValue}>
              {occupancyRate}
              <Text className={styles.statUnit}>%</Text>
            </Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statIcon}>📊</Text>
            <Text className={styles.statLabel}>会议室利用率</Text>
            <Text className={styles.statValue}>
              {meetingUtilization}
              <Text className={styles.statUnit}>%</Text>
            </Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statIcon}>🔧</Text>
            <Text className={styles.statLabel}>报修平均时效</Text>
            <Text className={styles.statValue}>{repairAvgTime}</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statIcon}>🍽️</Text>
            <Text className={styles.statLabel}>食堂人流峰值</Text>
            <Text className={styles.statValue}>
              {canteenPeak}
              <Text className={styles.statUnit}>人</Text>
            </Text>
          </View>
        </View>

        <View className={styles.card}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>📈 未来一周会议室需求预测</Text>
            <Text
              className={styles.cardAction}
              onClick={() => Taro.showToast({ title: '建议开放85%会议室', icon: 'none' })}
            >
              智能建议 ›
            </Text>
          </View>
          <View className={styles.chart}>
            {meetingPrediction.map((m) => (
              <View key={m.time} className={styles.chartBarWrap}>
                <Text className={styles.chartValue}>{m.rate}%</Text>
                <View
                  className={styles.chartBar}
                  style={{
                    height: `${(m.rate / 100) * 180}rpx`,
                    background:
                      m.rate >= 90
                        ? 'linear-gradient(180deg, #F53F3F, #FF7D00)'
                        : m.rate >= 70
                        ? 'linear-gradient(180deg, #FF7D00, #FAAD14)'
                        : 'linear-gradient(180deg, #165DFF, #4080FF)'
                  }}
                />
                <Text className={styles.chartLabel}>{m.time}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.card}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>🏆 能耗排名 TOP5</Text>
          </View>
          <View className={styles.rankList}>
            {topEnergy.map((item, i) => (
              <View key={item.name} className={styles.rankItem}>
                <View className={styles.rankNum} style={{ backgroundColor: rankColors[i] }}>
                  <Text>{i + 1}</Text>
                </View>
                <Text className={styles.rankName}>{item.name}</Text>
                <View className={styles.rankBar}>
                  <View className={styles.rankFill} style={{ width: `${item.value}%` }} />
                </View>
                <Text className={styles.rankValue}>{item.value}%</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.reportCard}>
          <Text className={styles.reportTitle}>📋 月度运营报表</Text>
          <View className={styles.reportGrid}>
            <View className={styles.reportItem}>
              <Text className={styles.reportLabel}>租金收入</Text>
              <Text className={styles.reportVal}>{formatMoney(monthlyReport.totalRent)}</Text>
            </View>
            <View className={styles.reportItem}>
              <Text className={styles.reportLabel}>电费收入</Text>
              <Text className={styles.reportVal}>{formatMoney(monthlyReport.totalElectricity)}</Text>
            </View>
            <View className={styles.reportItem}>
              <Text className={styles.reportLabel}>报修成本</Text>
              <Text className={styles.reportVal}>{formatMoney(monthlyReport.totalRepairCost)}</Text>
            </View>
            <View className={styles.reportItem}>
              <Text className={styles.reportLabel}>食堂营收</Text>
              <Text className={styles.reportVal}>{formatMoney(monthlyReport.canteenRevenue)}</Text>
            </View>
          </View>
          <Button className={styles.exportBtn} onClick={handleExport}>
            📤 导出完整报表
          </Button>
        </View>
      </View>
    </ScrollView>
  )
}

export default AdminPage

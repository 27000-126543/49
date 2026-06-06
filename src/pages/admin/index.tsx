import React, { useState } from 'react'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { mockAdminDashboard } from '@/data/mockEnergy'
import { formatMoney } from '@/utils'

const timeFilters = ['今日', '本周', '本月', '本季度']
const rankColors = ['#F53F3F', '#FF7D00', '#165DFF', '#13C2C2', '#86909C']

const AdminPage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('本月')
  const d = mockAdminDashboard

  const handleExport = () => {
    console.log('[Admin] 导出月度报表')
    Taro.showLoading({ title: '生成中...' })
    setTimeout(() => { Taro.hideLoading(); Taro.showToast({ title: '报表已导出', icon: 'success' }) }, 1500)
  }

  return (
    <ScrollView scrollY>
      <View className={styles.page}>
        <View className={styles.filterBar}>
          {timeFilters.map(f => (
            <View key={f} className={classnames(styles.filterTag, timeFilter === f && styles.filterActive)} onClick={() => setTimeFilter(f)}>
              <Text>{f}</Text>
            </View>
          ))}
        </View>

        <View className={styles.statsGrid}>
          <View className={styles.statCard}>
            <Text className={styles.statIcon}>🏢</Text>
            <Text className={styles.statLabel}>园区入驻率</Text>
            <Text className={styles.statValue}>{d.occupancyRate}<Text className={styles.statUnit}>%</Text></Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statIcon}>📊</Text>
            <Text className={styles.statLabel}>会议室利用率</Text>
            <Text className={styles.statValue}>{d.meetingUtilization}<Text className={styles.statUnit}>%</Text></Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statIcon}>🔧</Text>
            <Text className={styles.statLabel}>报修平均时效</Text>
            <Text className={styles.statValue}>{d.repairAvgTime}</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statIcon}>🍽️</Text>
            <Text className={styles.statLabel}>食堂人流峰值</Text>
            <Text className={styles.statValue}>{d.canteenPeak}<Text className={styles.statUnit}>人</Text></Text>
          </View>
        </View>

        <View className={styles.card}>
          <View className={styles.cardHeader}>
            <Text className={styles.cardTitle}>📈 未来一周会议室需求预测</Text>
            <Text className={styles.cardAction} onClick={() => Taro.showToast({ title: '建议开放85%会议室', icon: 'none' })}>智能建议 ›</Text>
          </View>
          <View className={styles.chart}>
            {d.meetingPrediction.map((m) => (
              <View key={m.time} className={styles.chartBarWrap}>
                <Text className={styles.chartValue}>{m.rate}%</Text>
                <View className={styles.chartBar}
                  style={{
                    height: `${(m.rate / 100) * 180}rpx`,
                    background: m.rate >= 90 ? 'linear-gradient(180deg, #F53F3F, #FF7D00)'
                      : m.rate >= 70 ? 'linear-gradient(180deg, #FF7D00, #FAAD14)'
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
            {d.topEnergy.map((item, i) => (
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
              <Text className={styles.reportVal}>{formatMoney(d.monthlyReport.totalRent)}</Text>
            </View>
            <View className={styles.reportItem}>
              <Text className={styles.reportLabel}>电费收入</Text>
              <Text className={styles.reportVal}>{formatMoney(d.monthlyReport.totalElectricity)}</Text>
            </View>
            <View className={styles.reportItem}>
              <Text className={styles.reportLabel}>报修成本</Text>
              <Text className={styles.reportVal}>{formatMoney(d.monthlyReport.totalRepairCost)}</Text>
            </View>
            <View className={styles.reportItem}>
              <Text className={styles.reportLabel}>食堂营收</Text>
              <Text className={styles.reportVal}>{formatMoney(d.monthlyReport.canteenRevenue)}</Text>
            </View>
          </View>
          <Button className={styles.exportBtn} onClick={handleExport}>📤 导出完整报表</Button>
        </View>
      </View>
    </ScrollView>
  )
}
export default AdminPage

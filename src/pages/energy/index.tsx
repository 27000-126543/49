import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import styles from './index.module.scss'
import { mockEnergyData, mockFloorEnergy } from '@/data/mockEnergy'
import { getStatusColor, getStatusBgColor } from '@/utils'

const totalElec = mockEnergyData.reduce((s, d) => s + d.electricity, 0)
const totalWater = mockEnergyData.reduce((s, d) => s + d.water, 0)
const maxElec = Math.max(...mockEnergyData.map(d => d.electricity))
const maxWater = Math.max(...mockEnergyData.map(d => d.water))

const EnergyPage: React.FC = () => {
  return (
    <ScrollView scrollY>
      <View className={styles.page}>
        <View className={styles.summaryRow}>
          <View className={styles.summaryCard}>
            <Text className={styles.summaryLabel}>⚡ 本月用电</Text>
            <View style={{ display: 'flex', alignItems: 'baseline' }}>
              <Text className={styles.summaryValue}>{(totalElec / 100).toFixed(1)}</Text>
              <Text className={styles.summaryUnit}>万度</Text>
            </View>
            <Text className={styles.summaryTrend} style={{ color: '#F53F3F' }}>↑ 同比 +5.2%</Text>
          </View>
          <View className={styles.summaryCard}>
            <Text className={styles.summaryLabel}>💧 本月用水</Text>
            <View style={{ display: 'flex', alignItems: 'baseline' }}>
              <Text className={styles.summaryValue}>{(totalWater / 10).toFixed(1)}</Text>
              <Text className={styles.summaryUnit}>百吨</Text>
            </View>
            <Text className={styles.summaryTrend} style={{ color: '#00B42A' }}>↓ 同比 -3.1%</Text>
          </View>
        </View>

        <View className={styles.chartCard}>
          <Text className={styles.chartTitle}>近6日能耗趋势</Text>
          <View className={styles.chartRow}>
            {mockEnergyData.map(d => (
              <View key={d.date} className={styles.chartBar}>
                <View style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'flex-end', width: '100%' }}>
                  <View className={`${styles.barFill} ${styles.barElec}`} style={{ height: `${(d.electricity / maxElec) * 200}rpx`, flex: 1 }} />
                  <View className={`${styles.barFill} ${styles.barWater}`} style={{ height: `${(d.water / maxWater) * 200}rpx`, flex: 1 }} />
                </View>
                <Text className={styles.barLabel}>{d.date}</Text>
              </View>
            ))}
          </View>
          <View className={styles.legend}>
            <View className={styles.legendItem}>
              <View className={styles.legendDot} style={{ backgroundColor: '#165DFF' }} />
              <Text>用电（度）</Text>
            </View>
            <View className={styles.legendItem}>
              <View className={styles.legendDot} style={{ backgroundColor: '#0FC6C2' }} />
              <Text>用水（吨）</Text>
            </View>
          </View>
        </View>

        <View className={styles.floorList}>
          <Text className={styles.floorTitle}>各楼层能耗排名</Text>
          {mockFloorEnergy.map(f => (
            <View key={f.floor} className={styles.floorItem}>
              <View className={styles.floorRow}>
                <View>
                  <Text className={styles.floorName}>{f.floor}</Text>
                  <Text className={styles.floorEnt}>  {f.enterprise}</Text>
                </View>
                <View className={styles.warnTag} style={{ color: getStatusColor(f.status), backgroundColor: getStatusBgColor(f.status) }}>
                  <Text>{f.status === 'normal' ? '正常' : f.status === 'warning' ? '预警' : '超限'}</Text>
                </View>
              </View>
              <View className={styles.floorData}>
                <Text>⚡ {f.electricity}度</Text>
                <Text>💧 {f.water}吨</Text>
              </View>
              <View className={styles.progressBar}>
                <View className={styles.progressFill} style={{ width: `${f.percent}%`, backgroundColor: getStatusColor(f.status) }} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}
export default EnergyPage

import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import classnames from 'classnames'
import styles from './index.module.scss'
import { StorageService } from '@/utils/storage'
import type { EnergyData } from '@/utils/storage'
import { getStatusColor, getStatusBgColor } from '@/utils'

interface FloorEnergy {
  floor: string
  enterprise: string
  electricity: number
  water: number
  status: 'normal' | 'warning' | 'danger'
  percent: number
}

const enterprises = ['智云科技', '创新互联', '博远科技', '星辰数据', '未来网络']

const generateFloorData = (energyData: EnergyData[]): FloorEnergy[] => {
  const avgElec = energyData.reduce((s, d) => s + d.electricity, 0) / energyData.length
  const avgWater = energyData.reduce((s, d) => s + d.water, 0) / energyData.length

  const floors: FloorEnergy[] = []
  for (let i = 12; i >= 7; i--) {
    const factor = 0.5 + Math.random() * 0.8
    const elec = Math.round(avgElec * factor / 6)
    const water = Math.round(avgWater * factor / 6)
    const percent = Math.round(50 + Math.random() * 50)

    let status: 'normal' | 'warning' | 'danger' = 'normal'
    if (percent > 90) status = 'danger'
    else if (percent > 75) status = 'warning'

    floors.push({
      floor: `${i}层`,
      enterprise: enterprises[(12 - i) % enterprises.length],
      electricity: elec,
      water,
      status,
      percent
    })
  }

  return floors.sort((a, b) => b.percent - a.percent)
}

const EnergyPage: React.FC = () => {
  const [energyData, setEnergyData] = useState<EnergyData[]>([])
  const [floorData, setFloorData] = useState<FloorEnergy[]>([])

  useEffect(() => {
    const data = StorageService.getEnergyData()
    const recentData = data.slice(-6)
    setEnergyData(recentData)
    setFloorData(generateFloorData(recentData))
  }, [])

  const totalElec = useMemo(() => energyData.reduce((s, d) => s + d.electricity, 0), [energyData])
  const totalWater = useMemo(() => energyData.reduce((s, d) => s + d.water, 0), [energyData])
  const maxElec = useMemo(() => Math.max(...energyData.map(d => d.electricity), 1), [energyData])
  const maxWater = useMemo(() => Math.max(...energyData.map(d => d.water), 1), [energyData])

  const warnings = useMemo(() => {
    const list: { date: string; type: string; value: number; threshold: number }[] = []
    energyData.forEach(d => {
      if (d.electricity > 250) {
        list.push({ date: d.date, type: '用电', value: d.electricity, threshold: 250 })
      }
      if (d.water > 35) {
        list.push({ date: d.date, type: '用水', value: d.water, threshold: 35 })
      }
    })
    return list
  }, [energyData])

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return `${d.getMonth() + 1}/${d.getDate()}`
    } catch {
      return dateStr
    }
  }

  return (
    <ScrollView scrollY>
      <View className={styles.page}>
        {warnings.length > 0 && (
          <View className={styles.warningCard}>
            <Text className={styles.warningTitle}>⚠️ 能耗预警</Text>
            {warnings.map((w, i) => (
              <Text key={i} className={styles.warningItem}>
                {w.date} {w.type}量 {w.value}{w.type === '用电' ? '度' : '吨'}，超过阈值 {w.threshold}{w.type === '用电' ? '度' : '吨'}
              </Text>
            ))}
          </View>
        )}

        <View className={styles.summaryRow}>
          <View className={styles.summaryCard}>
            <Text className={styles.summaryLabel}>⚡ 近6日用电</Text>
            <View style={{ display: 'flex', alignItems: 'baseline' }}>
              <Text className={styles.summaryValue}>{(totalElec / 100).toFixed(1)}</Text>
              <Text className={styles.summaryUnit}>万度</Text>
            </View>
            <Text className={styles.summaryTrend} style={{ color: '#F53F3F' }}>
              日均 {(totalElec / Math.max(energyData.length, 1)).toFixed(0)} 度
            </Text>
          </View>
          <View className={styles.summaryCard}>
            <Text className={styles.summaryLabel}>💧 近6日用水</Text>
            <View style={{ display: 'flex', alignItems: 'baseline' }}>
              <Text className={styles.summaryValue}>{(totalWater / 10).toFixed(1)}</Text>
              <Text className={styles.summaryUnit}>百吨</Text>
            </View>
            <Text className={styles.summaryTrend} style={{ color: '#00B42A' }}>
              日均 {(totalWater / Math.max(energyData.length, 1)).toFixed(0)} 吨
            </Text>
          </View>
        </View>

        <View className={styles.chartCard}>
          <Text className={styles.chartTitle}>近6日能耗趋势</Text>
          <View className={styles.chartRow}>
            {energyData.map(d => {
              const hasWarning = d.electricity > 250 || d.water > 35
              return (
                <View key={d.date} className={styles.chartBar}>
                  <View style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'flex-end', width: '100%' }}>
                    <View
                      className={`${styles.barFill} ${d.electricity > 250 ? styles.barDanger : styles.barElec}`}
                      style={{ height: `${(d.electricity / maxElec) * 200}rpx`, flex: 1 }}
                    />
                    <View
                      className={`${styles.barFill} ${d.water > 35 ? styles.barDanger : styles.barWater}`}
                      style={{ height: `${(d.water / maxWater) * 200}rpx`, flex: 1 }}
                    />
                  </View>
                  <Text className={styles.barLabel}>{formatDate(d.date)}</Text>
                  {hasWarning && <Text className={styles.barWarn}>!</Text>}
                </View>
              )
            })}
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
            <View className={styles.legendItem}>
              <View className={styles.legendDot} style={{ backgroundColor: '#F53F3F' }} />
              <Text>超阈值</Text>
            </View>
          </View>
        </View>

        <View className={styles.floorList}>
          <Text className={styles.floorTitle}>各楼层能耗排名</Text>
          {floorData.map((f, idx) => (
            <View key={f.floor} className={styles.floorItem}>
              <View className={styles.floorRow}>
                <View style={{ display: 'flex', alignItems: 'center', gap: '8rpx' }}>
                  <View className={classnames(styles.rankBadge, idx < 3 && styles.rankBadgeTop)}>
                    <Text className={styles.rankNum}>{idx + 1}</Text>
                  </View>
                  <View>
                    <Text className={styles.floorName}>{f.floor}</Text>
                    <Text className={styles.floorEnt}>  {f.enterprise}</Text>
                  </View>
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

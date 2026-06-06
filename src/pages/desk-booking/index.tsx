import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { mockDesks } from '@/data/mockEnergy'

const dates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i)
  return { day: d.getDate(), week: ['日','一','二','三','四','五','六'][d.getDay()] }
})

const DeskBookingPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedDesk, setSelectedDesk] = useState<string | null>(null)
  const [duration, setDuration] = useState(4)

  const groupedDesks = useMemo(() => {
    const groups: Record<string, typeof mockDesks> = {}
    mockDesks.forEach(d => { groups[d.area] = groups[d.area] || []; groups[d.area].push(d) })
    return groups
  }, [])

  const selectedDeskData = mockDesks.find(d => d.id === selectedDesk)
  const totalPrice = selectedDeskData ? selectedDeskData.pricePerHour * duration : 0

  const handleBook = () => {
    if (!selectedDesk) { Taro.showToast({ title: '请选择工位', icon: 'none' }); return }
    console.log('[DeskBooking] 预订工位:', selectedDesk, '时长:', duration, '小时')
    Taro.showModal({ title: '预订确认', content: `确认预订 ${duration} 小时，费用 ¥${totalPrice}？`, success: (res) => {
      if (res.confirm) { Taro.showToast({ title: '预订成功！', icon: 'success' }); setTimeout(() => Taro.navigateBack(), 1500) }
    }})
  }

  return (
    <View>
      <ScrollView scrollY>
        <View className={styles.page}>
          <View className={styles.header}>
            <Text className={styles.title}>选择日期</Text>
            <Text style={{ fontSize: 24, color: '#86909C' }} onClick={() => setDuration(d => Math.min(8, d + 1))}>
              时长 {duration}h
            </Text>
          </View>
          <ScrollView scrollX className={styles.dateRow}>
            {dates.map((d, i) => (
              <View key={i} className={classnames(styles.dateItem, selectedDate === i && styles.dateActive)} onClick={() => setSelectedDate(i)}>
                <Text className={styles.dateDay}>{d.day}</Text>
                <Text className={styles.dateWeek}>周{d.week}</Text>
              </View>
            ))}
          </ScrollView>
          <View className={styles.legend}>
            <View className={styles.legendItem}><View className={styles.legendDot} style={{ backgroundColor: '#00B42A' }} /><Text>可预订</Text></View>
            <View className={styles.legendItem}><View className={styles.legendDot} style={{ backgroundColor: '#722ED1' }} /><Text>已预约</Text></View>
            <View className={styles.legendItem}><View className={styles.legendDot} style={{ backgroundColor: '#F53F3F' }} /><Text>使用中</Text></View>
          </View>
          {Object.entries(groupedDesks).map(([area, desks]) => (
            <View key={area} className={styles.areaSection}>
              <Text className={styles.areaTitle}>{area}</Text>
              <View className={styles.deskGrid}>
                {desks.map(desk => (
                  <View key={desk.id}
                    className={classnames(
                      styles.desk,
                      desk.status === 'available' && styles.deskAvailable,
                      desk.status === 'occupied' && styles.deskOccupied,
                      desk.status === 'reserved' && styles.deskReserved,
                      selectedDesk === desk.id && styles.deskSelected
                    )}
                    onClick={() => desk.status === 'available' && setSelectedDesk(desk.id)}
                  >
                    <Text className={styles.deskName}>{desk.name}</Text>
                    <Text className={styles.deskPrice}>¥{desk.pricePerHour}/h</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View className={styles.bottomBar}>
        <View className={styles.summary}>
          <Text className={styles.summaryLabel}>{selectedDeskData ? `${selectedDeskData.name} · ${duration}小时` : '请选择工位'}</Text>
          <Text className={styles.summaryValue}>¥{totalPrice}</Text>
        </View>
        <Button className={styles.bookBtn} onClick={handleBook}>确认预订</Button>
      </View>
    </View>
  )
}
export default DeskBookingPage

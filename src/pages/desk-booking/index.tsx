import React, { useState, useMemo, useEffect } from 'react'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { StorageService, generateId } from '@/utils/storage'
import type { DeskBooking } from '@/utils/storage'

const generateDates = () => {
  const dates: { dateStr: string; day: number; week: string }[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    dates.push({
      dateStr: d.toISOString().split('T')[0],
      day: d.getDate(),
      week: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
    })
  }
  return dates
}

const startTimes = Array.from({ length: 10 }, (_, i) =>
  `${(i + 9).toString().padStart(2, '0')}:00`
)

const DeskBookingPage: React.FC = () => {
  const [selectedDateIdx, setSelectedDateIdx] = useState(0)
  const [selectedDesk, setSelectedDesk] = useState<string | null>(null)
  const [startTime, setStartTime] = useState('09:00')
  const [hours, setHours] = useState(4)

  const dates = useMemo(() => generateDates(), [])
  const selectedDateStr = dates[selectedDateIdx].dateStr

  const user = StorageService.getCurrentUser()
  const desks = StorageService.getDesks()
  const bookings = StorageService.getDeskBookings()

  useEffect(() => {
    if (!user) {
      Taro.redirectTo({ url: '/pages/login/index' })
    }
  }, [user])

  const bookedDeskIds = useMemo(() => {
    const booked = new Set<string>()
    bookings.forEach((b) => {
      if (b.date === selectedDateStr && b.status !== 'cancelled') {
        booked.add(b.deskId)
      }
    })
    return booked
  }, [bookings, selectedDateStr])

  const desksWithStatus = useMemo(() => {
    return desks.map((d) => ({
      ...d,
      displayStatus: bookedDeskIds.has(d.id) ? 'occupied' : d.status
    }))
  }, [desks, bookedDeskIds])

  const groupedDesks = useMemo(() => {
    const groups: Record<string, typeof desksWithStatus> = {}
    desksWithStatus.forEach((d) => {
      groups[d.area] = groups[d.area] || []
      groups[d.area].push(d)
    })
    return groups
  }, [desksWithStatus])

  const selectedDeskData = desks.find((d) => d.id === selectedDesk)
  const totalPrice = selectedDeskData ? selectedDeskData.pricePerHour * hours : 0

  const handleBook = () => {
    if (!user) {
      Taro.redirectTo({ url: '/pages/login/index' })
      return
    }
    if (!selectedDesk) {
      Taro.showToast({ title: '请选择工位', icon: 'none' })
      return
    }
    if (!startTime) {
      Taro.showToast({ title: '请选择开始时间', icon: 'none' })
      return
    }

    const startHour = parseInt(startTime.split(':')[0], 10)
    if (startHour + hours > 18) {
      Taro.showToast({ title: '结束时间不能超过18:00', icon: 'none' })
      return
    }

    Taro.showModal({
      title: '预订确认',
      content: `确认预订 ${selectedDeskData?.name} ${selectedDateStr} ${startTime} 起 ${hours} 小时，费用 ¥${totalPrice}？`,
      success: (res) => {
        if (res.confirm && selectedDeskData) {
          const newBooking: DeskBooking = {
            id: generateId(),
            deskId: selectedDeskData.id,
            deskName: selectedDeskData.name,
            userId: user.id,
            userName: user.name,
            date: selectedDateStr,
            startTime,
            hours,
            totalPrice,
            status: 'confirmed',
            createdAt: new Date().toISOString()
          }
          StorageService.addDeskBooking(newBooking)
          StorageService.addMessage({
            id: generateId(),
            userId: user.id,
            title: '工位预订成功',
            content: `您已成功预订${selectedDeskData.name}，时间：${selectedDateStr} ${startTime} 起 ${hours} 小时`,
            type: 'booking',
            read: false,
            createdAt: new Date().toISOString()
          })
          Taro.showToast({ title: '预订成功！', icon: 'success' })
          setTimeout(() => Taro.navigateBack(), 1500)
        }
      }
    })
  }

  if (!user) return null

  return (
    <View>
      <ScrollView scrollY>
        <View className={styles.page}>
          <View className={styles.header}>
            <Text className={styles.title}>选择日期</Text>
          </View>
          <ScrollView scrollX className={styles.dateRow}>
            {dates.map((d, i) => (
              <View
                key={i}
                className={classnames(styles.dateItem, selectedDateIdx === i && styles.dateActive)}
                onClick={() => {
                  setSelectedDateIdx(i)
                  setSelectedDesk(null)
                }}
              >
                <Text className={styles.dateDay}>{d.day}</Text>
                <Text className={styles.dateWeek}>周{d.week}</Text>
              </View>
            ))}
          </ScrollView>

          <View className={styles.header}>
            <Text className={styles.title}>开始时间</Text>
          </View>
          <ScrollView scrollX className={styles.dateRow}>
            {startTimes.map((t) => (
              <View
                key={t}
                className={classnames(styles.dateItem, startTime === t && styles.dateActive)}
                onClick={() => setStartTime(t)}
              >
                <Text className={styles.dateDay}>{t}</Text>
              </View>
            ))}
          </ScrollView>

          <View className={styles.header}>
            <Text className={styles.title}>时长</Text>
            <View style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <Text
                style={{ fontSize: 32, color: hours > 1 ? '#165DFF' : '#86909C' }}
                onClick={() => setHours((h) => Math.max(1, h - 1))}
              >
                −
              </Text>
              <Text style={{ fontSize: 28, fontWeight: 600 }}>{hours}h</Text>
              <Text
                style={{ fontSize: 32, color: hours < 8 ? '#165DFF' : '#86909C' }}
                onClick={() => setHours((h) => Math.min(8, h + 1))}
              >
                +
              </Text>
            </View>
          </View>

          <View className={styles.legend}>
            <View className={styles.legendItem}>
              <View className={styles.legendDot} style={{ backgroundColor: '#00B42A' }} />
              <Text>可预订</Text>
            </View>
            <View className={styles.legendItem}>
              <View className={styles.legendDot} style={{ backgroundColor: '#722ED1' }} />
              <Text>已预约</Text>
            </View>
            <View className={styles.legendItem}>
              <View className={styles.legendDot} style={{ backgroundColor: '#F53F3F' }} />
              <Text>使用中</Text>
            </View>
          </View>

          {Object.entries(groupedDesks).map(([area, areaDesks]) => (
            <View key={area} className={styles.areaSection}>
              <Text className={styles.areaTitle}>{area}</Text>
              <View className={styles.deskGrid}>
                {areaDesks.map((desk) => {
                  const isAvailable = desk.displayStatus === 'available'
                  return (
                    <View
                      key={desk.id}
                      className={classnames(
                        styles.desk,
                        isAvailable && styles.deskAvailable,
                        desk.displayStatus === 'occupied' && styles.deskOccupied,
                        desk.displayStatus === 'reserved' && styles.deskReserved,
                        selectedDesk === desk.id && styles.deskSelected
                      )}
                      onClick={() => isAvailable && setSelectedDesk(desk.id)}
                    >
                      <Text className={styles.deskName}>{desk.name}</Text>
                      <Text className={styles.deskPrice}>¥{desk.pricePerHour}/h</Text>
                    </View>
                  )
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View className={styles.bottomBar}>
        <View className={styles.summary}>
          <Text className={styles.summaryLabel}>
            {selectedDeskData
              ? `${selectedDeskData.name} · ${startTime} 起 ${hours}小时`
              : '请选择工位'}
          </Text>
          <Text className={styles.summaryValue}>¥{totalPrice}</Text>
        </View>
        <Button className={styles.bookBtn} onClick={handleBook}>
          确认预订
        </Button>
      </View>
    </View>
  )
}

export default DeskBookingPage

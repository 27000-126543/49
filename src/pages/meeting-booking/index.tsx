import React, { useState, useMemo } from 'react'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatusTag from '@/components/StatusTag'
import { mockMeetingRooms, generateTimeSlots } from '@/data/mockMeeting'
import type { MeetingRoom, TimeSlot } from '@/types'

const capacityFilters = ['全部', '4人以下', '4-10人', '10人以上']

const MeetingBookingPage: React.FC = () => {
  const [capacityFilter, setCapacityFilter] = useState('全部')
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(null)
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])

  const timeSlots = useMemo(() => generateTimeSlots('2024-06-06'), [])

  const filteredRooms = useMemo(() => {
    if (capacityFilter === '全部') return mockMeetingRooms
    if (capacityFilter === '4人以下') return mockMeetingRooms.filter(r => r.capacity <= 4)
    if (capacityFilter === '4-10人') return mockMeetingRooms.filter(r => r.capacity > 4 && r.capacity <= 10)
    return mockMeetingRooms.filter(r => r.capacity > 10)
  }, [capacityFilter])

  const toggleSlot = (slot: TimeSlot) => {
    if (!slot.available) return
    setSelectedSlots(prev =>
      prev.includes(slot.id) ? prev.filter(id => id !== slot.id) : [...prev, slot.id]
    )
  }

  const handleBook = () => {
    if (selectedSlots.length === 0) {
      Taro.showToast({ title: '请选择时段', icon: 'none' })
      return
    }
    console.log('[MeetingBooking] 预约会议室:', selectedRoom?.name, '时段:', selectedSlots)
    Taro.showModal({
      title: '预约确认',
      content: `确认预约 ${selectedSlots.length} 个时段？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '预约成功！', icon: 'success' })
          setTimeout(() => Taro.navigateBack(), 1500)
        }
      }
    })
  }

  const selectedSlotTimes = selectedSlots
    .map(id => timeSlots.find(s => s.id === id))
    .filter(Boolean) as TimeSlot[]

  return (
    <View>
      <ScrollView scrollY>
        <View className={styles.page}>
          <View className={styles.filterBar}>
            {capacityFilters.map(f => (
              <View
                key={f}
                className={classnames(styles.filterTag, capacityFilter === f && styles.filterTagActive)}
                onClick={() => setCapacityFilter(f)}
              >
                <Text>{f}</Text>
              </View>
            ))}
          </View>

          <View className={styles.roomList}>
            {filteredRooms.map(room => (
              <View key={room.id} className={styles.roomCard}>
                <View className={styles.roomImage}>
                  <Image className={styles.roomImg} src={room.image} mode="aspectFill" />
                </View>
                <View className={styles.roomBody}>
                  <View className={styles.roomHeader}>
                    <Text className={styles.roomName}>{room.name}</Text>
                    <StatusTag status={room.status} text={
                      room.status === 'available' ? '可预约' :
                      room.status === 'occupied' ? '使用中' : '维护中'
                    } />
                  </View>
                  <View className={styles.roomMeta}>
                    <View className={styles.metaItem}>
                      <Text>📍</Text>
                      <Text>{room.floor}层</Text>
                    </View>
                    <View className={styles.metaItem}>
                      <Text>👥</Text>
                      <Text>容纳{room.capacity}人</Text>
                    </View>
                  </View>
                  <View className={styles.equipmentList}>
                    {room.equipment.map(eq => (
                      <View key={eq} className={styles.equipmentTag}>
                        <Text>{eq}</Text>
                      </View>
                    ))}
                  </View>
                  <View
                    className={styles.timeSlots}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <Text className={styles.slotsTitle}>今日可选时段：</Text>
                    <View className={styles.slotsGrid}>
                      {timeSlots.slice(0, 8).map(slot => (
                        <View
                          key={slot.id}
                          className={classnames(
                            styles.slot,
                            slot.available && styles.slotAvailable,
                            selectedSlots.includes(slot.id) && selectedRoom?.id === room.id && styles.slotSelected,
                            !slot.available && styles.slotDisabled
                          )}
                          onClick={(e) => { e.stopPropagation(); toggleSlot(slot) }}
                        >
                          <Text>{slot.start}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <View className={styles.summary}>
          <Text className={styles.summaryLabel}>
            已选 {selectedSlots.length} 个时段
          </Text>
          <Text className={styles.summaryValue}>
            {selectedSlotTimes.length > 0
              ? `${selectedSlotTimes[0].start} - ${selectedSlotTimes[selectedSlotTimes.length - 1].end}`
              : '请选择时段'
            }
          </Text>
        </View>
        <Button className={styles.bookBtn} onClick={handleBook}>
          确认预约
        </Button>
      </View>
    </View>
  )
}

export default MeetingBookingPage

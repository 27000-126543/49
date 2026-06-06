import React, { useState, useMemo } from 'react'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatusTag from '@/components/StatusTag'
import { StorageService, generateId } from '@/utils/storage'
import type { MeetingRoom, MeetingBooking } from '@/utils/storage'

const capacityFilters = ['全部', '4人以下', '4-10人', '10人以上']

const generateTimeSlots = (): { id: string; start: string; end: string }[] => {
  const slots: { id: string; start: string; end: string }[] = []
  for (let h = 8; h < 20; h++) {
    slots.push({
      id: `${h}-0`,
      start: `${h.toString().padStart(2, '0')}:00`,
      end: `${h.toString().padStart(2, '0')}:30`
    })
    slots.push({
      id: `${h}-1`,
      start: `${h.toString().padStart(2, '0')}:30`,
      end: `${(h + 1).toString().padStart(2, '0')}:00`
    })
  }
  return slots
}

const allTimeSlots = generateTimeSlots()

const todayStr = new Date().toISOString().split('T')[0]

const MeetingBookingPage: React.FC = () => {
  const [capacityFilter, setCapacityFilter] = useState('全部')
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(null)
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState(todayStr)

  const user = StorageService.getCurrentUser()
  const rooms = StorageService.getMeetingRooms()
  const bookings = StorageService.getMeetingBookings()

  const bookedSlotIds = useMemo(() => {
    if (!selectedRoom) return new Set<string>()
    const roomBookings = bookings.filter(
      (b) => b.roomId === selectedRoom.id && b.date === selectedDate && b.status !== 'cancelled'
    )
    const booked = new Set<string>()
    roomBookings.forEach((b) => {
      allTimeSlots.forEach((slot) => {
        if (slot.start >= b.startTime && slot.start < b.endTime) {
          booked.add(slot.id)
        }
      })
    })
    return booked
  }, [selectedRoom, selectedDate, bookings])

  const filteredRooms = useMemo(() => {
    if (capacityFilter === '全部') return rooms
    if (capacityFilter === '4人以下') return rooms.filter((r) => r.capacity <= 4)
    if (capacityFilter === '4-10人') return rooms.filter((r) => r.capacity > 4 && r.capacity <= 10)
    return rooms.filter((r) => r.capacity > 10)
  }, [capacityFilter, rooms])

  const toggleSlot = (slotId: string) => {
    if (bookedSlotIds.has(slotId)) return
    setSelectedSlots((prev) =>
      prev.includes(slotId) ? prev.filter((id) => id !== slotId) : [...prev, slotId]
    )
  }

  const toggleEquipment = (eq: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]
    )
  }

  const handleSelectRoom = (room: MeetingRoom) => {
    setSelectedRoom(room)
    setSelectedSlots([])
    setSelectedEquipment([])
  }

  const handleBook = () => {
    if (!selectedRoom) {
      Taro.showToast({ title: '请选择会议室', icon: 'none' })
      return
    }
    if (selectedSlots.length === 0) {
      Taro.showToast({ title: '请选择时段', icon: 'none' })
      return
    }
    if (!user) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      return
    }

    const sortedSlots = [...selectedSlots].sort()
    const firstSlot = allTimeSlots.find((s) => s.id === sortedSlots[0])
    const lastSlot = allTimeSlots.find((s) => s.id === sortedSlots[sortedSlots.length - 1])
    if (!firstSlot || !lastSlot) return

    const newBooking: MeetingBooking = {
      id: generateId(),
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      userId: user.id,
      userName: user.name,
      date: selectedDate,
      startTime: firstSlot.start,
      endTime: lastSlot.end,
      equipment: selectedEquipment,
      status: 'pending',
      statusText: '待确认',
      createdAt: new Date().toISOString(),
      checkedIn: false
    }

    Taro.showModal({
      title: '预约确认',
      content: `确认预约 ${selectedRoom.name} ${firstSlot.start}-${lastSlot.end}？`,
      success: (res) => {
        if (res.confirm) {
          StorageService.addMeetingBooking(newBooking)
          StorageService.addMessage({
            id: generateId(),
            userId: user.id,
            title: '会议室预约成功',
            content: `您已成功预约${selectedRoom.name}，时间：${selectedDate} ${firstSlot.start}-${lastSlot.end}`,
            type: 'booking',
            read: false,
            createdAt: new Date().toISOString()
          })
          Taro.showToast({ title: '预约成功！', icon: 'success' })
          setTimeout(() => Taro.navigateBack(), 1500)
        }
      }
    })
  }

  const selectedSlotTimes = selectedSlots
    .map((id) => allTimeSlots.find((s) => s.id === id))
    .filter(Boolean)
    .sort((a, b) => a!.id.localeCompare(b!.id)) as {
    id: string
    start: string
    end: string
  }[]

  return (
    <View>
      <ScrollView scrollY>
        <View className={styles.page}>
          <View className={styles.filterBar}>
            {capacityFilters.map((f) => (
              <View
                key={f}
                className={classnames(
                  styles.filterTag,
                  capacityFilter === f && styles.filterTagActive
                )}
                onClick={() => setCapacityFilter(f)}
              >
                <Text>{f}</Text>
              </View>
            ))}
          </View>

          <View className={styles.roomList}>
            {filteredRooms.map((room) => (
              <View key={room.id} className={styles.roomCard}>
                <View className={styles.roomImage}>
                  <Image className={styles.roomImg} src={room.image} mode="aspectFill" />
                </View>
                <View className={styles.roomBody}>
                  <View className={styles.roomHeader}>
                    <Text className={styles.roomName}>{room.name}</Text>
                    <StatusTag
                      status={room.status}
                      text={
                        room.status === 'available'
                          ? '可预约'
                          : room.status === 'occupied'
                          ? '使用中'
                          : '维护中'
                      }
                    />
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
                    {room.equipment.map((eq) => (
                      <View
                        key={eq}
                        className={classnames(
                          styles.equipmentTag,
                          selectedRoom?.id === room.id &&
                            selectedEquipment.includes(eq) &&
                            styles.equipmentTagSelected
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (selectedRoom?.id !== room.id) handleSelectRoom(room)
                          toggleEquipment(eq)
                        }}
                      >
                        <Text>{eq}</Text>
                      </View>
                    ))}
                  </View>
                  <View className={styles.timeSlots} onClick={() => handleSelectRoom(room)}>
                    <Text className={styles.slotsTitle}>
                      {selectedDate} 可选时段：
                    </Text>
                    <View className={styles.slotsGrid}>
                      {allTimeSlots.map((slot) => {
                        const isBooked =
                          selectedRoom?.id === room.id && bookedSlotIds.has(slot.id)
                        const isSelected =
                          selectedRoom?.id === room.id && selectedSlots.includes(slot.id)
                        return (
                          <View
                            key={slot.id}
                            className={classnames(
                              styles.slot,
                              !isBooked && styles.slotAvailable,
                              isSelected && styles.slotSelected,
                              isBooked && styles.slotDisabled
                            )}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (selectedRoom?.id !== room.id) handleSelectRoom(room)
                              toggleSlot(slot.id)
                            }}
                          >
                            <Text>{slot.start}</Text>
                          </View>
                        )
                      })}
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
              ? `${selectedSlotTimes[0].start} - ${
                  selectedSlotTimes[selectedSlotTimes.length - 1].end
                }`
              : '请选择时段'}
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

import type { MeetingRoom, TimeSlot } from '@/types'

export const mockMeetingRooms: MeetingRoom[] = [
  {
    id: 'r001',
    name: '创新厅',
    floor: 12,
    capacity: 12,
    equipment: ['投影', '视频会议', '白板', '电视'],
    status: 'available',
    image: 'https://picsum.photos/id/3/600/400'
  },
  {
    id: 'r002',
    name: '星空厅',
    floor: 5,
    capacity: 8,
    equipment: ['投影', '白板', '视频会议'],
    status: 'available',
    image: 'https://picsum.photos/id/1/600/400'
  },
  {
    id: 'r003',
    name: '启明厅',
    floor: 8,
    capacity: 20,
    equipment: ['投影', '视频会议', '白板', '音响', '电视'],
    status: 'occupied',
    image: 'https://picsum.photos/id/6/600/400'
  },
  {
    id: 'r004',
    name: '博雅厅',
    floor: 10,
    capacity: 6,
    equipment: ['电视', '白板'],
    status: 'available',
    image: 'https://picsum.photos/id/8/600/400'
  },
  {
    id: 'r005',
    name: '明德厅',
    floor: 3,
    capacity: 30,
    equipment: ['投影', '视频会议', '音响', '电视', '白板'],
    status: 'maintenance',
    image: 'https://picsum.photos/id/9/600/400'
  },
  {
    id: 'r006',
    name: '弘毅厅',
    floor: 6,
    capacity: 10,
    equipment: ['投影', '白板', '视频会议'],
    status: 'available',
    image: 'https://picsum.photos/id/2/600/400'
  },
  {
    id: 'r007',
    name: '致远厅',
    floor: 7,
    capacity: 4,
    equipment: ['电视', '白板'],
    status: 'available',
    image: 'https://picsum.photos/id/119/600/400'
  },
  {
    id: 'r008',
    name: '思齐厅',
    floor: 11,
    capacity: 16,
    equipment: ['投影', '视频会议', '白板', '电视'],
    status: 'available',
    image: 'https://picsum.photos/id/160/600/400'
  }
]

export const generateTimeSlots = (date: string): TimeSlot[] => {
  const slots: TimeSlot[] = []
  for (let h = 8; h <= 21; h++) {
    slots.push({
      id: `${date}-${h}`,
      start: `${h.toString().padStart(2, '0')}:00`,
      end: `${(h + 1).toString().padStart(2, '0')}:00`,
      available: Math.random() > 0.4
    })
  }
  return slots
}

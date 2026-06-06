import type { CanteenMeal, CanteenOrder } from '@/types'

export const mockMeals: CanteenMeal[] = [
  {
    id: 'meal001',
    name: '红烧肉套餐',
    price: 28,
    image: 'https://picsum.photos/id/292/300/300',
    category: '经典套餐',
    calories: 680,
    available: true
  },
  {
    id: 'meal002',
    name: '宫保鸡丁套餐',
    price: 25,
    image: 'https://picsum.photos/id/312/300/300',
    category: '经典套餐',
    calories: 590,
    available: true
  },
  {
    id: 'meal003',
    name: '清蒸鲈鱼套餐',
    price: 38,
    image: 'https://picsum.photos/id/326/300/300',
    category: '海鲜套餐',
    calories: 520,
    available: true
  },
  {
    id: 'meal004',
    name: '黑椒牛柳套餐',
    price: 32,
    image: 'https://picsum.photos/id/401/300/300',
    category: '经典套餐',
    calories: 650,
    available: true
  },
  {
    id: 'meal005',
    name: '麻婆豆腐套餐',
    price: 20,
    image: 'https://picsum.photos/id/431/300/300',
    category: '素食套餐',
    calories: 480,
    available: true
  },
  {
    id: 'meal006',
    name: '番茄牛腩面',
    price: 26,
    image: 'https://picsum.photos/id/570/300/300',
    category: '面食',
    calories: 620,
    available: true
  },
  {
    id: 'meal007',
    name: '日式照烧鸡饭',
    price: 30,
    image: 'https://picsum.photos/id/580/300/300',
    category: '日韩料理',
    calories: 600,
    available: true
  },
  {
    id: 'meal008',
    name: '酸菜鱼套餐',
    price: 35,
    image: 'https://picsum.photos/id/625/300/300',
    category: '川湘套餐',
    calories: 560,
    available: true
  },
  {
    id: 'meal009',
    name: '什锦沙拉套餐',
    price: 22,
    image: 'https://picsum.photos/id/835/300/300',
    category: '轻食健康',
    calories: 320,
    available: true
  },
  {
    id: 'meal010',
    name: '咖喱牛肉饭',
    price: 28,
    image: 'https://picsum.photos/id/1080/300/300',
    category: '日韩料理',
    calories: 640,
    available: true
  }
]

export const mockCanteenOrders: CanteenOrder[] = [
  {
    id: 'co001',
    meals: [
      { mealId: 'meal001', name: '红烧肉套餐', quantity: 1 },
      { mealId: 'meal009', name: '什锦沙拉套餐', quantity: 1 }
    ],
    totalPrice: 50,
    pickupCode: 'A827',
    date: '2024-06-06',
    time: '11:30 - 12:00',
    status: 'paid'
  },
  {
    id: 'co002',
    meals: [
      { mealId: 'meal003', name: '清蒸鲈鱼套餐', quantity: 2 }
    ],
    totalPrice: 76,
    pickupCode: 'B342',
    date: '2024-06-05',
    time: '12:00 - 12:30',
    status: 'picked'
  },
  {
    id: 'co003',
    meals: [
      { mealId: 'meal006', name: '番茄牛腩面', quantity: 1 }
    ],
    totalPrice: 26,
    pickupCode: 'C156',
    date: '2024-06-04',
    time: '12:00 - 12:30',
    status: 'picked'
  }
]

export const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

export const flowPrediction = {
  today: 1286,
  trend: '+5.2%' as const,
  weather: '多云 26°C',
  windowSuggestions: [
    { window: '1号窗口（川湘）', suggested: 320, current: 280 },
    { window: '2号窗口（粤式）', suggested: 280, current: 260 },
    { window: '3号窗口（日韩）', suggested: 240, current: 250 },
    { window: '4号窗口（面食）', suggested: 260, current: 230 },
    { window: '5号窗口（轻食）', suggested: 186, current: 200 }
  ]
}

import React, { useState, useMemo, useEffect } from 'react'
import { View, Text, ScrollView, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { StorageService, generateId, generatePickupCode } from '@/utils/storage'
import type { CanteenMeal, CanteenOrder } from '@/utils/storage'
import { flowPrediction, weekDays } from '@/data/mockCanteen'

const CanteenPage: React.FC = () => {
  const [tab, setTab] = useState<'menu' | 'orders'>('menu')
  const [selectedDay, setSelectedDay] = useState(0)
  const [meals, setMeals] = useState<CanteenMeal[]>([])
  const [cart, setCart] = useState<Record<string, number>>({})
  const [orders, setOrders] = useState<CanteenOrder[]>([])
  const [showPickupCode, setShowPickupCode] = useState(false)
  const [currentPickupCode, setCurrentPickupCode] = useState('')
  const [currentOrder, setCurrentOrder] = useState<CanteenOrder | null>(null)

  const currentUser = StorageService.getCurrentUser()

  const categories = useMemo(() => {
    const cats = new Set(meals.map(m => m.category))
    return ['全部', ...Array.from(cats)]
  }, [meals])

  const [selectedCat, setSelectedCat] = useState('全部')

  const loadMeals = () => {
    setMeals(StorageService.getCanteenMeals())
  }

  const loadOrders = () => {
    if (!currentUser) {
      setOrders([])
      return
    }
    const allOrders = StorageService.getCanteenOrders()
    const userOrders = allOrders.filter(o => o.userId === currentUser.id)
    setOrders(userOrders.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ))
  }

  useEffect(() => {
    loadMeals()
    loadOrders()
  }, [tab])

  const filteredMeals = useMemo(() => {
    if (selectedCat === '全部') return meals
    return meals.filter(m => m.category === selectedCat)
  }, [selectedCat, meals])

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const meal = meals.find(m => m.id === id)
    return sum + (meal ? meal.price * qty : 0)
  }, 0)

  const addToCart = (meal: CanteenMeal) => {
    setCart(prev => ({ ...prev, [meal.id]: (prev[meal.id] || 0) + 1 }))
    Taro.showToast({ title: '已加入', icon: 'none' })
  }

  const decreaseFromCart = (mealId: string) => {
    setCart(prev => {
      const newCart = { ...prev }
      if (newCart[mealId] > 1) {
        newCart[mealId]--
      } else {
        delete newCart[mealId]
      }
      return newCart
    })
  }

  const handleCheckout = () => {
    if (cartCount === 0) {
      Taro.showToast({ title: '请先选择餐品', icon: 'none' })
      return
    }

    const user = StorageService.getCurrentUser()
    if (!user) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      return
    }

    Taro.showModal({
      title: '确认下单',
      content: `共${cartCount}份，合计 ¥${cartTotal}`,
      success: (res) => {
        if (res.confirm) {
          const now = new Date()
          const pickupCode = generatePickupCode()

          const orderMeals = Object.entries(cart).map(([mealId, qty]) => {
            const meal = meals.find(m => m.id === mealId)
            return {
              mealId,
              name: meal?.name || '',
              quantity: qty,
              price: meal?.price || 0
            }
          })

          const newOrder: CanteenOrder = {
            id: generateId(),
            userId: user.id,
            userName: user.name,
            meals: orderMeals,
            totalPrice: cartTotal,
            pickupCode,
            date: now.toISOString().split('T')[0],
            time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
            status: 'paid',
            createdAt: now.toISOString()
          }

          StorageService.addCanteenOrder(newOrder)

          setCurrentPickupCode(pickupCode)
          setCurrentOrder(newOrder)
          setShowPickupCode(true)
          setCart({})
          loadOrders()
        }
      }
    })
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('zh-CN')
    } catch {
      return dateStr
    }
  }

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      paid: '待取餐',
      picked: '已取餐',
      refunded: '已退款'
    }
    return map[status] || status
  }

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      paid: '#165DFF',
      picked: '#00B42A',
      refunded: '#86909C'
    }
    return map[status] || '#86909C'
  }

  return (
    <View>
      {showPickupCode && currentOrder ? (
        <ScrollView scrollY>
          <View className={styles.page}>
            <View className={styles.pickupCodeCard}>
              <Text className={styles.pickupCodeTitle}>🎉 下单成功</Text>
              <Text className={styles.pickupCodeLabel}>您的取餐码</Text>
              <View className={styles.pickupCodeBox}>
                {currentPickupCode.split('').map((char, i) => (
                  <Text key={i} className={styles.pickupCodeChar}>{char}</Text>
                ))}
              </View>
              <Text className={styles.pickupCodeTip}>请凭此取餐码到食堂取餐</Text>
            </View>

            <View className={styles.orderDetailCard}>
              <Text className={styles.orderDetailTitle}>订单详情</Text>
              <View className={styles.orderDetailRow}>
                <Text className={styles.orderDetailLabel}>订单号</Text>
                <Text className={styles.orderDetailValue}>{currentOrder.id}</Text>
              </View>
              <View className={styles.orderDetailRow}>
                <Text className={styles.orderDetailLabel}>下单时间</Text>
                <Text className={styles.orderDetailValue}>{formatDate(currentOrder.createdAt)}</Text>
              </View>
              <View className={styles.orderDetailRow}>
                <Text className={styles.orderDetailLabel}>取餐时间</Text>
                <Text className={styles.orderDetailValue}>{currentOrder.date} {currentOrder.time}</Text>
              </View>
              {currentOrder.meals.map((m, i) => (
                <View key={i} className={styles.orderMealItem}>
                  <Text className={styles.orderMealName}>{m.name}</Text>
                  <Text className={styles.orderMealInfo}>x{m.quantity}  ¥{m.price * m.quantity}</Text>
                </View>
              ))}
              <View className={styles.orderTotalRow}>
                <Text className={styles.orderTotalLabel}>合计</Text>
                <Text className={styles.orderTotalValue}>¥{currentOrder.totalPrice}</Text>
              </View>
            </View>

            <Button className={styles.backToMenuBtn} onClick={() => {
              setShowPickupCode(false)
              setCurrentOrder(null)
            }}>
              返回菜单
            </Button>
          </View>
        </ScrollView>
      ) : (
        <>
          <ScrollView scrollY>
            <View className={styles.page}>
              <View className={styles.tabs}>
                <View className={classnames(styles.tab, tab === 'menu' && styles.tabActive)} onClick={() => setTab('menu')}>
                  <Text>点餐</Text>
                </View>
                <View className={classnames(styles.tab, tab === 'orders' && styles.tabActive)} onClick={() => setTab('orders')}>
                  <Text>我的订单</Text>
                </View>
              </View>

              {tab === 'menu' ? (
                <>
                  <View className={styles.predictionCard}>
                    <View className={styles.predictionHeader}>
                      <Text className={styles.predictionTitle}>🍱 今日人流预测</Text>
                      <Text className={styles.weather}>{flowPrediction.weather}</Text>
                    </View>
                    <View className={styles.predictionBody}>
                      <Text className={styles.flowNum}>{flowPrediction.today}</Text>
                      <Text className={styles.flowUnit}>人</Text>
                      <Text className={styles.flowTrend}>↑ {flowPrediction.trend}</Text>
                    </View>
                    <Text className={styles.suggestTitle}>📊 备餐建议</Text>
                    <View className={styles.suggestList}>
                      {flowPrediction.windowSuggestions.slice(0, 3).map(w => (
                        <View key={w.window} className={styles.suggestItem}>
                          <Text>{w.window}</Text>
                          <Text>建议 {w.suggested} 份{w.suggested > w.current ? ' (需增加)' : ''}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View className={styles.weekBar}>
                    {weekDays.map((d, i) => (
                      <View key={i} className={classnames(styles.weekItem, selectedDay === i && styles.weekItemActive)} onClick={() => setSelectedDay(i)}>
                        <Text className={styles.weekDay}>{d}</Text>
                        <Text className={styles.weekDate}>{i + 3}</Text>
                      </View>
                    ))}
                  </View>

                  <ScrollView scrollX className={styles.categoryBar}>
                    {categories.map(c => (
                      <View key={c} className={classnames(styles.categoryItem, selectedCat === c && styles.categoryActive)} onClick={() => setSelectedCat(c)}>
                        <Text>{c}</Text>
                      </View>
                    ))}
                  </ScrollView>

                  <View className={styles.mealList}>
                    {filteredMeals.map(meal => (
                      <View key={meal.id} className={styles.mealCard}>
                        <Image className={styles.mealImg} src={meal.image} mode="aspectFill" />
                        <View className={styles.mealBody}>
                          <Text className={styles.mealName}>{meal.name}</Text>
                          <Text className={styles.mealCategory}>{meal.category}</Text>
                          {meal.calories && <Text className={styles.mealCal}>约 {meal.calories} 千卡</Text>}
                          <View className={styles.mealFooter}>
                            <Text className={styles.mealPrice}>¥{meal.price}</Text>
                            {cart[meal.id] > 0 ? (
                              <View className={styles.quantityControl}>
                                <Button className={styles.quantityBtn} onClick={() => decreaseFromCart(meal.id)}>-</Button>
                                <Text className={styles.quantityNum}>{cart[meal.id]}</Text>
                                <Button className={styles.quantityBtn} onClick={() => addToCart(meal)}>+</Button>
                              </View>
                            ) : (
                              <Button className={styles.addBtn} onClick={() => addToCart(meal)}>+</Button>
                            )}
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                orders.length === 0 ? (
                  <View className={styles.emptyState}>
                    <Text className={styles.emptyText}>暂无订单</Text>
                  </View>
                ) : (
                  <View className={styles.orderList}>
                    {orders.map(order => (
                      <View key={order.id} className={styles.orderCard}>
                        <View className={styles.orderHeader}>
                          <Text className={styles.orderId}>订单号：{order.id}</Text>
                          <Text className={styles.orderStatus} style={{ color: getStatusColor(order.status) }}>
                            {getStatusText(order.status)}
                          </Text>
                        </View>
                        <View className={styles.orderTime}>
                          <Text>{formatDate(order.createdAt)}</Text>
                        </View>
                        {order.meals.map((m, i) => (
                          <View key={i} className={styles.orderMealRow}>
                            <Text className={styles.orderMealName}>{m.name}</Text>
                            <Text className={styles.orderMealQty}>x{m.quantity}</Text>
                          </View>
                        ))}
                        <View className={styles.orderFooter}>
                          <Text className={styles.orderPickup}>取餐码：{order.pickupCode}</Text>
                          <Text className={styles.orderTotal}>合计 ¥{order.totalPrice}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )
              )}
            </View>
          </ScrollView>
          {tab === 'menu' && cartCount > 0 && (
            <View className={styles.bottomBar}>
              <View className={styles.cartInfo}>
                <Text className={styles.cartCount}>购物车 {cartCount} 份</Text>
                <Text className={styles.cartPrice}>¥{cartTotal}</Text>
              </View>
              <Button className={styles.checkoutBtn} onClick={handleCheckout}>去结算</Button>
            </View>
          )}
        </>
      )}
    </View>
  )
}
export default CanteenPage

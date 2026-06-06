import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { mockMeals, weekDays, flowPrediction } from '@/data/mockCanteen'
import type { CanteenMeal } from '@/types'

const categories = ['全部', '经典套餐', '海鲜套餐', '川湘套餐', '日韩料理', '面食', '轻食健康', '素食套餐']

const CanteenPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(0)
  const [selectedCat, setSelectedCat] = useState('全部')
  const [cart, setCart] = useState<Record<string, number>>({})

  const filteredMeals = useMemo(() => {
    if (selectedCat === '全部') return mockMeals
    return mockMeals.filter(m => m.category === selectedCat)
  }, [selectedCat])

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const meal = mockMeals.find(m => m.id === id)
    return sum + (meal ? meal.price * qty : 0)
  }, 0)

  const addToCart = (meal: CanteenMeal) => {
    setCart(prev => ({ ...prev, [meal.id]: (prev[meal.id] || 0) + 1 }))
    Taro.showToast({ title: '已加入', icon: 'none' })
  }

  const handleCheckout = () => {
    if (cartCount === 0) { Taro.showToast({ title: '请先选择餐品', icon: 'none' }); return }
    console.log('[Canteen] 结算:', cart, '总价:', cartTotal)
    Taro.showModal({ title: '确认下单', content: `共${cartCount}份，合计 ¥${cartTotal}`, success: (res) => {
      if (res.confirm) {
        Taro.showToast({ title: '下单成功！取餐码 A' + Math.floor(Math.random() * 900 + 100), icon: 'none' })
        setCart({})
      }
    }})
  }

  return (
    <View>
      <ScrollView scrollY>
        <View className={styles.page}>
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
                    <Button className={styles.addBtn} onClick={() => addToCart(meal)}>+</Button>
                  </View>
                </View>
                {cart[meal.id] > 0 && (
                  <View style={{ position: 'absolute', right: 32, top: 32, width: 36, height: 36, borderRadius: 18, backgroundColor: '#F53F3F', color: '#fff', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text>{cart[meal.id]}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View className={styles.bottomBar}>
        <View className={styles.cartInfo}>
          <Text className={styles.cartCount}>购物车 {cartCount} 份</Text>
          <Text className={styles.cartPrice}>¥{cartTotal}</Text>
        </View>
        <Button className={styles.checkoutBtn} onClick={handleCheckout}>去结算</Button>
      </View>
    </View>
  )
}
export default CanteenPage

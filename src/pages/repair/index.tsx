import React, { useState, useMemo, useEffect } from 'react'
import { View, Text, ScrollView, Button, Input, Textarea, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatusTag from '@/components/StatusTag'
import { StorageService, generateId } from '@/utils/storage'
import type { RepairOrder, RepairPriority, RepairStatus } from '@/utils/storage'

const priorities = [
  { key: 'low', label: '低' }, { key: 'medium', label: '中' },
  { key: 'high', label: '高' }, { key: 'urgent', label: '紧急' }
]

const repairTypes = ['水电', '网络', '空调', '家具', '其他']

const assignees = ['张工', '李工', '王工']

const priorityTextMap: Record<RepairPriority, string> = {
  low: '低优先级',
  medium: '中优先级',
  high: '高优先级',
  urgent: '紧急'
}

const statusTextMap: Record<RepairStatus, string> = {
  pending: '待处理',
  assigned: '已派单',
  processing: '处理中',
  completed: '已完成',
  evaluated: '已评价',
  escalated: '已升级'
}

const RepairPage: React.FC = () => {
  const [tab, setTab] = useState<'list' | 'new'>('list')
  const [form, setForm] = useState({
    title: '',
    type: '水电',
    location: '',
    desc: '',
    priority: 'medium' as RepairPriority,
    images: [] as string[]
  })
  const [orders, setOrders] = useState<RepairOrder[]>([])

  const currentUser = StorageService.getCurrentUser()

  const loadOrders = () => {
    const allOrders = StorageService.getRepairOrders()
    const userOrders = currentUser
      ? allOrders.filter(o => o.userId === currentUser.id)
      : allOrders

    const now = Date.now()
    const updatedOrders = userOrders.map(order => {
      if (order.priority === 'urgent' && order.status === 'assigned') {
        const createdAt = new Date(order.createdAt).getTime()
        if (now - createdAt > 30 * 60 * 1000) {
          const updated: RepairOrder = {
            ...order,
            status: 'escalated',
            statusText: '已升级',
            progress: [
              ...order.progress,
              { time: new Date().toLocaleString('zh-CN'), desc: '工单超时，已自动升级处理' }
            ]
          }
          StorageService.updateRepairOrder(order.id, {
            status: 'escalated',
            statusText: '已升级',
            progress: updated.progress
          })
          return updated
        }
      }
      return order
    })

    setOrders(updatedOrders.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ))
  }

  useEffect(() => {
    loadOrders()
  }, [tab])

  const filtered = useMemo(() => orders, [orders])

  const handleSubmit = () => {
    if (!form.title || !form.location || !form.desc) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    const user = StorageService.getCurrentUser()
    if (!user) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      return
    }

    const randomAssignee = assignees[Math.floor(Math.random() * assignees.length)]
    const now = new Date()
    const nowStr = now.toLocaleString('zh-CN')

    const newOrder: RepairOrder = {
      id: generateId(),
      title: form.title,
      type: form.type,
      priority: form.priority,
      priorityText: priorityTextMap[form.priority],
      status: 'assigned',
      statusText: statusTextMap['assigned'],
      description: form.desc,
      images: form.images,
      location: form.location,
      userId: user.id,
      userName: user.name,
      assignee: randomAssignee,
      progress: [
        { time: nowStr, desc: '工单已提交，等待处理' },
        { time: nowStr, desc: `系统已自动分配维修工：${randomAssignee}` }
      ],
      createdAt: now.toISOString()
    }

    StorageService.addRepairOrder(newOrder)

    StorageService.addMessage({
      id: generateId(),
      userId: user.id,
      title: '报修工单已受理',
      content: `您的报修工单"${form.title}"已受理，维修工 ${randomAssignee} 将尽快为您处理。`,
      type: 'repair',
      read: false,
      createdAt: now.toISOString()
    })

    Taro.showToast({ title: '已提交报修', icon: 'success' })
    setForm({
      title: '',
      type: '水电',
      location: '',
      desc: '',
      priority: 'medium',
      images: []
    })
    setTab('list')
  }

  const handleUpload = () => {
    Taro.chooseImage({
      count: 3,
      success: (res) => {
        setForm({ ...form, images: [...form.images, ...res.tempFilePaths] })
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

  return (
    <View>
      <ScrollView scrollY>
        <View className={styles.page}>
          <View className={styles.tabs}>
            <View className={classnames(styles.tab, tab === 'list' && styles.tabActive)} onClick={() => setTab('list')}>
              <Text>报修记录</Text>
            </View>
            <View className={classnames(styles.tab, tab === 'new' && styles.tabActive)} onClick={() => setTab('new')}>
              <Text>发起报修</Text>
            </View>
          </View>

          {tab === 'list' ? (
            filtered.length === 0 ? (
              <View className={styles.emptyState}>
                <Text className={styles.emptyText}>暂无报修记录</Text>
              </View>
            ) : (
              filtered.map(r => (
                <View key={r.id} className={styles.repairCard}>
                  <View className={styles.repairHeader}>
                    <Text className={styles.repairTitle}>{r.title}</Text>
                    <View style={{ display: 'flex', gap: 8 }}>
                      <StatusTag status={r.priority} text={r.priorityText} />
                      <StatusTag status={r.status} text={r.statusText} />
                    </View>
                  </View>
                  <Text className={styles.repairDesc}>{r.description}</Text>
                  <View className={styles.repairMeta}>
                    <View className={styles.metaItem}><Text>📍</Text><Text>{r.location}</Text></View>
                    <View className={styles.metaItem}><Text>🕐</Text><Text>{formatDate(r.createdAt)}</Text></View>
                    <View className={styles.metaItem}><Text>🔧</Text><Text>{r.type}</Text></View>
                    {r.assignee && <View className={styles.metaItem}><Text>👨‍🔧</Text><Text>{r.assignee}</Text></View>}
                  </View>
                  {r.images.length > 0 && (
                    <View className={styles.imageRow}>
                      {r.images.map((img, i) => <Image key={i} className={styles.repairImg} src={img} mode="aspectFill" />)}
                    </View>
                  )}
                  {r.progress && r.progress.length > 0 && (
                    <View className={styles.progressList}>
                      <Text className={styles.progressTitle}>处理进度</Text>
                      {r.progress.map((p, i) => (
                        <View key={i} className={styles.progressItem}>
                          <View className={styles.progressDot} />
                          <Text className={styles.progressTime}>{p.time}</Text>
                          <Text className={styles.progressDesc}>{p.desc}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))
            )
          ) : (
            <View className={styles.formCard}>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>故障标题 <Text className={styles.required}>*</Text></Text>
                <Input className={styles.formInput} placeholder="简述故障问题" value={form.title} onInput={e => setForm({ ...form, title: e.detail.value })} />
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>故障类型 <Text className={styles.required}>*</Text></Text>
                <View className={styles.priorityRow}>
                  {repairTypes.map(t => (
                    <View key={t}
                      className={classnames(
                        styles.priorityTag,
                        form.type === t && styles.priorityActiveMed
                      )}
                      onClick={() => setForm({ ...form, type: t })}
                    >
                      <Text>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>故障位置 <Text className={styles.required}>*</Text></Text>
                <Input className={styles.formInput} placeholder="如 A栋8层802室" value={form.location} onInput={e => setForm({ ...form, location: e.detail.value })} />
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>优先级</Text>
                <View className={styles.priorityRow}>
                  {priorities.map(p => (
                    <View key={p.key}
                      className={classnames(
                        styles.priorityTag,
                        form.priority === p.key && p.key === 'low' && styles.priorityActiveLow,
                        form.priority === p.key && p.key === 'medium' && styles.priorityActiveMed,
                        form.priority === p.key && p.key === 'high' && styles.priorityActiveHigh,
                        form.priority === p.key && p.key === 'urgent' && styles.priorityActiveUrgent
                      )}
                      onClick={() => setForm({ ...form, priority: p.key as RepairPriority })}
                    >
                      <Text>{p.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>故障描述 <Text className={styles.required}>*</Text></Text>
                <Textarea className={styles.formTextarea} placeholder="请详细描述故障情况..." value={form.desc} onInput={e => setForm({ ...form, desc: e.detail.value })} />
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>上传照片</Text>
                <View className={styles.uploadRow}>
                  {form.images.map((img, i) => <Image key={i} className={styles.uploadImg} src={img} mode="aspectFill" />)}
                  {form.images.length < 3 && (
                    <View className={styles.uploadBox} onClick={handleUpload}>
                      <Text className={styles.uploadIcon}>+</Text>
                      <Text className={styles.uploadText}>上传</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      {tab === 'new' && (
        <View className={styles.bottomBar}>
          <Button className={styles.submitBtn} onClick={handleSubmit}>提交报修</Button>
        </View>
      )}
    </View>
  )
}
export default RepairPage

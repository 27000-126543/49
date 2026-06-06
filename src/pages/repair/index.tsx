import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Button, Input, Textarea, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatusTag from '@/components/StatusTag'
import { mockRepairs } from '@/data/mockRepair'
import type { RepairOrder } from '@/types'

const priorities = [
  { key: 'low', label: '低' }, { key: 'medium', label: '中' },
  { key: 'high', label: '高' }, { key: 'urgent', label: '紧急' }
]

const RepairPage: React.FC = () => {
  const [tab, setTab] = useState<'list' | 'new'>('list')
  const [form, setForm] = useState({ title: '', type: '空调维修', location: '', desc: '', priority: 'medium' as RepairOrder['priority'], images: [] as string[] })

  const filtered = useMemo(() => tab === 'list' ? mockRepairs : [], [tab])

  const handleSubmit = () => {
    if (!form.title || !form.location || !form.desc) { Taro.showToast({ title: '请填写完整信息', icon: 'none' }); return }
    console.log('[Repair] 提交报修:', form)
    Taro.showToast({ title: '已提交报修', icon: 'success' })
    setTab('list')
  }

  const handleUpload = () => {
    Taro.chooseImage({ count: 3, success: (res) => {
      console.log('[Repair] 上传图片:', res.tempFilePaths)
      setForm({ ...form, images: [...form.images, ...res.tempFilePaths] })
    }})
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

          {tab === 'list' ? filtered.map(r => (
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
                <View className={styles.metaItem}><Text>🕐</Text><Text>{r.createTime}</Text></View>
                {r.assignee && <View className={styles.metaItem}><Text>👨‍🔧</Text><Text>{r.assignee}</Text></View>}
              </View>
              {r.images.length > 0 && (
                <View className={styles.imageRow}>
                  {r.images.map((img, i) => <Image key={i} className={styles.repairImg} src={img} mode="aspectFill" />)}
                </View>
              )}
              {r.progress && r.progress.length > 0 && (
                <View className={styles.progressList}>
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
          )) : (
            <View className={styles.formCard}>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>故障标题 <Text className={styles.required}>*</Text></Text>
                <Input className={styles.formInput} placeholder="简述故障问题" value={form.title} onInput={e => setForm({ ...form, title: e.detail.value })} />
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>故障位置 <Text className={styles.required}>*</Text></Text>
                <Input className={styles.formInput} placeholder="如 A栋8层802室" value={form.location} onInput={e => setForm({ ...form, location: e.detail.value })} />
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>故障描述 <Text className={styles.required}>*</Text></Text>
                <Textarea className={styles.formTextarea} placeholder="请详细描述故障情况..." value={form.desc} onInput={e => setForm({ ...form, desc: e.detail.value })} />
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
                      onClick={() => setForm({ ...form, priority: p.key as RepairOrder['priority'] })}
                    >
                      <Text>{p.label}</Text>
                    </View>
                  ))}
                </View>
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

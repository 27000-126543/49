import React, { useState } from 'react'
import { View, Text, ScrollView, Button, Input, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatusTag from '@/components/StatusTag'
import { mockVisitors } from '@/data/mockVisitor'

const VisitorBookingPage: React.FC = () => {
  const [tab, setTab] = useState<'list' | 'form'>('list')
  const [form, setForm] = useState({ name: '', phone: '', company: '', reason: '', date: '', time: '' })

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.reason) { Taro.showToast({ title: '请填写完整信息', icon: 'none' }); return }
    console.log('[VisitorBooking] 提交访客预约:', form)
    Taro.showToast({ title: '已提交，等待审批', icon: 'success' })
    setTab('list'); setForm({ name: '', phone: '', company: '', reason: '', date: '', time: '' })
  }

  const handleApprove = (id: string, approved: boolean) => {
    console.log('[VisitorBooking] 审批:', id, approved ? '通过' : '拒绝')
    Taro.showToast({ title: approved ? '已通过' : '已拒绝', icon: 'success' })
  }

  return (
    <ScrollView scrollY>
      <View className={styles.page}>
        <View style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          <View className={classnames(styles.actionBtn, { [styles.btnApprove]: tab === 'list' })} style={{ borderRadius: 48, padding: '0 32rpx' }} onClick={() => setTab('list')}>
            <Text style={{ color: tab === 'list' ? '#fff' : '#86909C', fontWeight: 500 }}>访客记录</Text>
          </View>
          <View className={classnames(styles.actionBtn, { [styles.btnApprove]: tab === 'form' })} style={{ borderRadius: 48, padding: '0 32rpx' }} onClick={() => setTab('form')}>
            <Text style={{ color: tab === 'form' ? '#fff' : '#86909C', fontWeight: 500 }}>新增预约</Text>
          </View>
        </View>

        {tab === 'list' ? mockVisitors.map(v => (
          <View key={v.id} className={styles.listCard}>
            <View className={styles.listHeader}>
              <View>
                <Text className={styles.visitorName}>{v.name}</Text>
                <Text className={styles.visitorCompany}>{v.company}</Text>
              </View>
              <StatusTag status={v.status} text={
                v.status === 'pending' ? '待审批' : v.status === 'approved' ? '已通过' :
                v.status === 'rejected' ? '已拒绝' : v.status === 'visited' ? '已到访' : '已过期'
              } />
            </View>
            <Text className={styles.visitorReason}>事由：{v.reason}</Text>
            <View className={styles.visitorMeta}>
              <Text className={styles.visitorTime}>拜访：{v.hostName}（{v.hostDept}）</Text>
              <Text className={styles.visitorTime}>{v.visitDate} {v.visitTime}</Text>
            </View>
            {v.status === 'approved' && (
              <View className={styles.qrBox}>
                <Text className={styles.qrCode}>📱</Text>
                <Text className={styles.qrText}>通行码：{v.qrCode}</Text>
                <Text className={styles.qrExpire}>有效期至 {v.expireTime}</Text>
              </View>
            )}
            {v.status === 'pending' && (
              <View className={styles.actionRow}>
                <Button className={classnames(styles.actionBtn, styles.btnReject)} onClick={() => handleApprove(v.id, false)}>拒绝</Button>
                <Button className={classnames(styles.actionBtn, styles.btnApprove)} onClick={() => handleApprove(v.id, true)}>通过</Button>
              </View>
            )}
          </View>
        )) : (
          <View className={styles.formCard}>
            <Text className={styles.formTitle}>访客信息</Text>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>访客姓名 *</Text>
              <Input className={styles.formInput} placeholder="请输入访客姓名" value={form.name} onInput={e => setForm({ ...form, name: e.detail.value })} />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>联系电话 *</Text>
              <Input className={styles.formInput} placeholder="请输入联系电话" value={form.phone} onInput={e => setForm({ ...form, phone: e.detail.value })} />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>所属公司</Text>
              <Input className={styles.formInput} placeholder="请输入所属公司" value={form.company} onInput={e => setForm({ ...form, company: e.detail.value })} />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>来访事由 *</Text>
              <Textarea className={styles.formTextarea} placeholder="请描述来访事由" value={form.reason} onInput={e => setForm({ ...form, reason: e.detail.value })} />
            </View>
            <Button className={styles.submitBtn} onClick={handleSubmit}>提交预约</Button>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
export default VisitorBookingPage

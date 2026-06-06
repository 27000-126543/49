import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Button, Input, Textarea } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import StatusTag from '@/components/StatusTag'
import { StorageService, generateId, generateQRCode } from '@/utils/storage'
import type { Visitor } from '@/utils/storage'

const defaultDate = new Date().toISOString().split('T')[0]

const VisitorBookingPage: React.FC = () => {
  const [tab, setTab] = useState<'list' | 'form'>('list')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    company: '',
    reason: '',
    date: defaultDate,
    time: '09:00'
  })
  const [, forceUpdate] = useState(0)

  const user = StorageService.getCurrentUser()
  const visitors = StorageService.getVisitors()

  const myVisitors = useMemo(() => {
    if (!user) return [] as Visitor[]
    return visitors.filter((v) => v.hostId === user.id)
  }, [user, visitors])

  const refresh = () => forceUpdate((n) => n + 1)

  const handleSubmit = () => {
    if (!user) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    if (!form.name || !form.phone || !form.reason || !form.date || !form.time) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    const id = generateId()
    const newVisitor: Visitor = {
      id,
      name: form.name,
      phone: form.phone,
      company: form.company || '',
      reason: form.reason,
      hostId: user.id,
      hostName: user.name,
      hostDept: user.department || '',
      visitDate: form.date,
      visitTime: form.time,
      status: 'pending',
      qrCode: '',
      expireTime: '',
      createdAt: new Date().toISOString()
    }

    StorageService.addVisitor(newVisitor)
    StorageService.addMessage({
      id: generateId(),
      userId: user.id,
      title: '访客预约待审批',
      content: `${form.name}（${form.company || '未填公司'}）预约于${form.date} ${form.time}拜访您，事由：${form.reason}`,
      type: 'approval',
      read: false,
      createdAt: new Date().toISOString()
    })

    Taro.showToast({ title: '已提交，等待审批', icon: 'success' })
    setTab('list')
    setForm({ name: '', phone: '', company: '', reason: '', date: defaultDate, time: '09:00' })
    refresh()
  }

  const handleApprove = (id: string, approved: boolean) => {
    if (!user) return
    const visitor = visitors.find((v) => v.id === id)
    if (!visitor) return

    if (approved) {
      const expire = new Date()
      expire.setHours(expire.getHours() + 24)
      StorageService.updateVisitor(id, {
        status: 'approved',
        qrCode: generateQRCode('VISITOR', id),
        expireTime: expire.toISOString()
      })
      StorageService.addMessage({
        id: generateId(),
        userId: user.id,
        title: '访客预约已通过',
        content: `您已批准${visitor.name}于${visitor.visitDate} ${visitor.visitTime}的拜访申请`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString()
      })
    } else {
      StorageService.updateVisitor(id, { status: 'rejected' })
      StorageService.addMessage({
        id: generateId(),
        userId: user.id,
        title: '访客预约已拒绝',
        content: `您已拒绝${visitor.name}于${visitor.visitDate} ${visitor.visitTime}的拜访申请`,
        type: 'system',
        read: false,
        createdAt: new Date().toISOString()
      })
    }

    Taro.showToast({ title: approved ? '已通过' : '已拒绝', icon: 'success' })
    refresh()
  }

  const formatExpireTime = (iso: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
      .getDate()
      .toString()
      .padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
  }

  return (
    <ScrollView scrollY>
      <View className={styles.page}>
        <View style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          <View
            className={classnames(styles.actionBtn, { [styles.btnApprove]: tab === 'list' })}
            style={{ borderRadius: 48, padding: '0 32rpx' }}
            onClick={() => setTab('list')}
          >
            <Text style={{ color: tab === 'list' ? '#fff' : '#86909C', fontWeight: 500 }}>
              访客记录
            </Text>
          </View>
          <View
            className={classnames(styles.actionBtn, { [styles.btnApprove]: tab === 'form' })}
            style={{ borderRadius: 48, padding: '0 32rpx' }}
            onClick={() => setTab('form')}
          >
            <Text style={{ color: tab === 'form' ? '#fff' : '#86909C', fontWeight: 500 }}>
              新增预约
            </Text>
          </View>
        </View>

        {tab === 'list' ? (
          myVisitors.length > 0 ? (
            myVisitors.map((v) => (
              <View key={v.id} className={styles.listCard}>
                <View className={styles.listHeader}>
                  <View>
                    <Text className={styles.visitorName}>{v.name}</Text>
                    <Text className={styles.visitorCompany}>{v.company || '未填写公司'}</Text>
                  </View>
                  <StatusTag
                    status={v.status}
                    text={
                      v.status === 'pending'
                        ? '待审批'
                        : v.status === 'approved'
                        ? '已通过'
                        : v.status === 'rejected'
                        ? '已拒绝'
                        : v.status === 'visited'
                        ? '已到访'
                        : '已过期'
                    }
                  />
                </View>
                <Text className={styles.visitorReason}>事由：{v.reason}</Text>
                <View className={styles.visitorMeta}>
                  <Text className={styles.visitorTime}>
                    拜访：{v.hostName}（{v.hostDept || '—'}）
                  </Text>
                  <Text className={styles.visitorTime}>
                    {v.visitDate} {v.visitTime}
                  </Text>
                </View>
                {v.status === 'approved' && (
                  <View className={styles.qrBox}>
                    <Text className={styles.qrCode}>📱</Text>
                    <Text className={styles.qrText}>通行码：{v.qrCode}</Text>
                    <Text className={styles.qrExpire}>有效期至 {formatExpireTime(v.expireTime)}</Text>
                  </View>
                )}
                {v.status === 'pending' && v.hostId === user?.id && (
                  <View className={styles.actionRow}>
                    <Button
                      className={classnames(styles.actionBtn, styles.btnReject)}
                      onClick={() => handleApprove(v.id, false)}
                    >
                      拒绝
                    </Button>
                    <Button
                      className={classnames(styles.actionBtn, styles.btnApprove)}
                      onClick={() => handleApprove(v.id, true)}
                    >
                      通过
                    </Button>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={{ textAlign: 'center', padding: '80rpx 0', color: '#86909C' }}>
              <Text style={{ fontSize: '64rpx' }}>📋</Text>
              <View style={{ marginTop: 16 }}>
                <Text>暂无访客记录</Text>
              </View>
            </View>
          )
        ) : (
          <View className={styles.formCard}>
            <Text className={styles.formTitle}>访客信息</Text>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>访客姓名 *</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入访客姓名"
                value={form.name}
                onInput={(e) => setForm({ ...form, name: e.detail.value })}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>联系电话 *</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入联系电话"
                value={form.phone}
                onInput={(e) => setForm({ ...form, phone: e.detail.value })}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>所属公司</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入所属公司"
                value={form.company}
                onInput={(e) => setForm({ ...form, company: e.detail.value })}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>来访事由 *</Text>
              <Textarea
                className={styles.formTextarea}
                placeholder="请描述来访事由"
                value={form.reason}
                onInput={(e) => setForm({ ...form, reason: e.detail.value })}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>拜访日期 *</Text>
              <Input
                className={styles.formInput}
                type="text"
                placeholder="YYYY-MM-DD"
                value={form.date}
                onInput={(e) => setForm({ ...form, date: e.detail.value })}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>拜访时间 *</Text>
              <Input
                className={styles.formInput}
                type="text"
                placeholder="HH:MM"
                value={form.time}
                onInput={(e) => setForm({ ...form, time: e.detail.value })}
              />
            </View>
            <Button className={styles.submitBtn} onClick={handleSubmit}>
              提交预约
            </Button>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
export default VisitorBookingPage

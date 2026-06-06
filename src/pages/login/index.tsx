import React, { useState } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import styles from './index.module.scss'
import { useUserStore } from '@/store/userStore'

const LoginPage: React.FC = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [enterpriseName, setEnterpriseName] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useUserStore()

  const handleSubmit = async () => {
    if (!phone || !password) {
      Taro.showToast({ title: '请填写手机号和密码', icon: 'none' })
      return
    }
    if (tab === 'register' && (!name || !enterpriseName)) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      let success = false
      if (tab === 'login') {
        success = await login(phone, password)
      } else {
        success = await register({ phone, password, name, enterpriseName })
      }
      if (success) {
        Taro.showToast({ title: tab === 'login' ? '登录成功' : '注册成功', icon: 'success' })
        setTimeout(() => {
          Taro.switchTab({ url: '/pages/home/index' })
        }, 1000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className={styles.page}>
      <View className={styles.logoSection}>
        <Text className={styles.logoIcon}>🏢</Text>
        <Text className={styles.appName}>智慧园区</Text>
        <Text className={styles.appDesc}>企业数字化综合服务平台</Text>
      </View>

      <View className={styles.loginCard}>
        <View className={styles.tabBar}>
          <View
            className={classnames(styles.tabItem, tab === 'login' && styles.tabActive)}
            onClick={() => setTab('login')}
          >
            <Text>登录</Text>
          </View>
          <View
            className={classnames(styles.tabItem, tab === 'register' && styles.tabActive)}
            onClick={() => setTab('register')}
          >
            <Text>注册企业</Text>
          </View>
        </View>

        {tab === 'register' && (
          <>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>企业名称</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入企业名称"
                value={enterpriseName}
                onInput={(e) => setEnterpriseName(e.detail.value)}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>您的姓名</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入管理员姓名"
                value={name}
                onInput={(e) => setName(e.detail.value)}
              />
            </View>
          </>
        )}

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>手机号</Text>
          <Input
            className={styles.formInput}
            type="number"
            placeholder="请输入手机号"
            value={phone}
            onInput={(e) => setPhone(e.detail.value)}
            maxLength={11}
          />
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>密码</Text>
          <Input
            className={styles.formInput}
            password
            placeholder="请输入密码"
            value={password}
            onInput={(e) => setPassword(e.detail.value)}
          />
        </View>

        <Button className={styles.submitBtn} loading={loading} onClick={handleSubmit}>
          {tab === 'login' ? '登 录' : '注 册'}
        </Button>

        <Text className={styles.tipText}>
          {tab === 'login'
            ? '员工账号初始密码为123456\n登录后可在"我的"页面修改'
            : '注册即成为企业管理员\n可邀请员工并分配门禁权限'}
        </Text>
      </View>
    </View>
  )
}

export default LoginPage

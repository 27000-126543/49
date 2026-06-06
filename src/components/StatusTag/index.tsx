import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'
import { getStatusColor, getStatusBgColor } from '@/utils'

interface StatusTagProps {
  status: string
  text: string
}

const StatusTag: React.FC<StatusTagProps> = ({ status, text }) => {
  return (
    <View
      className={styles.tag}
      style={{
        color: getStatusColor(status),
        backgroundColor: getStatusBgColor(status)
      }}
    >
      <Text>{text}</Text>
    </View>
  )
}

export default StatusTag

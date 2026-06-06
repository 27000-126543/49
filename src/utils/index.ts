export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

export const formatMoney = (num: number): string => {
  return '¥' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: '#FF7D00',
    approved: '#00B42A',
    ongoing: '#165DFF',
    completed: '#00B42A',
    cancelled: '#86909C',
    rejected: '#F53F3F',
    visited: '#00B42A',
    expired: '#86909C',
    assigned: '#165DFF',
    processing: '#FF7D00',
    evaluated: '#00B42A',
    available: '#00B42A',
    occupied: '#F53F3F',
    maintenance: '#FF7D00',
    reserved: '#722ED1',
    paid: '#165DFF',
    picked: '#00B42A',
    refunded: '#86909C',
    normal: '#00B42A',
    warning: '#FF7D00',
    danger: '#F53F3F',
    low: '#86909C',
    medium: '#165DFF',
    high: '#FF7D00',
    urgent: '#F53F3F'
  }
  return colorMap[status] || '#165DFF'
}

export const getStatusBgColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: 'rgba(255, 125, 0, 0.1)',
    approved: 'rgba(0, 180, 42, 0.1)',
    ongoing: 'rgba(22, 93, 255, 0.1)',
    completed: 'rgba(0, 180, 42, 0.1)',
    cancelled: 'rgba(134, 144, 156, 0.1)',
    rejected: 'rgba(245, 63, 63, 0.1)',
    visited: 'rgba(0, 180, 42, 0.1)',
    expired: 'rgba(134, 144, 156, 0.1)',
    assigned: 'rgba(22, 93, 255, 0.1)',
    processing: 'rgba(255, 125, 0, 0.1)',
    evaluated: 'rgba(0, 180, 42, 0.1)',
    available: 'rgba(0, 180, 42, 0.1)',
    occupied: 'rgba(245, 63, 63, 0.1)',
    maintenance: 'rgba(255, 125, 0, 0.1)',
    reserved: 'rgba(114, 46, 209, 0.1)',
    paid: 'rgba(22, 93, 255, 0.1)',
    picked: 'rgba(0, 180, 42, 0.1)',
    refunded: 'rgba(134, 144, 156, 0.1)',
    normal: 'rgba(0, 180, 42, 0.1)',
    warning: 'rgba(255, 125, 0, 0.1)',
    danger: 'rgba(245, 63, 63, 0.1)',
    low: 'rgba(134, 144, 156, 0.1)',
    medium: 'rgba(22, 93, 255, 0.1)',
    high: 'rgba(255, 125, 0, 0.1)',
    urgent: 'rgba(245, 63, 63, 0.1)'
  }
  return colorMap[status] || 'rgba(22, 93, 255, 0.1)'
}

export default defineAppConfig({
  pages: [
    'pages/login/index',
    'pages/home/index',
    'pages/services/index',
    'pages/booking/index',
    'pages/messages/index',
    'pages/profile/index',
    'pages/meeting-booking/index',
    'pages/desk-booking/index',
    'pages/visitor-booking/index',
    'pages/repair/index',
    'pages/canteen/index',
    'pages/energy/index',
    'pages/admin/index',
    'pages/enterprise/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '智慧园区',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f5f7fa'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#165DFF',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/services/index',
        text: '服务'
      },
      {
        pagePath: 'pages/booking/index',
        text: '预约'
      },
      {
        pagePath: 'pages/messages/index',
        text: '消息'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})

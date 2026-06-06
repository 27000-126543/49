import type { UserInfo } from '@/types'

export const mockUser: UserInfo = {
  id: 'u001',
  name: '张明远',
  avatar: 'https://picsum.photos/id/1005/200/200',
  phone: '138****8888',
  role: 'executive',
  roleName: '企业高管',
  enterpriseId: 'e001',
  enterpriseName: '智云科技有限公司',
  department: '战略发展部',
  position: '高级副总裁',
  badgeNumber: 'B20240001',
  accessFloors: [1, 2, 3, 5, 8, 10, 11, 12]
}

export const mockEmployees: (UserInfo & { joinDate: string })[] = [
  {
    id: 'u001',
    name: '张明远',
    avatar: 'https://picsum.photos/id/1005/200/200',
    phone: '138****8888',
    role: 'executive',
    roleName: '企业高管',
    enterpriseId: 'e001',
    enterpriseName: '智云科技有限公司',
    department: '战略发展部',
    position: '高级副总裁',
    badgeNumber: 'B20240001',
    accessFloors: [1, 2, 3, 5, 8, 10, 11, 12],
    joinDate: '2022-03-15'
  },
  {
    id: 'u002',
    name: '李思琪',
    avatar: 'https://picsum.photos/id/1011/200/200',
    phone: '139****6666',
    role: 'finance',
    roleName: '财务人员',
    enterpriseId: 'e001',
    enterpriseName: '智云科技有限公司',
    department: '财务部',
    position: '财务总监',
    badgeNumber: 'B20240002',
    accessFloors: [1, 2, 3, 7, 8],
    joinDate: '2022-05-20'
  },
  {
    id: 'u003',
    name: '王小刚',
    avatar: 'https://picsum.photos/id/1012/200/200',
    phone: '137****5555',
    role: 'employee',
    roleName: '普通员工',
    enterpriseId: 'e001',
    enterpriseName: '智云科技有限公司',
    department: '研发部',
    position: '高级工程师',
    badgeNumber: 'B20240003',
    accessFloors: [1, 3, 5],
    joinDate: '2023-01-10'
  },
  {
    id: 'u004',
    name: '陈雨婷',
    avatar: 'https://picsum.photos/id/1013/200/200',
    phone: '136****4444',
    role: 'employee',
    roleName: '普通员工',
    enterpriseId: 'e001',
    enterpriseName: '智云科技有限公司',
    department: '市场部',
    position: '市场经理',
    badgeNumber: 'B20240004',
    accessFloors: [1, 3, 6],
    joinDate: '2023-04-08'
  },
  {
    id: 'u005',
    name: '刘子豪',
    avatar: 'https://picsum.photos/id/1014/200/200',
    phone: '135****3333',
    role: 'employee',
    roleName: '普通员工',
    enterpriseId: 'e001',
    enterpriseName: '智云科技有限公司',
    department: '人力资源部',
    position: 'HR经理',
    badgeNumber: 'B20240005',
    accessFloors: [1, 3, 9],
    joinDate: '2022-11-25'
  },
  {
    id: 'u006',
    name: '赵雅文',
    avatar: 'https://picsum.photos/id/1027/200/200',
    phone: '134****2222',
    role: 'employee',
    roleName: '普通员工',
    enterpriseId: 'e001',
    enterpriseName: '智云科技有限公司',
    department: '设计部',
    position: 'UI设计师',
    badgeNumber: 'B20240006',
    accessFloors: [1, 3, 5],
    joinDate: '2023-07-18'
  }
]

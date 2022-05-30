import Layout from '@/layout'
export default {
  path: '/attendances',
  component: Layout,
  children: [{
    path: '', // 作为默认渲染路由
    name: 'attendances',
    component: () => import('@/views/attendances/attendances.vue'),
    meta: { title: '考勤管理', icon: 'skill' }
  }]
}

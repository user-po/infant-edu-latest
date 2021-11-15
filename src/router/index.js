import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'el-icon-house' }
    }]
  }
]
export const asyncRoutes = [
  {
    path: '/teacher',
    component: Layout,
    redirect: '/teacher/take',
    name: 'Teacher',
    meta: { roles: ['teacher'], title: '教师', icon: 'el-icon-s-custom' },
    children: [
      {
        path: 'take',
        name: 'Take',
        component: () => import('@/views/teacher/take'),
        meta: { title: '上课' }
      },
      {
        path: 'prepare',
        name: 'Prepare',
        component: () => import('@/views/teacher/take'),
        meta: { title: '备课' }
      },
      {
        path: 'enter',
        name: 'Enter',
        component: () => import('@/views/teacher/enter'),
        meta: { title: '学生成绩录入' }
      },
      {
        path: 'manage-student',
        name: 'ManageStudent',
        component: () => import('@/views/teacher/manage-student/index'),
        meta: { title: '学生信息管理' }
      },
      // {
      //   path: 'teacher-info',
      //   name: 'TeacherInfo',
      //   component: () => import('@/views/teacher/teacher-info'),
      //   meta: { title: '信息管理' }
      // },
      // {
      //   path: 'teacher-notification',
      //   name: 'TeacherNotification',
      //   component: () => import('@/views/teacher/teacher-notification'),
      //   meta: { title: '消息通知' }
      // }
    ]
  },
  {
    path: '/data-center',
    name: 'DataCenter',
    component: Layout,
    meta: { roles: ['teacher'],title: '数据中心',icon:'tree' },
    children: [
      {
        path: 'complete-rate',
        name: 'CompleteRate',
        component: () => import('@/views/teacher/data-center/complete-rate'),
        meta: { title: '达标率统计' }
      },
      {
        path:'student-homework_complete-rate',
        name:'studentHomeworkCompleteRate',
        component: () => import('@/views/teacher/data-center/student-homework_complete-rate'),
        meta: { title: '学生作业完成率' }
      },
      {
        path: 'stu-class-info',
        name: 'StuClassInfo',
        component: () => import('@/views/teacher/data-center/stu-class-info'),
        meta: { title: '学生课程信息' }
      },
      {
        path: 'homework-com-rate',
        name: 'HomeworkComRate',
        component: () => import('@/views/teacher/data-center/homework-com-rate'),
        meta: { title: '班级作业完成率' }
      }]
  },
  {
    path: '/data-center',
    name: 'DataCenter',
    component: Layout,
    meta: { roles: ['nursery'],title: '数据中心',icon:'tree' },
    children: [
      {
        path: 'big-class',
        name: 'bigClass',
        component: () => import('@/views/nursery/data-center/bigClass'),
        meta: { title: '大班' }
      },
      {
        path: 'middle-class',
        name: 'middleClass',
        component: () => import('@/views/nursery/data-center/middleClass'),
        meta: { title: '中班' }
      },
      {
        path: 'small-class',
        name: 'smallClass',
        component: () => import('@/views/nursery/data-center/smallClass'),
        meta: { title: '小班' }
      },
    ]
  },
  ,
  {
    path: '/data-center',
    name: 'DataCenter',
    component: Layout,
    meta: { roles: ['header-quarters'],title: '数据中心',icon:'tree' },
    children: [
      {
        path: 'complete-rate',
        name: 'CompleteRate',
        component: () => import('@/views/header-quarters/data-center/complete-rate'),
        meta: { title: '达标率统计' }
      },
      {
        path: 'cumulative-complete-rate',
        name: 'CumulativeCompleteRate',
        component: () => import('@/views/header-quarters/data-center/cumulative-complete-rate'),
        meta: { title: '累计达标率统计' }
      },
      {
        path: 'stu-class-info',
        name: 'StuClassInfo',
        component: () => import('@/views/header-quarters/data-center/stu-class-info'),
        meta: { title: '学生课程信息' }
      },
      {
        path: 'homework-com-rate',
        name: 'HomeworkComRate',
        component: () => import('@/views/header-quarters/data-center/homework-com-rate'),
        meta: { title: '作业完成率' }
      }]
  },
  {
    path: '/nursery',
    name: 'Nursery',
    component: Layout,
    redirect: '/nursery/manage-class',
    meta: {
      roles: ['nursery'],
      title: '机构/幼儿园',
      icon: 'el-icon-school'
    },
    children: [
      {
        path: 'manage-class',
        name: 'ManageClass',
        component: () => import('@/views/nursery/manage-class'),
        meta: { title: '班级管理' }
      },
      {
        path: 'manage-teacher',
        name: 'ManageTeacher',
        component: () => import('@/views/nursery/manage-teacher'),
        meta: { title: '教师管理' }
      },
      // {
      //   path: 'nursery-info',
      //   name: 'NurseryInfo',
      //   component: () => import('@/views/nursery/nursery-info'),
      //   meta: { title: '机构信息管理' }
      // },
      // {
      //   path: 'nursery-notification',
      //   name: 'TeacherNotification',
      //   component: () => import('@/views/nursery/nursery-notification'),
      //   meta: { title: '消息通知' }
      // }
      ]
  },
  {
    path: '/header-quarters',
    name: 'HeaderQuarters',
    component: Layout,
    redirect: '/nursery/manage-class',
    meta: {
      roles: ['header-quarters'],
      title: '总部',
      icon: 'el-icon-s-flag'
    },
    children: [
      {
        path: 'expert-advise',
        name: 'ExpertAdvise',
        component: () => import('@/views/header-quarters/expert-advise/index'),
        meta: { title: '专家意见' }
      },
      // {
      //   path: 'header-quarters-info',
      //   name: 'HeaderQuartersInfo',
      //   component: () => import('@/views/header-quarters/header-quarters-info/index'),
      //   meta: { title: '总部平台信息' }
      // },
      {
        path: 'manage-course',
        name: 'ManageCourse',
        component: () => import('@/views/header-quarters/manage-course/index'),
        meta: { title: '课程管理' }
      },
      {
        path: 'manage-nursery',
        name: 'NurseryInfo',
        component: () => import('@/views/header-quarters/nursery-info/index'),
        meta: { title: '学校管理' }
      },
      // {
      //   path: 'contract',
      //   name: 'Contract',
      //   component: () => import('@/views/header-quarters/contract'),
      //   meta: { title: '合同管理' }
      // }
       ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

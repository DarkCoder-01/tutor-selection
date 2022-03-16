import Vue from 'vue'
import VueRouter from 'vue-router'

import { Message } from 'element-ui'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '/chooseTutor',
        component: () => import('../views/Student/ChooseTutor'),
      },
      {
        path: '/selectProgress',
        component: () => import('../views/SelectProgress.vue'),
      },
      {
        path: '/chooseStuent',
        component: () => import('../views/Tutor/ChooseStduent.vue'),
      },
      {
        path: '/mySpace',
        component: () => import('../views/Student/StudentInfo.vue'),
      },
      {
        path: '/tutorInfo',
        component: () => import('../views/Tutor/TutorInfo.vue'),
      },
      {
        path: '/myStudent',
        component: () => import('../views/Tutor/MyStudent'),
      },
      {
        path: '/myTutor',
        component: () => import('../views/Student/MyTutor'),
      },
      {
        path: '/activity',
        component: () => import('../views/Admin/ActivityManagement'),
      },
      {
        path: '/userManagement',
        component: () => import('../views/Admin/UserManagement'),
      },
      {
        path: '/tutorManagement',
        component: () => import('../views/Admin/TutorManagement'),
      },
      {
        path: '/studentManagement',
        component: () => import('../views/Admin/StudentManagement'),
      },
      {
        path: '/matchManagement',
        component: () => import('../views/Admin/MatchManagement'),
      },
    ]
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = localStorage.getItem("token");
  if (!token) {
    Message.info('未登录，请登录后访问')
    return next('/login')
  } else {
    next()
  }
})

export default router

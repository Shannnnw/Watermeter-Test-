import { createRouter, createWebHistory } from 'vue-router'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

import Welcome from '@/components/Welcome'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'

import WaterMeter from '@/components/watermeter/WaterMeter'
import WaterMeterPatient from '@/components/watermeter/WaterMeterPatient'
import WaterMeterData from '@/components/watermeter/WaterMeterData'

import StandBy from '@/components/standby/StandBy'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/watermeter',
      name: 'WaterMeter',
      component: WaterMeter,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'pkey/:pkey',
          name: 'WaterMeterPatient',
          component: WaterMeterPatient,
          children: [
            {
              path: 'dkey/:dkey',
              name: 'WaterMeterData',
              component: WaterMeterData
            }
          ]
        }
      ]
    },
    {
      path: '/standby',
      name: 'StandBy',
      component: StandBy
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !currentUser) next('login')
  else next()
})

export default router

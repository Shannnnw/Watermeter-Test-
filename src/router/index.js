import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'

import Welcome from '@/components/Welcome.vue'
import Login from '@/components/Login.vue'
import SignUp from '@/components/SignUp.vue'

import WaterMeter from '@/components/watermeter/WaterMeter.vue'
import WaterMeterPatient from '@/components/watermeter/WaterMeterPatient.vue'
import WaterMeterData from '@/components/watermeter/WaterMeterData.vue'

import StandBy from '@/components/standby/StandBy.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:pathMatch(.*)*',
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
  let currentUser = getAuth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !currentUser) next('login')
  else next()
})

export default router

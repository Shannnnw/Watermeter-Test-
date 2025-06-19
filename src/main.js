// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { createApp } from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import { createPinia } from 'pinia'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
const app = createApp(App)
app.config.compatConfig = { MODE: 3 }
app.config.productionTip = false

var config = {
  apiKey: 'AIzaSyC7AXXOqN2kw6eAQxSTmykCgGnnkEnAnWs',
  authDomain: 'vghtpepedutil.firebaseapp.com',
  databaseURL: 'https://vghtpepedutil.firebaseio.com',
  projectId: 'vghtpepedutil',
  storageBucket: '',
  messagingSenderId: '587122751148'
}
firebase.initializeApp(config)

firebase.auth().onAuthStateChanged(function () {
  app.use(router)
  app.use(store)
  app.use(createPinia())
  app.mount('#app')
})

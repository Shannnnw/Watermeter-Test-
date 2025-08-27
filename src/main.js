// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { createPinia } from 'pinia'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
const app = createApp(App)
app.config.productionTip = false

var config = {
  apiKey: 'AIzaSyC7AXXOqN2kw6eAQxSTmykCgGnnkEnAnWs',
  authDomain: 'vghtpepedutil.firebaseapp.com',
  databaseURL: 'https://vghtpepedutil.firebaseio.com',
  projectId: 'vghtpepedutil',
  storageBucket: '',
  messagingSenderId: '587122751148'
}
initializeApp(config)
const auth = getAuth()
getDatabase()

onAuthStateChanged(auth, function () {
  app.use(router)
  app.use(createPinia())
  app.mount('#app')
})

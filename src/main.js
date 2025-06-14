// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import firebase from 'firebase'
Vue.config.productionTip = false

var config = {
  apiKey: 'AIzaSyC7AXXOqN2kw6eAQxSTmykCgGnnkEnAnWs',
  authDomain: 'vghtpepedutil.firebaseapp.com',
  databaseURL: 'https://vghtpepedutil.firebaseio.com',
  projectId: 'vghtpepedutil',
  storageBucket: '',
  messagingSenderId: '587122751148'
}
firebase.initializeApp(config)

let app
firebase.auth().onAuthStateChanged(function (user) {
  if (!app) {
    app = new Vue({
      el: '#app',
      store,
      router,
      components: { App },
      template: '<App/>'
    })
  }
})

<template>
<div class="login">
    <h3>sign up</h3>
    <input type="text" v-model="email" placeholder="Email"><br>
    <input type="text" v-model="password" placeholder="Password"><br>
    <button v-on:click="signUp">Create New Account</button><br>
    <router-link to="/login">go back to login</router-link>
</div>
</template>

<script>
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
export default {
  name: 'signup',
  data: function () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    signUp: function () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        function (user) {
          console.log('accout created')
        },
        function (err) {
          console.log('err', err)
        }
      )
    }
  }
}
</script>

<style scoped>

</style>

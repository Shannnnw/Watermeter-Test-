<template>
<div class="login">
    <h3>sign up</h3>
    <input type="text" v-model="email" placeholder="Email"><br>
    <input type="text" v-model="password" placeholder="Password"><br>
    <button v-on:click="signUp">Create New Account</button><br>
    <router-link to="/login">go back to login</router-link>
</div>
</template>

<script setup>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function signUp() {
  const auth = getAuth()
  createUserWithEmailAndPassword(auth, email.value, password.value).then(
    () => {
      console.log('accout created')
    },
    err => {
      console.log('err', err)
    }
  )
}
</script>

<style scoped>

</style>


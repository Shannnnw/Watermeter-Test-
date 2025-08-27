<template>
  <div class="login pt-3">
    <h3>sign in</h3>
    <input type="text" v-model="email" placeholder="Email"><br>
    <input type="password" v-model="password" placeholder="Password"><br>
    <button v-on:click="signIn">Connection</button><br>
    <!-- <router-link to="/signup">create account</router-link> -->
  </div>
</template>

<script setup>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')

function signIn() {
  const mail = email.value + '@gmail.com'
  const auth = getAuth()
  signInWithEmailAndPassword(auth, mail, password.value)
    .then(
      () => {
        router.replace('watermeter')
      },
      err => {
        console.log('err', err)
      }
    )
}
</script>

<style scoped>
.login {
  width: 100%;
  text-align: center;
}
</style>


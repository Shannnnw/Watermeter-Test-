<template>
  <div class="login pt-3">
    <h3>sign in</h3>
    <input type="text" v-model="email" placeholder="Email"><br>
    <input type="password" v-model="password" placeholder="Password"><br>
    <button v-on:click="signIn">Connection</button><br>
    <!-- <router-link to="/signup">create account</router-link> -->
  </div>
</template>

<script>
/* eslint-disable */
import firebase from "firebase";
export default {
  name: "login",
  data: function() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    signIn: function() {
      let email = this.email + "@gmail.com";
      firebase
        .auth()
        .signInWithEmailAndPassword(email, this.password)
        .then(
          user => {
            this.$router.replace("watermeter");
          },
          function(err) {
            console.log("err", err);
          }
        );
    }
  }
};
</script>

<style scoped>
.login {
  width: 100%;
  text-align: center;
}
</style>

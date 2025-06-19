<template>
  <div id="app">
    <div id="nav" :class="colorStyle">
      <router-link to="/" tag="div" id="btn-logo" class="btn">
        <div>VGHTPE PedTool</div>
      </router-link>
      <router-link to="/watermeter" tag="div" id="btn-watermeter" class="btn">
        <div>WaterMeter</div>
      </router-link>
      <router-link to="/standby" tag="div" id="btn-standby" class="btn">
        <div>StandBy
          <!-- <span class="new">新功能</span> -->
        </div>
      </router-link>
      <form id="user" class="form-inline">
        <div class="mr-1">{{loggedEmail}}</div>
        <button id="logout" class="btn btn-light btn-sm border-dark my-2 my-sm-0 py-0 px-2" v-if="logged" v-on:click='logout'>Log Out</button>
      </form>
    </div>
    <router-view id="content-box" />
  </div>
</template>

<script>
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
export default {
  name: "App",
  data: function() {
    return {
      logged: false,
      loggedID: "",
      loggedEmail: "",
      colorStyle: ""
    };
  },
  watch: {
    $route: function(to, from) {
      this.colorStyle = to.path.split("/")[1];
    }
  },
  methods: {
    logout: function() {
      let vm = this;
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("/login");
        });
    },
    checkAuth: function(user) {
      let vm = this;
      if (user) {
        vm.logged = true;
        vm.loggedEmail = user.email.split("@")[0];
      } else {
        vm.logged = false;
        vm.loggedEmail = "";
      }
    }
  },
  mounted: function() {
    let vm = this;
    vm.checkAuth(firebase.auth().currentUser);
    firebase.auth().onAuthStateChanged(function(user) {
      vm.checkAuth(user);
    });
    vm.colorStyle = vm.$route.path.split("/")[1];
  }
};
</script>

<style lang="scss">
@import "bootstrap/scss/bootstrap.scss";
#app {
  font-family: "Avenir", Helvetica, Arial, "Microsoft JhengHei", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  justify-content: space-between;
}
.no-gutters {
  margin-right: 0;
  margin-left: 0;
  > .col,
  > [class*="col-"] {
    padding-right: 0;
    padding-left: 0;
  }
}
.new {
  font-size: 0.5em !important;
  background-color: rgb(255, 255, 184);
  position: relative;
  top: -10px;
  left: 3px;
  border-radius: 5px;
  padding-left: 3px;
  padding-right: 3px;
}
$standby: #d7ddc6;
#nav {
  background-color: rgb(206, 206, 206);
  &.watermeter {
    background-color: rgb(185, 205, 223);
    #btn-watermeter {
      background-color: rgba(0, 0, 0, 0.15);
    }
  }
  &.standby {
    background-color: $standby;
    #btn-standby {
      background-color: rgba(0, 0, 0, 0.15);
    }
  }
  transition: all 0.5s;
}
#btn-watermeter {
  background-color: rgba(0, 0, 0, 0.05);
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
}
#btn-standby {
  background-color: rgba(0, 0, 0, 0.05);
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
}

#nav {
  height: 30px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex: 0 0 auto;
  overflow-y: hidden;
}

.btn {
  cursor: pointer;
  height: 100%;
  border-radius: 0px;
  div {
    line-height: 15px;
  }
}

#btn-logo {
  color: black;
}

#btn-watermeter {
  color: black;
  transition: all 0.3s;
}
#btn-standby {
  color: black;
  transition: all 0.3s;
}

#user {
  margin-left: auto;
}

#logout {
  height: 80%;
}

#content-box {
  flex: 1 1 auto;
  overflow-y: hidden;
}
</style>

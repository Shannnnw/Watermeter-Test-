<template>
  <div class="outer">
    <form id="novalidatedform" novalidate />
    <div class="patient-list-container">
      <div class="input-group add-patient p-2">
        <input type="text" class="form-control" placeholder="" v-show="false" v-model="searchPatient">
        <div class="input-group">
          <button id="btn-add-patient" type="button" v-on:click='addPatient'>新增病人</button>
        </div>
      </div>
      <div class="patient-list p-3">
        <div class="mb-2" v-for="i in patientList" :key="i.pkey">
          <router-link class="card patient-card" :class="[parseSelected(i)?'patient-card-selected':'',condition(i)]" v-bind:to="'/watermeter/pkey/'+i.pkey">
            <div class="title-line">
              <div class="name">
                {{i.bedno}} {{i.name}}
              </div>
              <button class="close" v-on:click="storePatient(i)">
                <span>&times;</span>
              </button>
            </div>
            <div>
              <div class="cga-data">
                <div class="text-sm"> {{getCGA(i)}} </div>
                <div class="text-xs text-muted"> {{i.number}}筆資料</div>
              </div>
              <div class="update-time text-xs text-muted">{{i.updateBy}}@{{parseUpdate(i.lastUpdate)}}</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <div class="patient">
      <div id="information" class="p-3" v-if="!pkeyExist">

        <h4 class="pl-1">WaterMeter簡易操作說明</h4>
        <ol>
          <li>從左邊選取病人或新增病人</li>
          <li>輸入病人基本資料(方便查找用)後按儲存</li>
          <li>選定病人後，從上方水表清單新增/選取水表</li>
          <li>先輸入體重、日期等基本資料</li>
          <li>編輯水表內容後按儲存</li>
        </ol>
        <h4 class="pl-1 mt-3">功能及特色</h4>
        <ol>
          <li>採同步編輯模式，在不同裝置可看到同步的資料，但多人同時儲存同一筆水表可能會有覆蓋問題</li>
          <li>【水表】用來整理病人所有input，方便交班及計算PN應該開立的水量</li>
          <li class="font-weight-bold text-primary">若將水表內連續滴注之項目命名為"PN"，則總量會自動跟右邊的TPN sheet連結</li>
          <li>【PN】功能為依據水量、體重換算處方開立量。"prescribe"欄位為在醫囑系統內需開立的劑量</li>
          <li>本表的建議值是為早產兒及嬰兒設計</li>
        </ol>
        <h4 class="pl-1 mt-3">更新日誌</h4>

        <ul>
          <li class="text-danger">2021-11-15 實作:TPN加入Heparin項目</li>
          <li>2021-01-14 實作:Glycophos計算，及配合資訊室介面改版。</li>
          <li>2019-12-04 修正:Trace Ele.改為peditrace, 建議劑量1->0.5ml/kg</li>
          <li>2019-12-04 修正:Mg的單位顯示錯誤(mEq/ml -> mEq/L)</li>
          <li>2018-11-02 實作:Osm > 900會顯示特別顏色</li>
          <li>2018-11-02 修正:微量元素單位錯誤的bug</li>
          <li>2018-10-18 修正:週數在GAday為0時不會正確顯示的錯誤</li>
          <li>2018-09-11 實作:依據餵食量調整姓名卡顏色</li>
          <li>2018-09-11 實作:餵食奶品之預設資料格式</li>
          <li>2018-09-11 修正:姓名卡及資料卡之格式調整</li>
          <li class="text-danger">2018-09-07 實作:水量表</li>
          <li>2018-09-05 實作:性別資料欄位</li>
          <li>2018-09-05 修正:生長曲線表切換病人後資料沒有正常清空的問題</li>
          <li>2018-09-05 修正:床位排序錯誤的問題</li>
          <li class="text-danger">2018-08-25 實作:生長曲線表</li>
          <li class="text-danger">2018-06-22 重大修正:與TPN小組重新確認鈣磷沉積公式並且套用</li>
          <li>2018-06-22 修正:日期排序錯誤的問題</li>
          <li>2018-06-21 實作:刪除某patient card後，資料會封存，而不會消失(但現階段只有管理員可以調閱以刪除之資料)</li>
          <li>2018-06-15 實作:Tracker會顯示Feeding之ml/kg/day</li>
          <li>2018-06-15 實作:複製水表時會自動帶入今天日期</li>
          <li>2018-06-15 修正:Tracker磷鎂顯示錯誤的問題</li>
          <li>2018-06-12 實作:有使用Ca會在開立對照表顯示Central for Ca</li>
          <li>2018-06-11 實作:開立對照表(仿藥囑系統TPN格式)</li>
          <li>2018-06-06 實作:Tracer功能</li>
          <li>2018-06-05 實作:資料刪除前確認功能</li>
          <li>2018-06-05 上線開放使用</li>
        </ul>
        <h4 class="pl-1 mt-3">Special thanks:</h4>
        <ul>
          <li>2021-01 感謝龍大勇醫師、宋亭璇醫師、李珮甄藥師協助PN配置流程改善。</li>
          <li>2018-06 感謝黃齡葳大大協助測試</li>
        </ul>
      </div>

      <div v-if="pkeyExist" class="h100">
        <router-view :showchart="showchart" @toggle="()=>{showchart=!showchart}"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import util from "@/util.js";
let database;
export default {
  name: "waterMeter",
  data() {
    return {
      searchPatient: "",
      showchart: true
    };
  },
  computed: {
    patientList: function() {
      return this.$store.state.patientList;
    },
    pkeyExist: function() {
      return this.$store.getters.pkeyExist;
    }
  },
  methods: {
    addPatient: function() {
      let vm = this;
      let waterMeterRef = database.ref("/watermeter/");
      let currentUser = firebase.auth().currentUser.email.split("@")[0];
      if(currentUser=="phar.vghtpe"){
        alert("您的帳號無儲存/修改權限!")
        return 
      }
      waterMeterRef.push({
        hisid: "",
        name: "新病人",
        bedno: "",
        gender: "",
        active: true,
        birthdate: util.getToday(),
        ga_week: "",
        ga_day: 0,
        lastUpdate: util.getNow(),
        updateBy: currentUser,
        watermeter: []
      });
    },
    deletePatient: function(pkey) {
      let currentUser = firebase.auth().currentUser.email.split("@")[0];
      if(currentUser=="phar.vghtpe"){
        alert("您的帳號無儲存/修改權限!")
        return 
      }
      let r = confirm("確定要刪除此病人資料?(無法復原)");
      if (r == true) {
        let patientRef = database.ref("/watermeter/" + pkey + "/");
        patientRef.remove();
      }
    },
    storePatient: function(patient) {
      let currentUser = firebase.auth().currentUser.email.split("@")[0];
      if(currentUser=="phar.vghtpe"){
        alert("您的帳號無儲存/修改權限!")
        return 
      }
      let pkey = patient.pkey;
      if (!patient.hisid && patient.name == "新病人") {
        let r = confirm("未輸入姓名及病歷號資訊，資料將會直接刪除");
        if (r == true) {
          let patientRef = database.ref("/watermeter/" + pkey + "/");
          patientRef.once("value", function(snapshot) {
            patientRef.remove();
          });
        }
        return;
      }
      let r = confirm(
        "確定要封存此病人資料?(要調閱封存後之資料須請管理員執行)"
      );
      if (r == true) {
        let patientRef = database.ref("/watermeter/" + pkey + "/");
        let storeRef = database.ref("/watermeter_store/");
        patientRef.once("value", function(snapshot) {
          let obj = snapshot.val();
          obj.deleteDate = util.getNow();
          storeRef.push(obj);
          patientRef.remove();
        });
      }
    },
    setRoute(route) {
      let vm = this;
      vm.$store.commit("setRoute", route);
    },
    parseUpdate(inputDateTime) {
      let split = inputDateTime.split(" ");
      let date = split[0].split("-").map(x => Number(x));
      date.splice(0, 1);
      date = date.join("/");
      let time = split[1].split(":");
      time.splice(2, 1);
      time = time.join(":");
      return date + " " + time;
    },
    parseSelected(input) {
      return input.pkey == this.$route.params.pkey;
    },
    getCGA(patientData) {
      let cga = util.getCGA(
        util.getNow(),
        patientData.birthdate,
        patientData.ga_week,
        patientData.ga_day
      );
      if (!cga) return "";
      return patientData.ga_week + "+" + patientData.ga_day + " > " + cga;
    },
    condition(patientData) {
      let wm = patientData.watermeterData;
      wm = wm && wm[0] && wm[0].wm;
      if (wm && wm.bw) {
        let feed_daily = wm.feed_total / (wm.bw / 1000 + 0.0001);
        let daily = wm.wm_summary_daily;
        let propotion = feed_daily / 100;
        if (propotion < 0.2) {
          return "condition-warn-1";
        } else if (propotion < 0.4) {
          return "condition-warn-2";
        } else if (propotion < 0.6) {
          return "condition-warn-3";
        } else if (propotion < 0.8) {
          return "condition-warn-4";
        } else {
          return "condition-warn-5";
        }
      }
      return "condition-none";
    }
  },
  beforeRouteUpdate(to, from, next) {
    let vm = this;
    vm.setRoute(to);
    if (to.params.pkey && vm.patientList.find(x => x.pkey == to.params.pkey)) {
      next();
    } else if (!to.params.pkey) {
      next();
    } else {
      next("/watermeter");
    }
  },
  mounted() {
    let vm = this;
    vm.setRoute(vm.$route);
    database = firebase.database();
    let waterMeterRef = database.ref("/watermeter/");
    waterMeterRef.on("value", function(snapshot) {
      vm.$store.commit("setSnapshot", snapshot.val());
    });
  }
};
</script>

<style scoped lang="scss">
.outer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
.patient-list-container {
  flex-basis: 220px;
  flex-grow: 0;
  flex-shrink: 0;
  border-width: 2px;
  width: 200px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.3);
}
.add-patient {
  flex: 0 0 auto;
}
#btn-add-patient {
  width: 100%;
  background-color: rgb(196, 219, 238);
  border: 0px;
  padding-top: 5px;
  padding-bottom: 5px;
  cursor: pointer;
  &:hover {
    background-color: rgb(186, 203, 218);
  }
  transition: all 0.3s;
}
.patient-list {
  overflow-x: hidden;
  overflow-y: scroll;
  flex: 1 1 auto;
}
.patient {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.patient-card {
  text-decoration: none !important;
  box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.1);
  padding-left: 3px;
  transition: all 0.2s;
  color: hsla(0, 0, 0, 0.9);
  &.condition-none {
    background-color: hsl(240, 0%, 90%);
  }
  &.condition-warn-1 {
    background-color: hsl(0, 50%, 90%);
  }
  &.condition-warn-2 {
    background-color: hsl(40, 50%, 90%);
  }
  &.condition-warn-3 {
    background-color: hsl(70, 50%, 90%);
  }
  &.condition-warn-4 {
    background-color: hsl(90, 45%, 90%);
  }
  &.condition-warn-5 {
    background-color: hsl(120, 40%, 85%);
  }

  .title-line {
    display: flex;
    justify-content: space-between;
    .name {
      color: hsl(224, 25%, 40%);
      font-weight: 700;
    }
  }
}
.patient-card-selected {
  box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.5) !important;
}
.patient-card:hover {
  box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.2);
}
.cga-data {
  color: rgb(116, 119, 177);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  padding-right: 15px;
  height: 16px;
  font-size: 0.85em;
}
.update-time {
  padding-left: 5px;
}
.h100 {
  height: 100%;
}
.w20 {
  width: 20%;
}
.w80 {
  width: 80%;
}
.inline {
  display: inline-block;
  white-space: nowrap;
}
.text-xs {
  font-size: 0.8em;
}
#information {
  height: 100%;
  overflow-y: scroll !important;
}

::-webkit-scrollbar {
  width: 0.6em;
  height: 0.6em;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgba(225, 225, 225, 0.8);
}

::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>

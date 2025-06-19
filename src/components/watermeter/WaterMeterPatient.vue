<template>
  <div class="flex h100">
    <div id="data-outer" class="mb-2">
      <div class="p-2">
        <div id="data-button-container">
          <button id="add-data-btn" type="button" tabindex="-1" v-on:click='addData'>增加</button>
          <div id="data-card-container">
            <router-link v-bind:to="'/watermeter/pkey/'+$route.params.pkey+ '/dkey/'+i.dkey" class="data-card card  mx-1 text-body" :class="[parseSelected(i)?'data-card-selected':'']" v-for="i in watermeterData" v-bind:key="i.dkey">
              <div class="h100">
                <div class="titles">
                  <div class="inline lg date" v-html="parseDate(i.date)"></div>
                  <div class="inline sm bw">{{parseBW(i.bw_measure)}}</div>
                  <button class="close" v-on:click="deleteData(i.dkey) ">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="badges">
                  <span class="badge" :class="[i.pn.pn_desired>0?'badge-primary':'badge-light, text-light-grey']">D{{parseDex(i.dex)?parseDex(i.dex):'_'}}W</span>
                  <span class="badge" :class="[i.wm.lipid_perKg>0?'badge-warning':'badge-light, text-light-grey']">Lipid</span>
                  <span class="badge" :class="[i.pn.k_perKg>0?'badge-success':'badge-light, text-light-grey']">K</span>
                  <span class="badge" :class="[i.pn.ca_perKg>0?'badge-danger':'badge-light, text-light-grey']">Ca</span>
                </div>
              </div>

            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="patient-tracker" v-show="!dkeyExist">
      <div id="patient-data" class="px-2">
        <div class="text-center mt-3">
          <h5>病人資料</h5>
        </div>
        <div class="input-group input-group-sm my-1">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm">床號</span>
          </div>
          <input type="text" class="form-control" v-model="patientData.bedno">
        </div>
        <div class="input-group input-group-sm my-1">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm">名稱</span>
          </div>
          <input type="text" class="form-control" v-model="patientData.name">
        </div>
        <div id="gender-button-container">
          <label class="gender-button" :class="{'male':patientData.gender==='male'}">
            <input type="radio" name="gender" id="male" value="male" v-model="patientData.gender"> 男
          </label>
          <label class="gender-button" :class="{'female':patientData.gender==='female'}">
            <input type="radio" name="gender" id="female" value="female" v-model="patientData.gender"> 女
          </label>
        </div>
        <div class="input-group input-group-sm my-1">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm">病歷號</span>
          </div>
          <input type="text" class="form-control" v-model="patientData.hisid">
        </div>
        <div class="input-group input-group-sm my-1">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm">生日</span>
          </div>
          <input type="date" class="form-control" v-model="patientData.birthdate">
        </div>
        <div class="input-group input-group-sm my-1">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm">GA</span>
          </div>
          <input type="number" step="1" min="20" max="43" class="form-control" v-model="patientData.ga_week">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm">+</span>
          </div>
          <input type="number" step="1" min="0" max="6" class="form-control" v-model="patientData.ga_day">
        </div>
        <div class="text-center mt-3">
          <button type="button" tabindex="-1" class="patient-data-btn" v-bind:class="[dataChanged?'changed':'']" v-on:click="savePatientData">儲存</button>
          <button type="button" tabindex="-1" class="patient-data-btn" v-bind:class="[dataChanged?'changed':'']" v-on:click="giveUpChange">捨棄</button>
        </div>
        <div id="analysis">
          <button id="btn-analysis" v-on:click="toggleChart">{{isChartShow?'表格':'圖表'}}</button>
        </div>
      </div>

      <div id="tracker">
        <div class="flex-row" v-show="!isChartShow">
          <div class="flex-non-grow">
            <div class="first-col-width test inline">
              <div class="tracker-row border">Date</div>
              <div class="tracker-row border">cGA</div>
              <div class="tracker-row border">實際體重(g)</div>
              <div class="tracker-row border">計算體重(g)</div>
              <div class="tracker-row border">Daily(mg/kg/D)</div>
              <div class="tracker-row border">Feed(ml)(ml/kg/D)</div>
              <div class="tracker-row border">Lipid(g/kg/D)</div>
              <div class="tracker-row border">PN(ml)</div>
              <div class="tracker-row border">AA(g/kg)</div>
              <div class="tracker-row border">Dex(%)</div>
              <div class="tracker-row border">Na(mEq/kg/D)</div>
              <div class="tracker-row border">K(mEq/kg/D)</div>
              <div class="tracker-row border">Ca(mEq/kg/D)</div>
              <div class="tracker-row border">P(mmol/kg/D)</div>
              <div class="tracker-row border">Mg(mEq/kg/D)</div>
            </div>
          </div>
          <div id="table-outer">
            <div class="col-width text-center inline" v-for="(e,i) in watermeterData" :key="i">
              <div class="tracker-row border">{{e.date}}</div>
              <div class="tracker-row border">{{getCGA(e.date)}}</div>
              <div class="tracker-row border">{{e.bw_measure}}{{e.bw_measure?"g":"-"}}</div>
              <div class="tracker-row border">{{e.bw}}g</div>
              <div class="tracker-row border">{{e.wm.wm_summary_daily}}</div>
              <div class="tracker-row border">{{e.wm.feed_total}}
                <span v-if="e.bw&&e.wm.feed_total">({{Math.round(e.wm.feed_total/e.bw*1000)}})</span>
              </div>
              <div class="tracker-row border">{{e.wm.lipid_perKg}}</div>
              <div class="tracker-row border">{{e.pn.pn_desired}}</div>
              <div class="tracker-row border">{{e.pn.aa_perKg}}</div>
              <div class="tracker-row border">{{e.pn.glu_conc}}</div>
              <div class="tracker-row border">{{e.pn.na_perKg}}</div>
              <div class="tracker-row border">{{e.pn.k_perKg}}</div>
              <div class="tracker-row border">{{e.pn.ca_perKg}}</div>
              <div class="tracker-row border">{{e.pn.p_perKg}}</div>
              <div class="tracker-row border">{{e.pn.mg_perKg}}</div>
            </div>

          </div>
        </div>
        <div id="chart-container" v-show="isChartShow">
          <div class="chart-col-left">
            <growth-chart></growth-chart>
          </div>
          <div class="chart-col-right">
            <volume-chart class="chart"></volume-chart>
            <!-- <div class="chart">
              <div class="title">GIR(ml/kg/min)</div>
            </div>
            <div class="chart">
              <div class="title">電解質</div>
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <router-view class="flex-grow flex" v-if="dkeyExist"></router-view>
  </div>
</template>

<script>
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import util from "@/util";
import $ from "jquery";
import $$ from "jquery-mousewheel";
import Chart from "chart.js/auto";
import GrowthChart from "./chart/GrowthChart.vue";
import VolumeChart from "./chart/VolumeChart.vue";

let database;
export default {
  name: "watermeterPatient",
  components: {
    GrowthChart,
    VolumeChart
  },
  props: { showchart: Boolean },
  data: function() {
    return {
      // isChartShow: true,
      patientData: {
        name: "",
        gender: "",
        hisid: "",
        bedno: "",
        birthdate: "",
        ga_week: "",
        ga_day: "",
        active: ""
      },
      watermeterData: [],
      newData: "",
      lastUpdate: "",
      updateBy: "",
      patientImage: {
        name: "",
        hisid: "",
        bedno: "",
        active: ""
      }
    };
  },
  methods: {
    addData: function() {
      let vm = this;
      let currentUser = firebase.auth().currentUser.email.split("@")[0];
      if(currentUser=="phar.vghtpe"){
        alert("您的帳號無儲存/修改權限!")
        return 
      }
      database = firebase.database();
      let PatientRef = database.ref(
        "/watermeter/" + vm.$route.params.pkey + "/watermeterData/"
      );
      let dkey = PatientRef.push({
        //初始WM資料
        bw: "",
        bw_measure: "",
        date: util.getToday(),
        dex: 0,
        note: "",
        active: true,
        updateBy: currentUser,
        lastUpdate: util.getNow(),
        wm: {
          bw: "",
          feed_type: "",
          feed_amount: "",
          feed_freq: "",
          feed_total: "",
          continuousVolume: "",
          bolusVolume: "",
          lipid_perKg: "",
          lipid_perDay: "",
          lipid_perHour: "",
          wm_summary_volume: "-",
          wm_summary_daily: "-",
          wm_summary_gir: "-",
          wm_summary_na: "-"
        },
        pn: {
          bw: "",
          pn_desired: "",
          pn_priming: 30,
          pn_prescribe: "",
          aa_perKg: 3,
          aa_conc: "",
          aa_prescribe: "",
          glu_perKg: "",
          glu_conc: 10,
          glu_prescribe: "",
          na_perKg: "",
          na_conc: "",
          na_prescribe: "",
          k_perKg: "",
          k_conc: "",
          k_prescribe: "",
          ca_perKg: "",
          ca_conc: "",
          ca_prescribe: "",
          p_perKg: "",
          p_conc: "",
          p_prescribe: "",
          orgp_perKg: "",
          orgp_conc: "",
          orgp_prescribe: "",
          mg_perKg: "",
          mg_conc: "",
          mg_prescribe: "",
          te_perKg: 0.5,
          te_prescribe: "",
          lyop_perKg: 0.25,
          lyop_prescribe: "",
          heparin_perML: "",
          heparin_prescribe: "",
          pn_summary_volume: "-",
          pn_summary_rate: "-",
          pn_summary_gir: "-",
          pn_summary_osm: "-",
          pn_error: ""
        }
      });
      vm.savePatientData();
    },
    deleteData: function(dkey) {
      let currentUser = firebase.auth().currentUser.email.split("@")[0];
      if(currentUser=="phar.vghtpe"){
        alert("您的帳號無儲存/修改權限!")
        return 
      }
      let vm = this;
      let r = confirm("確定要刪除此筆水表(無法復原)?");
      if (r == true) {
        database = firebase.database();
        let deleteRef = database.ref(
          "/watermeter/" +
            this.$route.params.pkey +
            "/watermeterData/" +
            dkey +
            "/"
        );
        deleteRef.remove();
      }
    },
    loadPatientData: function() {
      let vm = this;
      let patient = this.$store.getters.currentPatient;
      if (!patient) {
        return;
      }
      //複製至patientData & image
      let patientData = vm.patientData;
      let patientImage = vm.patientImage;

      patientImage.bedno = patientData.bedno = patient.bedno;
      patientImage.hisid = patientData.hisid = patient.hisid;
      patientImage.name = patientData.name = patient.name;
      patientImage.gender = patientData.gender = patient.gender;
      patientImage.active = patientData.active = patient.active;
      patientImage.birthdate = patientData.birthdate = patient.birthdate;
      patientImage.ga_week = patientData.ga_week = patient.ga_week;
      patientImage.ga_day = patientData.ga_day = patient.ga_day;
      vm.lastUpdate = patient.lastUpdate;
      if (!patient.birthdate) {
        $("input[type=date]").val("");
      }
      vm.updateBy = patient.updateBy;
      vm.watermeterData = patient.watermeterData;
      vm.draw();
    },
    savePatientData: function() {
      let vm = this;
      let currentUser = firebase.auth().currentUser.email.split("@")[0];
      if(currentUser=="phar.vghtpe"){
        alert("您的帳號無儲存/修改權限!")
        return 
      }
      database = firebase.database();
      let saveRef = database.ref("/watermeter/" + this.$route.params.pkey);
      let patientData = vm.patientData;
      saveRef.update({
        bedno: patientData.bedno,
        hisid: patientData.hisid,
        name: patientData.name,
        gender: patientData.gender,
        active: patientData.active,
        birthdate: patientData.birthdate,
        ga_week: patientData.ga_week,
        ga_day: patientData.ga_day,
        lastUpdate: util.getNow(),
        updateBy: currentUser
      });
      vm.loadPatientData();
    },
    giveUpChange: function() {
      let vm = this;
      let patientData = vm.patientData;
      let patientImage = vm.patientImage;
      patientData.bedno = patientImage.bedno;
      patientData.hisid = patientImage.hisid;
      patientData.name = patientImage.name;
      patientData.gender = patientImage.gender;
      patientData.active = patientImage.active;
      patientData.birthdate = patientImage.birthdate;
      patientData.ga_week = patientImage.ga_week;
      patientData.ga_day = patientImage.ga_day;
    },
    parseSelected(input) {
      return input.dkey == this.$route.params.dkey;
    },
    parseDate: function(inputDate) {
      let year = inputDate.split("-")[0] || "";
      let month = inputDate.split("-")[1] || "";
      let date = inputDate.split("-")[2] || "";
      if (!year || !month || !date) {
        return inputDate;
      }
      return (
        Number(month) +
        '<span class="sm text-muted">/</span>' +
        Number(date)
      );
    },
    parseBW: function(inputBW) {
      let match = inputBW.match(/[0-9]+/);
      if (!match) {
        return "";
      } else {
        return match[0] + "g";
      }
    },
    parseDex: function(inputDex) {
      return inputDex;
    },
    parseUpdate(inputDateTime) {
      if (!inputDateTime) {
        return "";
      }
      let split = inputDateTime.split(" ");
      let date = split[0].split("-").map(x => Number(x));
      date.splice(0, 1);
      date = date.join("/");
      let time = split[1].split(":");
      time.splice(2, 1);
      time = time.join(":");
      return date + " " + time;
    },
    getCGA(currentDate) {
      let vm = this;
      let birthdate = vm.patientData.birthdate;
      let ga_day = vm.patientData.ga_day;
      let ga_week = vm.patientData.ga_week;
      return util.getCGA(currentDate, birthdate, ga_week, ga_day) || "-";
    },
    toggleChart() {
      let vm = this;
      vm.isChartShow = !vm.isChartShow;
      if (vm.isChartShow) {
        vm.draw();
      }
    },
    draw() {
      let vm = this;
      GrowthChart.methods.render(vm.patientData, vm.watermeterData);
      VolumeChart.methods.render(vm.patientData, vm.watermeterData);
      // renderChart();
      // updateChart(vm.patientData, vm.watermeterData);
    }
  },
  computed: {
    dataChanged: function() {
      let vm = this;
      let patientData = vm.patientData;
      let patientImage = vm.patientImage;
      return (
        patientImage.bedno != patientData.bedno ||
        patientImage.hisid != patientData.hisid ||
        patientImage.name != patientData.name ||
        patientImage.gender != patientData.gender ||
        patientImage.birthdate != patientData.birthdate ||
        patientImage.ga_week != patientData.ga_week ||
        patientImage.ga_day != patientData.ga_day ||
        patientImage.active != patientData.active
      );
    },
    dkeyExist: function() {
      return this.$store.getters.dkeyExist;
    },
    isChartShow: {
      get() {
        return this.showchart;
      },
      set(value) {
        this.$emit("toggle", value);
      }
    }
  },
  watch: {
    $route() {
      this.loadPatientData();
    },
    "$store.getters.currentPatient"() {
      if (!this.dataChanged) {
        this.loadPatientData();
      }
    }
  },
  mounted() {
    this.loadPatientData();
    $("#data-card-container").mousewheel(function(event, delta) {
      this.scrollLeft -= delta * 30;
      event.preventDefault();
    });
    $("#table-outer").mousewheel(function(event, delta) {
      this.scrollLeft -= delta * 30;
      event.preventDefault();
    });
  }
};
</script>

<style scoped src='./WaterMeterPatient.scss' lang="scss">
</style>

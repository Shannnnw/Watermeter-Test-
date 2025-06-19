<template>
  <div style="overflow-x:auto">

    <div class="container p-2 mt-2 flex-non-grow">
      <div id="controller">

        <div
          id="dateinput"
          class="input-group input-group-sm  tooltip-container"
        >
          <div class="input-group-prepend">
            <span
              class="input-group-text"
              id="inputGroup-sizing-sm"
            >日期</span>
          </div>
          <input
            type="date"
            max="9999-12-31"
            :class="{'input-warn':waterMeterData.date!=getToday()}"
            class="form-control"
            v-model="waterMeterData.date"
          >
          <span
            class="tooltiptext-notshow warn no-arrow"
            :class="{'showtooltip':waterMeterData.date!=getToday()}"
          >這不是今天的日期，請確認是否先Ditto</span>
        </div>

        <div
          id="bwinput"
          class="input-group input-group-sm tooltip-container"
        >
          <div class="input-group-prepend">
            <span
              class="input-group-text"
              id="inputGroup-sizing-sm"
            >計算體重(g)</span>
          </div>
          <input
            :class="{'input-error':!waterMeterData.bw||waterMeterData.bw==0,'input-warn':waterMeterData.bw>0&&waterMeterData.bw<400,'input-ok':waterMeterData.bw>=400}"
            type="number"
            step="5"
            min="0"
            form="novalidatedform"
            class="form-control"
            v-model="waterMeterData.bw"
          >
          <span
            class="tooltiptext-notshow"
            :class="{'showtooltip':!waterMeterData.bw||waterMeterData.bw==0}"
          >必須先輸入計算體重</span>
        </div>

        <div
          id="bwinput"
          class="input-group input-group-sm tooltip-container"
        >
          <div class="input-group-prepend">
            <span
              class="input-group-text"
              id="inputGroup-sizing-sm"
            >實際體重(g)</span>
          </div>
          <input
            :class="{'input-warn':!waterMeterData.bw_measure||waterMeterData.bw_measure<400,'input-ok':waterMeterData.bw_measure>=400}"
            placeholder=""
            type="number"
            step="5"
            min="0"
            form="novalidatedform"
            class="form-control"
            v-model="waterMeterData.bw_measure"
          >
          <span class="tooltiptext">用來繪製growth chart</span>
        </div>

        <div
          id="noteinput"
          class="input-group input-group-sm"
        >
          <div class="input-group-prepend">
            <span
              class="input-group-text"
              id="inputGroup-sizing-sm"
            >附註</span>
          </div>
          <input
            type="text"
            class="form-control"
            v-model="waterMeterData.note"
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
          >
        </div>

        <button
          type="button"
          tabindex="-1"
          class="btn btn-sm"
          :class="[waterMeterData.date==getToday()?'btn-primary':'btn-light']"
          v-on:click="save"
        >儲存</button>
        <button
          type="button"
          tabindex="-1"
          class="btn btn-sm btn-success"
          v-on:click="copyData"
        >Ditto</button>
        <button
          type="button"
          tabindex="-1"
          class="btn btn-sm btn-danger"
          v-on:click="discardChange"
        >捨棄</button>
        <button
          type="button"
          tabindex="-1"
          class="btn btn-sm btn-info"
          v-on:click="returnPatient"
        >返回</button>

      </div>
      <div class=" row d-flex ">
        <small class="ml-auto pr-3 ">last update: {{lastUpdate}} by {{updateBy}}</small>
      </div>
    </div>
    <watermeter-table
      class="p-1 flex-grow flex"
      ref="wmtable"
      :wm="waterMeterData.wm"
      :pn="waterMeterData.pn"
      :temp="temp"
    > </watermeter-table>
  </div>
</template>

<script>
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import util from "@/util";
import WaterMeterTable from "./WaterMeterTable";
import $ from "jquery";
let database;
export default {
  name: "watermeterData",
  components: {
    "watermeter-table": WaterMeterTable,
  },
  data: function () {
    return {
      temp: {},
      waterMeterData: {
        date: "",
        bw: 0,
        bw_measure: 0,
        note: "",
        active: true,
        wm: {},
        pn: {},
      },
      waterMeterImage: {
        date: "",
        bw: 0,
        bw_measure: 0,
        note: "",
        active: true,
        wm: {},
        pn: {},
      },
      lastUpdate: "",
      updateBy: "",
    };
  },
  methods: {
    loadWaterMeterData() {
      let vm = this;
      let waterMeterData = vm.$store.getters.currentWaterMeterData;
      if (!waterMeterData) {
        return;
      }
      vm.waterMeterImage.date = vm.waterMeterData.date = waterMeterData.date;
      vm.waterMeterImage.bw = vm.waterMeterData.bw = waterMeterData.bw;
      vm.waterMeterImage.bw_measure = vm.waterMeterData.bw_measure =
        waterMeterData.bw_measure;
      vm.waterMeterImage.note = vm.waterMeterData.note = waterMeterData.note;

      Object.keys(waterMeterData.wm).map(function (objectKey, index) {
        vm.waterMeterImage.wm[objectKey] = waterMeterData.wm[objectKey];
      });
      vm.waterMeterData.wm = waterMeterData.wm;

      Object.keys(waterMeterData.pn).map(function (objectKey, index) {
        vm.waterMeterImage.pn[objectKey] = waterMeterData.pn[objectKey];
      });
      vm.waterMeterData.pn = waterMeterData.pn;

      vm.waterMeterImage.active = vm.waterMeterData.active =
        waterMeterData.active;
      vm.lastUpdate = waterMeterData.lastUpdate;
      vm.updateBy = waterMeterData.updateBy;
    },
    save() {
      let vm = this;
      let currentUser = firebase.auth().currentUser.email.split("@")[0];
      if (currentUser == "phar.vghtpe") {
        alert("您的帳號無儲存/修改權限!");
        return;
      }
      database = firebase.database();

      let saveRef = database.ref(
        "/watermeter/" +
          this.$route.params.pkey +
          "/watermeterData/" +
          this.$route.params.dkey
      );
      //陣列資料會先存至temp
      let waterMeterData = vm.waterMeterData;
      waterMeterData.wm.continuousVolume = vm.temp.continuousVolume;
      waterMeterData.wm.bolusVolume = vm.temp.bolusVolume;

      saveRef.update({
        date: waterMeterData.date,
        bw: waterMeterData.bw,
        bw_measure: waterMeterData.bw_measure,
        note: waterMeterData.note,
        active: waterMeterData.active,
        wm: waterMeterData.wm,
        pn: waterMeterData.pn,
        lastUpdate: util.getNow(),
        updateBy: currentUser,
      });

      vm.loadWaterMeterData();
    },
    discardChange() {
      let vm = this;
      vm.waterMeterData.date = vm.waterMeterImage.date;
      vm.waterMeterData.bw = vm.waterMeterImage.bw;
      vm.waterMeterData.bw_measure = vm.waterMeterImage.bw_measure;
      vm.waterMeterData.note = vm.waterMeterImage.note;
      Object.keys(vm.waterMeterImage.wm).map(function (objectKey, index) {
        vm.waterMeterData.wm[objectKey] = vm.waterMeterImage.wm[objectKey];
      });
      Object.keys(vm.waterMeterImage.pn).map(function (objectKey, index) {
        vm.waterMeterData.pn[objectKey] = vm.waterMeterImage.pn[objectKey];
      });
      vm.$refs.wmtable.renderContVol();
      vm.$refs.wmtable.renderBolusVol();
      vm.waterMeterData.active = vm.waterMeterImage.active;
    },
    copyData() {
      let vm = this;
      let currentUser = firebase.auth().currentUser.email.split("@")[0];
      if (currentUser == "phar.vghtpe") {
        alert("您的帳號無儲存/修改權限!");
        return;
      }
      database = firebase.database();
      let PatientRef = database.ref(
        "/watermeter/" + vm.$route.params.pkey + "/watermeterData/"
      );

      let newInstance = JSON.parse(JSON.stringify(vm.waterMeterData));
      newInstance.updateBy = currentUser;
      newInstance.date = util.getToday();
      newInstance.lastUpdate = util.getNow();
      let newID = PatientRef.push(newInstance);
      vm.$router.replace(newID.key);
    },
    returnPatient() {
      window.location.href = "#/watermeter/pkey/" + this.$route.params.pkey;
    },
    getToday() {
      return util.getToday();
    },
  },
  watch: {
    $route() {
      this.loadWaterMeterData();
    },
    "waterMeterData.bw"() {
      this.waterMeterData.pn.bw = this.waterMeterData.bw;
      this.waterMeterData.wm.bw = this.waterMeterData.bw;
    },
  },
  mounted() {
    var vm = this;
    vm.loadWaterMeterData();
  },
};
</script>

<style scoped lang="scss">
#active-btn {
  width: 90px;
}
.flex {
  display: flex;
  flex-direction: column;
}
.flex-non-grow {
  flex: 0 0;
}
.flex-grow {
  flex: 1 0;
}
#controller {
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
  max-height: 28px;
  & #dateinput {
    max-width: 200px;
  }
  & #bwinput {
    max-width: 160px;
  }
  & #noteinput {
    max-width: 200px;
    margin-right: 32px;
  }
  & > div {
    margin-left: 10px;
    margin-right: 10px;
  }
}
input[type="date"]::-webkit-clear-button,
input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-outer-spin-button {
  display: none;
}
input[type="date"],
input[type="number"] {
  padding-right: 0px;
}
input.form-control {
  border-top-right-radius: 3px !important;
  border-bottom-right-radius: 3px !important;
}
.input-ok {
  background-color: rgb(220, 240, 200);
}
.input-ok:focus {
  border-color: rgb(200, 240, 200);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(46, 90, 24, 0.6);
  outline: 0 none;
}

.input-warn {
  background-color: rgb(255, 255, 220);
}
.input-warn:focus {
  border-color: rgb(200, 200, 160);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(255, 255, 0, 0.6);
  outline: 0 none;
}
.input-error {
  background-color: rgb(255, 230, 230);
  color: rgb(200, 0, 0);
}
.input-error:focus {
  border-color: pink;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6);
  outline: 0 none;
}

/* Tooltip text */
.tooltip-container .tooltiptext,
.tooltip-container .tooltiptext-notshow {
  visibility: hidden;
  background-color: rgb(44, 138, 0);
  color: #fff;
  text-align: left;
  padding-left: 3px;
  padding-right: 3px;
  padding-top: 0px;
  padding-bottom: 0px;
  border-radius: 6px;
  font-size: 0.8em;
  white-space: nowrap;
  /* Position the tooltip text */
  position: absolute;
  z-index: 1000;
  bottom: 95%;
  left: 50%;
  margin-left: -60px;
  /* Fade in tooltip */
  opacity: 0;
  transition: opacity 0.3s;

  pointer-events: none;
  &.warn {
    background-color: rgb(131, 80, 80) !important;
    left: 40%;
    bottom: -45% !important;
    font-size: 0.6em;
  }
}
.snap-button {
  background-color: rgb(49, 107, 134) !important;
  pointer-events: all !important;
  color: #fff !important;
  bottom: 100% !important;
}
.no-arrow {
  bottom: -75% !important;
  background-color: #555 !important;
  color: #fff !important;
}
.showtooltip {
  background-color: rgb(187, 28, 28) !important;
}
.tooltip-container
  :not(.snap-button):not(.no-arrow).tooltiptext.showtooltip::after,
.tooltip-container
  :not(.snap-button):not(.no-arrow).tooltiptext-notshow.showtooltip::after {
  border-color: rgb(187, 28, 28) transparent transparent transparent !important;
}
/* Tooltip arrow */
.tooltip-container :not(.snap-button):not(.no-arrow).tooltiptext::after,
.tooltip-container
  :not(.snap-button):not(.no-arrow).tooltiptext-notshow::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: rgb(44, 138, 0) transparent transparent transparent;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip-container:hover .tooltiptext,
input:focus ~ .tooltiptext,
.showtooltip.tooltiptext,
.showtooltip.tooltiptext-notshow {
  visibility: visible;
  opacity: 1;
}

.disable {
  color: lightgray;
  cursor: not-allowed;
}
</style>

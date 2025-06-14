<template>
  <div class="root">
    <div class="container flex">
      <div class="row">
        <div class="col flex py-2 m-1 border text-center">
          <div class="flex-non-grow">
            <div class="text-light bg-info">Water Meter - 水表</div>
            <table class="table table-sm summary table-info table-borderless">
              <thead>
                <tr>
                  <th
                    class="py-0"
                    scope="col"
                  >Total Vol.
                    <span class="text-sm text-muted">(ml)</span>
                  </th>
                  <th
                    class="py-0"
                    scope="col"
                  >Daily
                    <span class="text-sm text-muted">(ml/kg/D)</span>
                  </th>
                  <th
                    class="py-0"
                    scope="col"
                  >GIR
                    <span class="text-sm text-muted">(mg/kg/min)</span>
                  </th>
                  <th
                    class="py-0"
                    scope="col"
                  >Na
                    <span class="text-sm text-muted">(mEq/kg/D)</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-0 text-xl">{{wm.wm_summary_volume}}</td>
                  <td
                    class="py-0 text-xl"
                    :class="{'text-warn':wm.wm_summary_daily>160||wm.wm_summary_daily<60}"
                  >{{wm.wm_summary_daily}}</td>
                  <td
                    class="py-0 text-xl"
                    :class="{'text-warn':wm.wm_summary_gir>15}"
                  >{{wm.wm_summary_gir}}</td>
                  <td class="py-0 text-xl">{{wm.wm_summary_na}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="scrollable flex-grow">
            <div class="text-light bg-info text-sm">Feeding
              <div
                class="add-btn float-right px-2"
                @click="clearFeed"
              >
                <span>&times;</span>
              </div>
            </div>
            <div class="container mt-1">
              <div class="row">
                <div class="col-3 px-0 pr-1">
                  <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text py-0 bg-input-tag px-1">種類</span>
                    </div>
                    <input
                      list="feed_type"
                      :class="{'input-ok':wm.feed_type!=''}"
                      type="text"
                      class="form-control py-0"
                      v-model="wm.feed_type"
                    >
                    <datalist id="feed_type">
                      <option value="BM"></option>
                      <option value="BM+1/2F"></option>
                      <option value="BM+F"></option>
                      <option value="SSC20"></option>
                      <option value="SSC24"></option>
                      <option value="SSC27"></option>
                      <option value="SSC30"></option>
                      <option value="LS24"></option>
                      <option value="preNan-S1"></option>
                      <option value="pregestimil"></option>
                      <option value="D5W"></option>
                    </datalist>
                  </div>
                </div>
                <div class="col-3 px-0">
                  <div class="input-group input-group-sm mb-3 pr-1 tooltip-container">
                    <div class="input-group-prepend">
                      <span class="input-group-text py-0 bg-input-tag px-1">每日</span>
                    </div>
                    <input
                      :class="{'input-warn':wm.feed_freq==5||wm.feed_freq==7,'input-ok':wm.feed_freq==1||wm.feed_freq==2||wm.feed_freq==3||wm.feed_freq==4||wm.feed_freq==6||wm.feed_freq==8}"
                      type="number"
                      min="1"
                      max="8"
                      form="novalidatedform"
                      class="form-control py-0 text-center"
                      v-model="wm.feed_freq"
                    >
                    <span
                      class="tooltiptext no-arrow offset-20"
                      v-show="wm.feed_freq==1||wm.feed_freq==2||wm.feed_freq==3||wm.feed_freq==4||wm.feed_freq==6||wm.feed_freq==8"
                    >
                      <div class="mx-1">q{{Math.round(24/wm.feed_freq)}}h</div>
                    </span>
                    <div class="input-group-append">
                      <span class="input-group-text py-0 bg-input-tag px-1">餐</span>
                    </div>
                  </div>
                </div>
                <div class="col-3 px-0 pr-1">
                  <div class="input-group input-group-sm mb-3 tooltip-container">
                    <div class="input-group-prepend">
                      <span class="input-group-text py-0 bg-input-tag px-1">每餐</span>
                    </div>
                    <input
                      :class="{'input-ok':feed_perKg>0&&feed_perKg<=150,'input-warn':feed_perKg>150&&feed_perKg<=200,'input-error':feed_perKg>200}"
                      type="number"
                      min="0"
                      form="novalidatedform"
                      class="form-control py-0 text-center"
                      v-model="wm.feed_amount"
                    >
                    <span
                      class="tooltiptext no-arrow offset-40"
                      v-show="feed_perKg&&wm.bw>0"
                    >
                      <div class="mx-1">{{feed_perKg}}
                        <span class="text-xs">ml/kg/day</span>
                      </div>
                    </span>
                    <div class="input-group-append">
                      <span class="input-group-text py-0 bg-input-tag px-1">ml</span>
                    </div>
                  </div>
                </div>
                <div class="col-3 px-0">
                  <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text py-0 bg-input-tag px-1">總量
                      </span>
                    </div>
                    <input
                      type="number"
                      readonly
                      tabindex="-1"
                      class="form-control py-0 text-center"
                      v-model="wm.feed_total"
                    >
                    <div class="input-group-append">
                      <span class="input-group-text py-0 bg-input-tag px-1">ml</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-light bg-info text-sm">Lipid
              <div
                class="add-btn float-right px-2"
                @click="clearLipid"
              >
                <span>&times;</span>
              </div>
            </div>
            <div class="container mt-1">
              <div class="row">
                <div class="col-4 px-0 tooltip-container">
                  <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend ">
                      <span class="input-group-text py-0 bg-input-tag px-1">目標</span>
                    </div>
                    <input
                      :class="{'input-error':wm.lipid_perKg>3.5,'input-warn':wm.lipid_perKg>3,'input-ok':wm.lipid_perKg>0}"
                      type="number"
                      step="0.1"
                      min="0"
                      max="4"
                      form="novalidatedform"
                      class="form-control py-0 text-center"
                      v-model="wm.lipid_perKg"
                    >
                    <span class="tooltiptext">
                      <div class="mx-1">建議 0.5-3 g/kg/day</div>
                    </span>
                    <div class="input-group-append">
                      <span class="input-group-text py-0 bg-input-tag px-1">g/kg</span>
                    </div>
                  </div>
                </div>
                <div class="col-4 px-0">
                  <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text py-0 bg-input-tag px-1">in 20hr
                      </span>
                    </div>
                    <input
                      type="number"
                      readonly
                      tabindex="-1"
                      class="form-control py-0 text-center"
                      v-model="wm.lipid_perHour"
                    >
                    <div class="input-group-append">
                      <span class="input-group-text py-0 bg-input-tag px-1">ml/hr
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-4 px-0 px-1">
                  <div class="input-group input-group-sm mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text py-0 bg-input-tag px-1">總量</span>
                    </div>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      form="novalidatedform"
                      readonly
                      tabindex="-1"
                      class="form-control py-0 text-center"
                      v-model="wm.lipid_perDay"
                    >
                    <div class="input-group-append">
                      <span class="input-group-text py-0 bg-input-tag px-1">ml</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-light bg-info text-sm mt-2">
              <span class="pl-2">Bolus Infusion</span>
              <div class="add-btn float-right">
                <div
                  class="relative px-2 tooltip-container"
                  v-on:click="addBolusVol($event)"
                > +
                  <span class="tooltiptext snap-button px-1 width-80px text-left">
                    <div
                      class="mx-1 add-hover"
                      v-on:click="addBolusVol_transfusion($event)"
                    >血品(15ml/kg)</div>
                  </span>
                </div>
              </div>

            </div>

            <div
              class="text-muted mb-3"
              v-show="bolusVol.length==0"
            >no data</div>
            <table
              class="table table-sm"
              v-show="bolusVol.length>0"
            >
              <thead>
                <tr>
                  <th
                    class="py-0"
                    scope="col"
                  >Item</th>
                  <th
                    class="py-0 w100p"
                    scope="col"
                  >ml/day</th>
                  <th
                    class="py-0 w100p"
                    scope="col"
                  >Na(mEq/L)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(e,i) in bolusVol"
                  :key="i"
                >
                  <td><input
                      type="text"
                      :class="{'input-ok':e.item!=''}"
                      class="form-control form-control-sm item py-0"
                      v-model="e.item"
                    ></td>
                  <td>
                    <div class="tooltip-container relative">
                      <input
                        type="number"
                        :class="{'input-ok':e.perDay>0&&e.perDay/wm.bw*1000<=150,'input-error':e.perDay/wm.bw*1000>150}"
                        min="0"
                        step="1"
                        class="form-control form-control-sm value py-0 text-center w100"
                        v-model="e.perDay"
                      >
                      <span
                        class="tooltiptext offset-40 no-arrow"
                        v-if="wm.bw>0"
                      >{{Math.round(e.perDay/wm.bw*1000)}}
                        <span class="text-xs">ml/kg/day</span>
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="tooltip-container relative">
                      <input
                        type="number"
                        :class="{'input-ok':e.perDay*e.na/wm.bw>0&&e.perDay*e.na/wm.bw<4,'input-warn':e.perDay*e.na/wm.bw>=4&&e.perDay*e.na/wm.bw<6,'input-error':e.perDay*e.na/wm.bw>=6}"
                        min="0"
                        step="5"
                        class="form-control form-control-sm value py-0 text-center w100"
                        v-model="e.na"
                      >
                      <span
                        class="tooltiptext offset-40 no-arrow"
                        v-if="wm.bw>0&&e.perDay>0&&e.na>0"
                      >{{Math.roundTo(e.perDay*e.na/wm.bw,1)}}
                        <span class="text-xs">mEq/kg/day</span>
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      tabindex="-1"
                      class="close"
                      @click="removeBolusVol(i)"
                    >
                      <span>&times;</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="text-light bg-info text-sm pl-3">Continous Infusion
              <div class="add-btn float-right">
                <div
                  class="relative px-2 tooltip-container"
                  v-on:click="addContVol($event)"
                > +
                  <span class="tooltiptext snap-button px-1 width-80px text-left">
                    <div
                      class="mx-1 add-hover"
                      v-on:click="addContVol_Aline_S($event)"
                    >A-line S</div>
                    <div
                      class="mx-1 add-hover"
                      v-on:click="addContVol_Aline_HS($event)"
                    >A-line 1/2S</div>
                    <div
                      class="mx-1 add-hover"
                      v-on:click="addContVol_D10W($event)"
                    >D10W</div>
                    <div
                      class="mx-1 add-hover"
                      v-on:click="addContVol_Taita5($event)"
                    >Taita5</div>
                    <div
                      class="mx-1 add-hover"
                      v-on:click="addContVol_PN($event)"
                    >PN</div>
                  </span>
                </div>
              </div>
            </div>
            <div
              class="text-muted mb-3"
              v-show="continousVol.length==0"
            >no data</div>
            <table
              class="table table-sm"
              v-show="continousVol.length>0"
            >
              <thead>
                <tr>
                  <th
                    class="py-0 "
                    scope="col"
                  >Item</th>
                  <th
                    class="py-0"
                    scope="col"
                  >ml/hr</th>
                  <th
                    class="py-0"
                    scope="col"
                  >ml/day</th>
                  <th
                    class="py-0"
                    scope="col"
                  >Dex.(%)</th>
                  <th
                    class="py-0"
                    scope="col"
                  >Na(mEq/L)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(e,i) in continousVol"
                  :key="i"
                >
                  <td>
                    <div class="tooltip-container relative">
                      <input
                        type="text"
                        :class="{'input-ok':e.item!=''&&e.item.toString().toLowerCase().trim()!='pn','input-selected':e.item.toString().toLowerCase().trim()=='pn'}"
                        class="form-control form-control-sm item py-0 text-center"
                        v-model="e.item"
                      >
                      <span
                        class="tooltiptext p-0 px-1 offset-40 no-arrow"
                        v-if="e.item.toString().toLowerCase().trim()=='pn'"
                      >
                        <span class="text-xs">(連結PN表格)</span>
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="tooltip-container relative">
                      <input
                        type="number"
                        :readonly="e.item.toString().toLowerCase().trim()=='pn'"
                        :class="{'input-grey':e.item.toString().toLowerCase().trim()=='pn','input-ok':e.perDay>0&&e.perDay/wm.bw*1000<=120,'input-warn':e.perDay>0&&e.perDay/wm.bw*1000>120&&e.perDay/wm.bw*1000<=150,'input-error':e.perDay/wm.bw*1000>150}"
                        min="0"
                        step="0.1"
                        form="novalidatedform"
                        class="form-control form-control-sm value py-0 text-center"
                        v-model="e.perHour"
                      >
                      <span
                        class="tooltiptext offset-40 no-arrow"
                        v-if="wm.bw>0"
                      >{{Math.round(e.perDay/wm.bw*1000)}}
                        <span class="text-xs">ml/kg/day</span>
                      </span>
                    </div>
                  </td>
                  <td><input
                      type="number"
                      readonly
                      tabindex="-1"
                      min="0"
                      step="0.1"
                      form="novalidatedform"
                      class="form-control form-control-sm value py-0 text-center"
                      v-model="e.perDay"
                    ></td>
                  <td>
                    <div class="tooltip-container relative">
                      <input
                        type="number"
                        :readonly="e.item.toString().toLowerCase().trim()=='pn'"
                        :class="{'input-grey':e.item.toString().toLowerCase().trim()=='pn','input-ok':e.dex>0&&e.dex<=20,'input-warn':e.dex>20&&e.dex<=25,'input-error':e.dex>25}"
                        min="0"
                        step="1"
                        form="novalidatedform"
                        class="form-control form-control-sm value py-0 text-center"
                        v-model="e.dex"
                      >
                      <span
                        class="tooltiptext offset-40 no-arrow"
                        v-if="wm.bw>0&&e.perDay*e.dex>0"
                      >GIR {{Math.roundTo(e.perDay*e.dex*10/wm.bw*1000/24/60,1)}}</span>
                    </div>
                  </td>
                  <td>
                    <div class="tooltip-container relative">
                      <input
                        type="number"
                        :readonly="e.item.toString().toLowerCase().trim()=='pn'"
                        :class="{'input-grey':e.item.toString().toLowerCase().trim()=='pn','input-ok':e.na>0&&e.perDay*e.na/wm.bw<4,'input-error':e.perDay*e.na/wm.bw>=6,'input-warn':e.perDay*e.na/wm.bw>=4}"
                        min="0"
                        step="5"
                        form="novalidatedform"
                        class="form-control form-control-sm value py-0 text-center"
                        v-model="e.na"
                      >
                      <span
                        class="tooltiptext offset-40 no-arrow"
                        v-if="wm.bw>0&&e.perDay>0&&e.na>0"
                      >{{Math.roundTo(e.perDay*e.na/wm.bw,1)}}
                        <span class="text-xs">mEq/kg/D</span>
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      tabindex="-1"
                      class="close"
                      v-on:click="removeContVol(i)"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
        <div class="col flex py-2 m-1 border text-center">
          <div class="flex-non-grow">
            <div class="text-light bg-info">
              <span class="pl-2">PN Summary</span>
              <div
                class="add-btn float-right px-2"
                @click="()=>toggleExpress=!toggleExpress"
              >
                ■</div>
            </div>
            <table class="table table-sm summary table-info table-borderless">
              <thead>
                <tr>
                  <th
                    class="py-0"
                    scope="col"
                  >PN Vol.
                    <span class="text-sm text-muted">(ml/hr)</span>
                  </th>
                  <th
                    class="py-0"
                    scope="col"
                  >Inf. Rate
                    <span class="text-sm text-muted">(ml/hr)</span>
                  </th>
                  <th
                    class="py-0"
                    scope="col"
                  >GIR
                    <span class="text-sm text-muted">(mg/kg/min)</span>
                  </th>
                  <th
                    class="py-0"
                    scope="col"
                  >Osm
                    <span class="text-sm text-muted">(mOsm/kg)</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-xl py-0">{{pn.pn_summary_volume}}</td>
                  <td class="text-xl py-0">{{pn.pn_summary_rate}}</td>
                  <td
                    class="text-xl py-0"
                    :class="{'text-warn':pn.pn_summary_gir>15}"
                  >{{pn.pn_summary_gir}}</td>
                  <td
                    class="text-xl py-0"
                    :class="{'text-central':pn.pn_summary_osm>=900}"
                  >{{pn.pn_summary_osm}}
                    <span
                      class="centraltooltip"
                      v-show="pn.pn_summary_osm>=900"
                    >
                      <div class="mx-1">需central line</div>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="scrollable flex-grow">
            <div class="text-light bg-info text-sm">Parental Nutrition Volume</div>
            <div class="container">
              <div class="row ">
                <div class="col-4 px-0">
                  <div class="input-group input-group-sm mb-3 mt-1 tooltip-container">
                    <div class="input-group-prepend">
                      <span class="input-group-text py-0 px-1">Desired</span>
                    </div>
                    <input
                      type="number"
                      :class="{'input-error':pn_perKg>150&&pn.bw,'input-warn':pn_perKg>120&&pn.bw,'input-ok':pn_perKg>0}"
                      min="0"
                      step="2"
                      class="form-control py-0 text-center"
                      v-model="pn.pn_desired"
                    >
                    <span
                      class="tooltiptext no-arrow offset-20"
                      v-show="pn_perKg&&pn.bw"
                    >
                      <div class="mx-1">{{pn_perKg}}
                        <span class="text-xs"> ml/kg/day</span>
                      </div>
                    </span>
                    <div class="input-group-append py-0">
                      <span class="input-group-text py-0 px-1">ml</span>
                    </div>
                  </div>
                </div>
                <div class="col-4 px-0">
                  <div class="input-group input-group-sm mb-3 mt-1 px-1 tooltip-container">
                    <div class="input-group-prepend">
                      <span class="input-group-text py-0 px-1">Priming</span>
                    </div>
                    <input
                      type="number"
                      :class="{'input-error':pn.pn_priming>50,'input-warn':pn.pn_priming>0&&(pn.pn_priming>30||pn.pn_priming<30),'input-ok':pn.pn_priming==30}"
                      min="0"
                      step="1"
                      class="form-control py-0 text-center"
                      v-model="pn.pn_priming"
                    >
                    <span class="tooltiptext offset-40">
                      <div class="mx-1">預設30ml</div>
                    </span>
                    <div class="input-group-append py-0">
                      <span class="input-group-text py-0 px-1">ml</span>
                    </div>
                  </div>
                </div>
                <div class="col-4 px-0">
                  <div class="input-group input-group-sm mb-3 mt-1 tooltip-container">
                    <div class="input-group-prepend">
                      <span class="input-group-text py-0 px-1">Prescribe</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      readonly
                      tabindex="-1"
                      class="form-control py-0 text-center"
                      v-model="pn.pn_prescribe"
                    >
                    <span
                      class="tooltiptext offset-40"
                      :class="{'showtooltip':pn.pn_prescribe>0&&pn.pn_prescribe<50}"
                    >開立量需大於50ml</span>
                    <div class="input-group-append py-0">
                      <span class="input-group-text py-0 px-1">ml</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-light bg-info text-sm">Macro Nutrition</div>
            <table class="table table-sm">
              <thead>
                <tr>
                  <th
                    class="py-0"
                    scope="col"
                  >Item</th>
                  <th
                    class="py-0"
                    scope="col"
                  >Target</th>
                  <th
                    class="py-0"
                    scope="col"
                  >Concentrate</th>
                  <th
                    class="py-0"
                    scope="col"
                  >Prescribe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    class="text-sm pointer"
                    @click="()=>{if(pn.aa_perKg==0){pn.aa_perKg=3}else{pn.aa_perKg=''}}"
                  >AA</td>
                  <td>
                    <div class="input-group input-group-sm tooltip-container">
                      <input
                        type="number"
                        :class="{'input-error':pn.aa_perKg>4,'input-warn':pn.aa_perKg>3.5&&pn.aa_perKg<=4,'input-ok':pn.aa_perKg>0&&pn.aa_perKg<=3.5}"
                        min="0"
                        step="0.1"
                        max="5"
                        class="form-control form-control-sm text-center py-0"
                        v-model="pn.aa_perKg"
                      >
                      <span class="tooltiptext">建議 2-3 g/kg/day</span>
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">g/kg</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm tooltip-container">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        readonly
                        tabindex="-1"
                        :class="{'input-error':pn.aa_conc>5}"
                        class="form-control form-control-sm text-center py-0"
                        v-model="pn.aa_conc"
                      >
                      <span
                        class="tooltiptext"
                        :class="{'showtooltip':pn.aa_conc>5}"
                      >AA濃度需小於5%</span>
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">%</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        readonly
                        tabindex="-1"
                        class="form-control form-control-sm py-0 text-center"
                        v-model="pn.aa_prescribe"
                      >
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">g</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="text-sm">Glu</td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        readonly
                        tabindex="-1"
                        class="form-control form-control-sm py-0 text-center"
                        v-model="pn.glu_perKg"
                      >
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">g/kg</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        :class="{'input-ok':pn.glu_conc>0&&pn.glu_conc<=20,'input-warn':pn.glu_conc>20&&pn.glu_conc<=25,'input-error':pn.glu_conc>25}"
                        min="0"
                        max="25"
                        step="1"
                        class="form-control form-control-sm py-0 text-center"
                        v-model="pn.glu_conc"
                      >
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">%</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        readonly
                        tabindex="-1"
                        class="form-control form-control-sm py-0 text-center"
                        v-model="pn.glu_prescribe"
                      >
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">g</span>
                      </div>
                    </div>

                  </td>
                </tr>
              </tbody>
            </table>

            <div class="text-light bg-info text-sm">Electrolyte</div>
            <table class="table table-sm">
              <thead>
                <tr>
                  <th
                    class="py-0"
                    scope="col"
                  >Item</th>
                  <th
                    class="py-0 w160p"
                    scope="col"
                  >Target/Day</th>
                  <th
                    class="py-0"
                    scope="col"
                  >Concentrate</th>
                  <th
                    class="py-0"
                    scope="col"
                  >Prescribe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    class="text-sm pointer"
                    @click="()=>{if(pn.na_perKg==0){pn.na_perKg=2}else{pn.na_perKg=''}}"
                  >Na</td>
                  <td>
                    <div class="input-group input-group-sm tooltip-container">
                      <input
                        type="number"
                        :class="{'input-error':pn.na_perKg>6,'input-warn':pn.na_perKg>4&&pn.na_perKg<=6,'input-ok':pn.na_perKg>0&&pn.na_perKg<=4}"
                        min="0"
                        max="8"
                        step="0.1"
                        class="form-control form-control-sm py-0 text-center"
                        v-model="pn.na_perKg"
                      >
                      <span class="tooltiptext offset-80">建議 2-4 mEq/kg/day</span>

                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mEq/kg</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm tooltip-container">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        class="form-control form-control-sm py-0 text-center"
                        :class="{'input-error':pn.orgp_conc&&(pn.na_conc<2*pn.orgp_conc)}"
                        readonly
                        tabindex="-1"
                        v-model="pn.na_conc"
                      >
                      <span
                        class="tooltiptext-notshow"
                        :class="{'showtooltip':pn.orgp_conc&&(pn.na_conc<2*pn.orgp_conc)}"
                      >Na:有機磷 需>2</span>
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mEq/L</span>
                      </div>

                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        class="form-control form-control-sm py-0 text-center"
                        readonly
                        tabindex="-1"
                        v-model="pn.na_prescribe"
                      >
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mEq</span>
                      </div>
                    </div>

                  </td>
                </tr>
                <tr>
                  <td
                    class="text-sm pointer"
                    @click="()=>{if(pn.k_perKg==0){pn.k_perKg=2}else{pn.k_perKg=''}}"
                  >K</td>
                  <td>
                    <div class="input-group input-group-sm tooltip-container">
                      <input
                        :class="{'input-error':pn.k_perKg>4,'input-warn':pn.k_perKg>3&&pn.k_perKg<=4,'input-ok':pn.k_perKg>0&&pn.k_perKg<=3}"
                        type="number"
                        min="0"
                        max="4"
                        step="0.1"
                        class="form-control form-control-sm py-0 text-center"
                        v-model="pn.k_perKg"
                      >
                      <span class="tooltiptext offset-80">建議 2-3 mEq/kg/day</span>
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mEq/kg</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        class="form-control form-control-sm py-0 text-center"
                        readonly
                        tabindex="-1"
                        v-model="pn.k_conc"
                      >
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mEq/L</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        class="form-control form-control-sm py-0 text-center"
                        readonly
                        tabindex="-1"
                        v-model="pn.k_prescribe"
                      >
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mEq</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    class="text-sm pointer"
                    @click="()=>{if(pn.ca_perKg==0){pn.ca_perKg=2}else{pn.ca_perKg=''}}"
                  >Ca</td>
                  <td>
                    <div class="input-group input-group-sm tooltip-container">
                      <input
                        type="number"
                        :class="{'input-error':pn.ca_perKg>3,'input-warn':pn.ca_perKg>2&&pn.ca_perKg<=3,'input-ok':pn.ca_perKg>0&&pn.ca_perKg<=2}"
                        min="0"
                        max="3"
                        step="0.1"
                        class="form-control form-control-sm py-0 text-center"
                        v-model="pn.ca_perKg"
                      >
                      <span class="tooltiptext offset-80">建議 2-3 mEq/kg/day 需中央靜脈</span>
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mEq/kg</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm tooltip-container">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        :class="{'input-error':checkCaP}"
                        class="form-control form-control-sm py-0 text-center"
                        readonly
                        tabindex="-1"
                        v-model="pn.ca_conc"
                      >
                      <span
                        class="tooltiptext-notshow"
                        :class="{'showtooltip':checkCaP}"
                      >{{checkCaP}}</span>
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mEq/L</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        class="form-control form-control-sm py-0 text-center"
                        readonly
                        tabindex="-1"
                        v-model="pn.ca_prescribe"
                      >
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mEq</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    class="text-sm pointer"
                    @click="()=>{if(pn.p_perKg==0){pn.p_perKg=1;pn.orgp_perKg=''}else{pn.p_perKg=''}}"
                  >I.P</td>
                  <td>
                    <div class="input-group input-group-sm tooltip-container">
                      <input
                        type="number"
                        :class="{'input-error':(pn.p_perKg>3)||(pn.p_perKg>0&&pn.orgp_perKg>0),'input-warn':pn.p_perKg>2&&pn.p_perKg<=3,'input-ok':pn.p_perKg>0&&pn.p_perKg<=2}"
                        min="0"
                        max="3"
                        step="0.1"
                        class="form-control form-control-sm py-0 text-center"
                        v-model="pn.p_perKg"
                      >

                      <span
                        class="tooltiptext offset-80"
                        v-show="!(pn.p_perKg>0&&pn.orgp_perKg>0)"
                      >建議 1-1.5 mmol/kg/day</span>
                      <span
                        class="tooltiptext-notshow"
                        :class="{'showtooltip':(pn.p_perKg>0&&pn.orgp_perKg>0)}"
                      >不可同時開立有機/無機磷</span>
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mmol/kg</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm tooltip-container">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        :class="{'input-error':pn.p_conc / pn.k_conc >= 3/4.4}"
                        class="form-control form-control-sm py-0 text-center"
                        readonly
                        tabindex="-1"
                        v-model="pn.p_conc"
                      >
                      <span
                        class="tooltiptext-notshow"
                        :class="{'showtooltip':(pn.p_conc / pn.k_conc >= 3/4.4)}"
                      >鉀:無機磷需大於4.4:3</span>
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mmol/L</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        class="form-control form-control-sm py-0 text-center"
                        readonly
                        tabindex="-1"
                        v-model="pn.p_prescribe"
                      >
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mmol</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    class="text-sm pointer"
                    @click="()=>{if(pn.orgp_perKg==0){pn.orgp_perKg=1;pn.p_perKg=''}else{pn.orgp_perKg=''}}"
                  >Org.P</td>
                  <td>
                    <div class="input-group input-group-sm tooltip-container">
                      <input
                        type="number"
                        :class="{'input-error':pn.orgp_perKg>3,'input-warn':pn.orgp_perKg>2&&pn.orgp_perKg<=3,'input-ok':pn.orgp_perKg>0&&pn.orgp_perKg<=2}"
                        min="0"
                        max="3"
                        step="0.1"
                        class="form-control form-control-sm py-0 text-center"
                        v-model="pn.orgp_perKg"
                      >
                      <span class="tooltiptext offset-80">建議 1-1.5 mmol/kg/day</span>
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mmol/kg</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        class="form-control form-control-sm py-0 text-center"
                        :class="{'input-error':pn.orgp_conc>=25 && checkCaP}"
                        readonly
                        tabindex="-1"
                        v-model="pn.orgp_conc"
                      >
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mmol/L</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        class="form-control form-control-sm py-0 text-center"
                        readonly
                        tabindex="-1"
                        v-model="pn.orgp_prescribe"
                      >
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mmol</span>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    class="text-sm pointer"
                    @click="()=>{if(pn.mg_perKg==0){pn.mg_perKg=0.25}else{pn.mg_perKg=''}}"
                  >Mg</td>
                  <td>
                    <div class="input-group input-group-sm tooltip-container">
                      <input
                        type="number"
                        :class="{'input-error':pn.mg_perKg>1,'input-warn':pn.mg_perKg>0.5&&pn.mg_perKg<=1,'input-ok':pn.mg_perKg>0&&pn.mg_perKg<=0.5}"
                        min="0"
                        max="1"
                        step="0.05"
                        class="form-control form-control-sm py-0 text-center"
                        v-model="pn.mg_perKg"
                      >
                      <span class="tooltiptext offset-80">建議 0.25-0.5 mEq/kg/day</span>
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mEq/kg</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        class="form-control form-control-sm py-0 text-center"
                        readonly
                        tabindex="-1"
                        v-model="pn.mg_conc"
                      >
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mEq/L</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        class="form-control form-control-sm py-0 text-center"
                        readonly
                        tabindex="-1"
                        v-model="pn.mg_prescribe"
                      >
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">mEq</span>
                      </div>
                    </div>
                  </td>
                </tr>

              </tbody>
            </table>

            <div class="text-light bg-info text-sm">Micro Nutrition & Others</div>
            <table class="table table-sm">
              <thead>
                <tr>
                  <th
                    class="py-0"
                    scope="col micro-row-name"
                  >Item</th>
                  <th
                    class="py-0"
                    scope="col"
                  >Target</th>
                  <th
                    class="py-0"
                    scope="col"
                  >Prescribe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    class="text-sm micro-row-name pointer"
                    @click="()=>{if(pn.lyop_perKg==0){pn.lyop_perKg=0.25}else{pn.lyop_perKg=''}}"
                  >Lyo-P K</td>
                  <td>
                    <div class="input-group input-group-sm tooltip-container">
                      <input
                        type="number"
                        min="0"
                        step="0.05"
                        max="1.5"
                        :class="{'input-error':pn.lyop_perKg>1,'input-warn':pn.lyop_perKg>0.5&&pn.lyop_perKg<=1,'input-ok':pn.lyop_perKg>0&&pn.lyop_perKg<=0.5}"
                        class="form-control form-control-sm py-0 text-center"
                        v-model="pn.lyop_perKg"
                      >
                      <span class="tooltiptext offset-80">建議 0.25 ml/kg/day</span>
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">ml/kg</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        class="form-control form-control-sm py-0 text-center"
                        readonly
                        tabindex="-1"
                        v-model="pn.lyop_prescribe"
                      >
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">ml</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    class="text-sm micro-row-name pointer"
                    @click="()=>{if(pn.te_perKg==0){pn.te_perKg=0.5}else{pn.te_perKg=''}}"
                  >Peditrace</td>
                  <td>
                    <div class="input-group input-group-sm tooltip-container">
                      <input
                        type="number"
                        min="0"
                        step="0.05"
                        :class="{'input-error':pn.te_perKg>1.5,'input-warn':pn.te_perKg>1&&pn.te_perKg<=1.5,'input-ok':pn.te_perKg>0&&pn.te_perKg<=1}"
                        class="form-control form-control-sm py-0 text-center"
                        v-model="pn.te_perKg"
                      >
                      <span class="tooltiptext offset-80">建議 0.5 ml/kg/day</span>
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">ml/kg</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        class="form-control form-control-sm py-0 text-center"
                        readonly
                        tabindex="-1"
                        v-model="pn.te_prescribe"
                      >
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">ml</span>
                      </div>
                    </div>
                  </td>
                </tr>


                <tr>
                  <td
                    class="text-sm micro-row-name pointer"
                    @click="()=>{if(pn.heparin_perML==0){pn.heparin_perML=0.25}else{pn.heparin_perML=''}}"
                  >Heparin(1:40)</td>
                  <td>
                    <div class="input-group input-group-sm tooltip-container">
                      <input
                        type="number"
                        min="0"
                        step="0.25"
                        :class="{'input-error':pn.heparin_perML>0.5,'input-warn':pn.heparin_perML>1&&pn.heparin_perML<=1.5,'input-ok':pn.heparin_perML>0&&pn.heparin_perML<=0.5}"
                        class="form-control form-control-sm py-0 text-center"
                        v-model="pn.heparin_perML"
                      >
                      <span class="tooltiptext offset-80">bbw&lt;1500g: 0.25U/ml; bbw&gt;1500g: 0.5U/ml</span>
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">U / ml PN</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        class="form-control form-control-sm py-0 text-center"
                        readonly
                        tabindex="-1"
                        v-model="pn.heparin_prescribe"
                      >
                      <div class="input-group-append py-0">
                        <span class="input-group-text py-0 text-xs">ml</span>
                      </div>
                    </div>
                  </td>
                </tr>


              </tbody>
            </table>

          </div>

        </div>

      </div>

    </div>
    <div
      class="express-modal"
      v-show="toggleExpress"
      @click="()=>toggleExpress=!toggleExpress"
    >
      <div
        class='express'
        @click.stop
      >
        <div
          class="pl-4 flex-row cell-size"
          style="color:black;font-size:1.2rem;"
        >
          <div class="field flex-grow">
            <span class="font-weight-bold"> TPN P-{{pn.p_type}}</span>
            , 總體積:
            <span class="font-weight-bold"> {{pn.pn_prescribe}}</span>
            ml
          </div>
        </div>

        <div class="pl-4 flex-row cell-size" />
        <div class="flex">
          <div class="flex-grow">

            <div class="pl-4 flex-row cell-size">
              <div class="field flex-grow">Admin Route</div>
              <div class="fake-input flex-grow">{{pn.pn_summary_osm>=900?"Central":(pn.ca_conc>0?"Central(for Ca)":"Perihperal")}}</div>
              <div class="unit flex-non-grow"></div>
            </div>
            <div class="pl-4 flex-row  cell-size" />
            <div class="pl-4 flex-row  cell-size">
              <div class="field flex-grow">50%Dextrose</div>
              <div class="fake-input flex-grow">{{pn.glu_prescribe}}</div>
              <div class="unit flex-non-grow">gm</div>
            </div>
            <div class="pl-4 flex-row  cell-size">
              <div class="field flex-grow">Na</div>
              <div class="fake-input flex-grow">{{pn.na_prescribe}}</div>
              <div class="unit flex-non-grow">mEq</div>
            </div>
            <div class="pl-4 flex-row  cell-size">
              <div class="field flex-grow">K</div>
              <div class="fake-input flex-grow">{{pn.k_prescribe}}</div>
              <div class="unit flex-non-grow">mEq</div>
            </div>
            <div class="pl-4 flex-row  cell-size" />
            <div class="pl-4 flex-row  cell-size">
              <div class="field flex-grow">5)PED ONLY</div>
            </div>
            <div class="pl-4 flex-row cell-size">
              <div class="field flex-grow">Light-Protection</div>
              <div class="fake-input flex-grow">{{pn.p_type>6?"N":"Y"}}</div>
              <div class="unit flex-non-grow"></div>
            </div>
            <div class="pl-4 flex-row   cell-size">
              <div class="field flex-grow">10%Amino-infant</div>
              <div class="fake-input flex-grow">{{pn.aa_prescribe}}</div>
              <div class="unit flex-non-grow">gm</div>
            </div>
            <div class="pl-4 flex-row  cell-size">
              <div class="field flex-grow">Peditrace</div>
              <div class="fake-input flex-grow">{{pn.te_prescribe}}</div>
              <div class="unit flex-non-grow">ml</div>
            </div>

          </div>
          <div class="flex-grow">
            <div class="pl-4 flex-row cell-size">
              <div class="field flex-grow"></div>
              <div class="unit flex-non-grow"></div>
            </div>
            <div class="pl-4 flex-row cell-size">
              <div class="field flex-grow">Ca</div>
              <div class="fake-input flex-grow">{{pn.ca_prescribe}}</div>
              <div class="unit flex-non-grow">mEq</div>
            </div>
            <div class="pl-4 flex-row cell-size">
              <div class="field flex-grow">Mg</div>
              <div class="fake-input flex-grow">{{pn.mg_prescribe}}</div>
              <div class="unit flex-non-grow">mEq</div>
            </div>
            <div class="pl-4 flex-row cell-size">
              <div class="field flex-grow">P</div>
              <div class="fake-input flex-grow">{{pn.p_prescribe+pn.orgp_prescribe}}</div>
              <div class="unit flex-non-grow">mmol</div>
            </div>
            <div class="pl-4 flex-row cell-size" />
            <div class="pl-4 flex-row  cell-size">
              <div class="field flex-grow">Lyopovigent-VK</div>
              <div class="fake-input flex-grow">{{pn.lyop_prescribe}}</div>
              <div class="unit flex-non-grow">ml</div>
            </div>
            <div class="pl-4 flex-row cell-size" />
            <div class="pl-4 flex-row  cell-size">
              <div class="field flex-grow">Glycophos</div>
              <div class="fake-input flex-grow">{{pn.orgp_prescribe}}</div>
              <div class="unit flex-non-grow">ml</div>
            </div>
            <div class="pl-4 flex-row  cell-size">
              <div class="field flex-grow">Zinc. Sulfate</div>
              <div class="fake-input flex-grow">尚未啟用</div>
              <div class="unit flex-non-grow">ml</div>
            </div>
             <div class="pl-4 flex-row  cell-size">
              <div class="field flex-grow">1/40 Agglutex</div>
              <div class="fake-input flex-grow">{{pn.heparin_prescribe}}</div>
              <div class="unit flex-non-grow">ml</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
Math.roundTo = function (number, digit) {
  let pow10 = Math.pow(10, digit);
  let result = Math.round(number * pow10) / pow10;
  return result ? result : "";
};
export default {
  name: "watermeter-table",
  props: ["wm", "pn", "temp"],
  data: function () {
    return {
      continousVol: [],
      bolusVol: [],
      toggleExpress: false,
    };
  },
  methods: {
    clearFeed() {
      let wm = this.wm;
      wm.feed_amount = "";
      wm.feed_freq = "";
    },
    clearLipid() {
      let wm = this.wm;
      wm.lipid_perKg = "";
    },
    addContVol(e) {
      let vm = this;
      let continousVol = vm.continousVol;
      continousVol.push({
        item: "",
        perHour: "",
        perDay: "",
        dex: "",
        na: "",
      });
      e.stopPropagation(e);
    },
    addContVol_Aline_S(e) {
      let vm = this;
      let continousVol = vm.continousVol;
      continousVol.push({
        item: "A-line(Saline)",
        perHour: "0.3",
        perDay: "",
        dex: "",
        na: 154,
      });
      e.stopPropagation(e);
    },
    addContVol_Aline_HS(e) {
      let vm = this;
      let continousVol = vm.continousVol;
      continousVol.push({
        item: "A-line(1/2S)",
        perHour: "0.3",
        perDay: "",
        dex: "",
        na: 77,
      });
      e.stopPropagation(e);
    },
    addContVol_D10W(e) {
      let vm = this;
      let continousVol = vm.continousVol;
      continousVol.push({
        item: "D10W",
        perHour: "",
        perDay: "",
        dex: "10",
        na: "",
      });
      e.stopPropagation(e);
    },
    addContVol_Taita5(e) {
      let vm = this;
      let continousVol = vm.continousVol;
      continousVol.push({
        item: "Taita 5",
        perHour: "",
        perDay: "",
        dex: "10",
        na: "36",
      });
      e.stopPropagation(e);
    },
    addContVol_PN(e) {
      let vm = this;
      let continousVol = vm.continousVol;
      continousVol.push({
        item: "PN",
        perHour: vm.pn.pn_summary_rate == "-" ? 0 : vm.pn.pn_summary_rate,
        perDay: "",
        dex: vm.pn.glu_conc || 10,
        na: vm.pn.na_conc,
      });
      e.stopPropagation(e);
    },

    removeContVol(i) {
      let vm = this;
      let continousVol = vm.continousVol;
      continousVol.splice(i, 1);
    },
    renderContVol() {
      let vm = this;
      let continuousVolume = vm.wm.continuousVolume;
      vm.continousVol = [];
      if (!continuousVolume) {
        return;
      }
      vm.continousVol = JSON.parse(continuousVolume);
    },
    addBolusVol(e) {
      let vm = this;
      let bolusVol = vm.bolusVol;
      bolusVol.push({
        item: "",
        perDay: "",
        na: "",
      });
      e.stopPropagation(e);
    },
    addBolusVol_transfusion(e) {
      let vm = this;
      let bolusVol = vm.bolusVol;
      bolusVol.push({
        item: "血品:",
        perDay: Math.roundTo((15 * vm.wm.bw) / 1000, 0),
        na: 154,
      });
      e.stopPropagation();
    },
    removeBolusVol(i) {
      let vm = this;
      let bolusVol = vm.bolusVol;
      bolusVol.splice(i, 1);
    },
    renderBolusVol() {
      let vm = this;
      let bolusVolume = vm.wm.bolusVolume;
      vm.bolusVol = [];
      if (!bolusVolume) {
        return;
      }
      vm.bolusVol = JSON.parse(bolusVolume);
    },
    waterMeterSummary() {
      let vm = this;
      let wm = vm.wm;

      let wm_summary_volume = 0;
      let glucose_mg = 0;
      let sodium_mEq = 0;

      wm.feed_total = Math.roundTo(wm.feed_amount * wm.feed_freq, 1);
      wm_summary_volume += Number(wm.feed_total);

      vm.continousVol.forEach((e) => {
        e.perDay = Math.roundTo(e.perHour * 24, 1);
        wm_summary_volume += Number(e.perDay);
        glucose_mg += ((e.perDay * e.dex) / 100) * 1000;
        sodium_mEq += (e.perDay * e.na) / 1000;
      });

      vm.bolusVol.forEach((e) => {
        wm_summary_volume += Number(Math.roundTo(e.perDay, 1));
        sodium_mEq += (e.perDay * e.na) / 1000;
      });

      if (wm.bw) {
        wm.lipid_perDay = Math.roundTo(
          ((wm.bw * wm.lipid_perKg) / 1000) * 5,
          1
        );
        wm_summary_volume += wm.lipid_perDay;
        wm.lipid_perHour = Math.roundTo(wm.lipid_perDay / 20, 1);
      }

      if (wm_summary_volume == 0) {
        wm.wm_summary_volume = "-";
      } else {
        wm.wm_summary_volume = Math.roundTo(wm_summary_volume, 1);
      }

      if (wm.bw > 0 && wm_summary_volume > 0) {
        wm.wm_summary_daily = Math.roundTo(
          (wm_summary_volume / wm.bw) * 1000,
          1
        );
      } else {
        wm.wm_summary_daily = "-";
      }

      if (wm.bw > 0 && glucose_mg > 0) {
        wm.wm_summary_gir = Math.roundTo(
          ((glucose_mg / 24 / wm.bw) * 1000) / 60,
          1
        );
      } else {
        wm.wm_summary_gir = "-";
      }

      if (wm.bw > 0 && sodium_mEq > 0) {
        wm.wm_summary_na = Math.roundTo((sodium_mEq / wm.bw) * 1000, 1);
      } else {
        wm.wm_summary_na = "-";
      }
    },
    pnSummary() {
      let vm = this;
      let pn = vm.pn;
      if (pn.pn_desired > 0 && pn.bw > 0) {
        pn.pn_prescribe =
          Math.round(
            Math.roundTo(Number(pn.pn_desired) + Number(pn.pn_priming), 1) / 5
          ) * 5;

        pn.p_type = Math.min(Math.floor(pn.pn_prescribe / 100) + 1, 12);

        pn.aa_conc = Math.roundTo(
          ((pn.aa_perKg * pn.bw) / 1000 / pn.pn_desired) * 100,
          1
        );
        pn.aa_prescribe = Math.roundTo((pn.aa_conc * pn.pn_prescribe) / 100, 1);

        pn.glu_perKg = Math.roundTo(
          (((pn.glu_conc / 100) * pn.pn_desired) / pn.bw) * 1000,
          1
        );
        pn.glu_prescribe = Math.roundTo(
          (pn.glu_conc * pn.pn_prescribe) / 100,
          1
        );

        pn.na_conc = Math.roundTo((pn.na_perKg * pn.bw) / pn.pn_desired, 0);
        pn.na_prescribe = Math.roundTo(
          (pn.na_conc * pn.pn_prescribe) / 1000,
          1
        );

        pn.k_conc = Math.roundTo((pn.k_perKg * pn.bw) / pn.pn_desired, 0);
        pn.k_prescribe = Math.roundTo((pn.k_conc * pn.pn_prescribe) / 1000, 1);

        pn.ca_conc = Math.roundTo((pn.ca_perKg * pn.bw) / pn.pn_desired, 2);
        pn.ca_prescribe = Math.roundTo(
          (pn.ca_conc * pn.pn_prescribe) / 1000,
          2
        );

        pn.p_conc = Math.roundTo((pn.p_perKg * pn.bw) / pn.pn_desired, 2);
        pn.p_prescribe = Math.roundTo((pn.p_conc * pn.pn_prescribe) / 1000, 2);

        pn.orgp_conc = Math.roundTo((pn.orgp_perKg * pn.bw) / pn.pn_desired, 2);
        pn.orgp_prescribe = Math.roundTo(
          (pn.orgp_conc * pn.pn_prescribe) / 1000,
          2
        );

        pn.mg_conc = Math.roundTo((pn.mg_perKg * pn.bw) / pn.pn_desired, 2);
        pn.mg_prescribe = Math.roundTo(
          (pn.mg_conc * pn.pn_prescribe) / 1000,
          2
        );

        pn.te_prescribe = Math.roundTo(
          ((pn.te_perKg * pn.bw) / 1000 / pn.pn_desired) * pn.pn_prescribe,
          1
        );

        pn.lyop_prescribe = Math.roundTo(
          ((pn.lyop_perKg * pn.bw) / 1000 / pn.pn_desired) * pn.pn_prescribe,
          2
        );

        pn.heparin_prescribe = Math.roundTo(
          pn.heparin_perML * pn.pn_prescribe / 25,
          2
        );
        
      } else {
        pn.p_type = "";
        pn.pn_prescribe = "";
        pn.aa_conc = "";
        pn.aa_prescribe = "";
        pn.glu_perKg = "";
        pn.glu_prescribe = "";
        pn.na_conc = "";
        pn.na_prescribe = "";
        pn.k_conc = "";
        pn.k_prescribe = "";
        pn.ca_conc = "";
        pn.ca_prescribe = "";
        pn.mg_conc = "";
        pn.mg_prescribe = "";
        pn.p_conc = "";
        pn.p_prescribe = "";
        pn.orgp_conc = "";
        pn.orgp_prescribe = "";
        pn.te_prescribe = "";
        pn.lyop_prescribe = "";
        pn.heparin_prescribe = "";
      }
      if (pn.pn_desired > 0) {
        pn.pn_summary_volume = Math.roundTo(pn.pn_desired, 1);
      } else {
        pn.pn_summary_volume = "-";
      }

      let rate = Math.roundTo(pn.pn_desired / 24, 1);
      if (rate > 0) {
        pn.pn_summary_rate = rate;
      } else {
        pn.pn_summary_rate = "-";
      }

      let GIR = Math.roundTo((pn.glu_perKg * 1000) / 60 / 24, 1);
      if (GIR > 0) {
        pn.pn_summary_gir = GIR;
      } else {
        pn.pn_summary_gir = "-";
      }

      let OSM = Math.round(
        pn.glu_conc * 50 +
          pn.aa_conc * 100 +
          pn.na_conc * 2 +
          pn.k_conc * 2 +
          (pn.ca_conc * 1.4) / 2 +
          pn.p_conc * 2 +
          pn.orgp_conc * 2 +
          pn.mg_conc / 2
      );
      if (OSM > 0) {
        pn.pn_summary_osm = OSM;
      } else {
        pn.pn_summary_osm = "-";
      }

      let PNinWM = vm.continousVol.find(
        (e) => e.item.toString().toLowerCase().trim() == "pn"
      );

      if (PNinWM) {
        PNinWM.perHour = Math.roundTo(pn.pn_desired / 24, 1);
        PNinWM.dex = Math.roundTo(pn.glu_conc, 0);
        PNinWM.na = Math.roundTo(pn.na_conc, 0);
      }
    },
  },
  watch: {
    $route() {
      this.renderContVol();
      this.renderBolusVol();
      this.waterMeterSummary();
      this.pnSummary();
    },
    "wm.continuousVolume": function () {
      this.renderContVol();
    },
    continousVol: {
      handler: function () {
        let vm = this;
        vm.waterMeterSummary();
        let stringify = JSON.stringify(vm.continousVol);
        vm.temp.continuousVolume = stringify;
      },
      deep: true,
    },
    "wm.bolusVolume": function () {
      this.renderBolusVol();
    },
    bolusVol: {
      handler: function () {
        let vm = this;
        vm.waterMeterSummary();
        vm.temp.bolusVolume = JSON.stringify(vm.bolusVol);
      },
      deep: true,
    },
    wm: {
      handler: function () {
        this.waterMeterSummary();
      },
      deep: true,
    },
    pn: {
      handler: function () {
        this.pnSummary();
      },
      deep: true,
    },
  },
  computed: {
    pn_perKg() {
      let pn = this.pn;
      return Math.roundTo((pn.pn_desired / pn.bw) * 1000, 0);
    },
    feed_perKg() {
      let wm = this.wm;
      if (!wm.bw) {
        return "";
      }
      return Math.roundTo((wm.feed_total / wm.bw) * 1000, 0);
    },
    checkCaP() {
      let aa_conc = this.pn.aa_conc;
      let p_conc = this.pn.p_conc;
      let ca_conc = this.pn.ca_conc;
      let orgp_conc = this.pn.orgp_conc;
      let P_upperLimit = 0;
      if ((p_conc == 0 && orgp_conc == 0) || ca_conc == 0) {
        return false;
      }

      if (p_conc > 0 && orgp_conc > 0) {
        return false;
      }
      if (p_conc > 0) {
        if (aa_conc < 1) {
          return "AA需大於1%才可同時開立Ca/P";
        } else if (aa_conc >= 1 && aa_conc < 2.1) {
          P_upperLimit =
            ca_conc >= 15
              ? (12 * 3) / ca_conc
              : ca_conc >= 12
              ? (12 * 3) / ca_conc
              : ca_conc >= 10
              ? (10 * 5) / ca_conc
              : ca_conc >= 8
              ? (8 * 7) / ca_conc
              : ca_conc >= 5
              ? (5 * 12) / ca_conc
              : ca_conc >= 3
              ? (3 * 20) / ca_conc
              : (2 * 30) / ca_conc;
        } else if (aa_conc >= 2.1 && aa_conc < 3.1) {
          P_upperLimit =
            ca_conc >= 18
              ? (18 * 5) / ca_conc
              : ca_conc >= 15
              ? (15 * 6) / ca_conc
              : ca_conc >= 12
              ? (12 * 8) / ca_conc
              : ca_conc >= 10
              ? (10 * 10) / ca_conc
              : ca_conc >= 8
              ? (8 * 15) / ca_conc
              : ca_conc >= 5
              ? (5 * 40) / ca_conc
              : -1;
        } else if (aa_conc >= 3.1 && aa_conc <= 4) {
          P_upperLimit =
            ca_conc >= 20
              ? (20 * 5) / ca_conc
              : ca_conc >= 15
              ? (15 * 8) / ca_conc
              : ca_conc >= 12
              ? (12 * 10) / ca_conc
              : ca_conc >= 10
              ? (10 * 15) / ca_conc
              : ca_conc >= 8
              ? (8 * 20) / ca_conc
              : ca_conc >= 6
              ? (6 * 30) / ca_conc
              : ca_conc >= 5
              ? (5 * 40) / ca_conc
              : -1;
        } else if (aa_conc > 4) {
          P_upperLimit =
            ca_conc >= 25
              ? (25 * 5) / ca_conc
              : ca_conc >= 20
              ? (15 * 9) / ca_conc
              : ca_conc >= 15
              ? (15 * 9) / ca_conc
              : ca_conc >= 12
              ? (12 * 15) / ca_conc
              : ca_conc >= 10
              ? (10 * 20) / ca_conc
              : ca_conc >= 5
              ? (5 * 40) / ca_conc
              : -1;
        }
        P_upperLimit = Math.floor(P_upperLimit * 10) / 10;
        return P_upperLimit != -1 && p_conc > P_upperLimit
          ? "鈣磷沉積，無機磷濃度上限:" + P_upperLimit + "mmol/L"
          : false;
      } else if (orgp_conc > 0) {
        if (aa_conc < 1) {
          return "AA需大於1%才可同時開立Ca/P";
        }
        if (orgp_conc >= 25) {
          return "鈣磷沉積，有機磷濃度上限:25mmol/L";
        }
        if (ca_conc >= 50) {
          return "鈣磷沉積，鈣濃度上限:50mEq/L";
        }
      }
    },
  },
};
</script>

<style scoped>
.root {
  position: relative;
}
.btn-toggle {
  text-align: center;
}
.scrollable {
  overflow-y: scroll;
  overflow-x: hidden;
}
.flex {
  display: flex;
  flex-direction: column;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.flex-non-grow {
  flex: 0 0;
}
.bg-input-tag {
  background-color: rgb(245, 245, 245);
}
.flex-grow {
  flex: 1 0;
}

.float-left {
  float: right;
  position: absolute;
}
.pointer {
  cursor: pointer;
}
.pointer:hover {
  cursor: pointer;
  color: #66a;
}
.add-btn {
  cursor: pointer;
  background-color: rgb(18, 109, 122);
}
.add-btn:hover {
  background-color: rgb(24, 81, 90);
}
.add-btn-transfusion {
  cursor: pointer;
  background-color: rgb(27, 130, 189);
}
.add-btn-transfusion:hover {
  background-color: rgb(40, 105, 143);
}
.value {
  width: 60px;
}
.micro-row-name {
  width: 180px;
}

thead {
  text-align: center;
  font-size: 0.8em;
}
tbody {
  text-align: center;
}
td {
  vertical-align: middle;
}
.summary {
  text-align: center;
}

.text-sm {
  font-size: 0.9em !important;
}
.text-xs {
  font-size: 0.8em !important;
}
.text-xl {
  font-size: 1.3em !important;
  font-weight: 600;
}
.text-center {
  text-align: center;
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

.input-selected {
  background-color: rgb(180, 211, 240);
}
.input-selected:focus {
  border-color: rgb(180, 200, 240);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(24, 46, 90, 0.6);
  outline: 0 none;
}
.input-ok {
  background-color: rgb(220, 240, 200) !important;
}
.input-ok:focus {
  border-color: rgb(200, 240, 200) !important;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(46, 90, 24, 0.6) !important;
  outline: 0 none !important;
}

.input-warn {
  background-color: rgb(255, 255, 220) !important;
}
.input-warn:focus {
  border-color: rgb(200, 200, 160) !important;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(255, 255, 0, 0.6) !important;
  outline: 0 none !important;
}
.input-error {
  background-color: rgb(255, 230, 230) !important;
  color: rgb(200, 0, 0) !important;
}
.input-error:focus {
  border-color: pink !important;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6) !important;
  outline: 0 none !important;
}
.input-grey {
  background-color: #e9ecef !important;
  color: #495057 !important;
}

.text-warn {
  color: rgb(200, 0, 0) !important;
}
.text-central {
  color: rgb(0, 87, 130) !important;
}

.relative {
  position: relative;
}
.centraltooltip {
  background-color: rgba(20, 50, 86, 0.803);
  color: #fff;
  padding-left: 3px;
  padding-right: 3px;
  padding-top: 0px;
  padding-bottom: 0px;
  border-radius: 6px;
  font-size: 0.4em;
  white-space: nowrap;
  position: absolute;
  z-index: 1000;
  font-weight: 400;
  margin-left: 5px;
  margin-top: 5px;
}
.text-central {
  color: rgb(0, 0, 29);
}
/* Tooltip text */
.tooltip-container .tooltiptext,
.tooltip-container .tooltiptext-notshow {
  visibility: hidden;
  background-color: rgba(44, 138, 0, 0.9);
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
  background-color: rgba(187, 28, 28, 0.9) !important;
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
  border-color: rgba(44, 138, 0.9) transparent transparent transparent;
}
.tooltip-container
  :not(.snap-button):not(.no-arrow).tooltiptext.showtooltip::after,
.tooltip-container
  :not(.snap-button):not(.no-arrow).tooltiptext-notshow.showtooltip::after {
  border-color: rgba(187, 28, 28, 0.9) transparent transparent transparent !important;
}
/* Show the tooltip text when you mouse over the tooltip container */
.tooltip-container:hover .tooltiptext,
input:focus ~ .tooltiptext,
.showtooltip.tooltiptext,
.showtooltip.tooltiptext-notshow {
  visibility: visible;
  opacity: 1;
}
.w100 {
  width: 100%;
}
.w100p {
  width: 100px;
}
.w160p {
  width: 160px;
}
.fixed {
  position: fixed;
}
.offset-0 {
  margin-left: 0px !important;
}
.offset-30 {
  margin-left: -30px !important;
}
.offset-40 {
  margin-left: -40px !important;
}
.offset-20 {
  margin-left: -20px !important;
}
.offset-80 {
  margin-left: -80px !important;
}
.add-hover:hover {
  color: #ccc;
}
.width-80px {
  width: 80px;
}
.express-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 9999999;
}
.express {
  position: relative;
  margin: auto;
  top: 20%;
  width: 80%;
  max-width: 720px;
  padding: 24px;
  background-color: rgb(255, 221, 228);
  color: rgb(84, 110, 32);
  text-align: left;
  font-size: 0.9em;
  border-radius: 8px;
}
.express .flex {
  display: flex;
  flex-direction: row;
}
.express .fake-input {
  background-color: white;
  border-radius: 3px;
  border: grey solid 1px;
  text-align: left;
  padding-left: 5px;
  height: 24px;
}
.express .unit {
  min-width: 40px;
}
.express .cell-size {
  height: 32px;
  padding-top: 6px;
  padding-bottom: 6px;
}
::-webkit-scrollbar {
  width: 0.5em;
  height: 0.5em;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgba(225, 225, 225, 1);
}

::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.5);
}
input::-webkit-calendar-picker-indicator {
  display: none;
}
</style>

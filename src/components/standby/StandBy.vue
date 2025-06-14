<template>
    <div class="outer">
        <div class="fake" style="visibility: hidden; position: fixed"> {{chartPara}}</div>
        <div id="parameter">
            <div class="title">
                <h4>保溫箱進產房 Checklist</h4>
            </div>
            <div class="input ga">
                <div>週數(wk)</div>
                <input type="number" step="1" min="22" max="43" id="gawk" v-model="gawk"> +
                <input type="number" step="1" min="0" max="6" id="gaday" v-model="gaday">
            </div>
            <div class="input bw">
                <div>體重(g)</div>
                <input type="number" step="10" min="300" id="bw" v-model="bw">
            </div>
        </div>
        <div class="container">
            <div class="col-container">
                <div class="block-container">
                    <div class="block">
                        <div class="item" :class="{disable:item.cpap}">
                            <input id="cpap" type="checkbox" class="checkbox" v-model="item.cpap">
                            <label for="cpap">Bubble CPAP + Prong管路</label>
                        </div>
                        <div class="item" :class="{disable:item.neopuff}">
                            <input id="neopuff" type="checkbox" class="checkbox" v-model="item.neopuff">
                            <label for="neopuff">Neopuff+管路(置於溫箱內)</label>
                        </div>
                        <div class="item" :class="{disable:item.ambu}">
                            <input id="ambu" type="checkbox" class="checkbox" v-model="item.ambu">
                            <label for="ambu">Ambu-Bag</label>
                        </div>
                        <div class="item" :class="{disable:item.suction}">
                            <input id="suction" type="checkbox" class="checkbox" v-model="item.suction">
                            <label for="suction">Sunction Tube 5號 + 8號(藍頭)</label>
                        </div>
                        <div class="item" :class="{disable:item.endo}">
                            <input id="endo" type="checkbox" class="checkbox" v-model="item.endo">
                            <label for="endo">Endotube 2.5號 + 3.0號</label>
                        </div>
                        <div class="item" :class="{disable:item.stylet}">
                            <input id="stylet" type="checkbox" class="checkbox" v-model="item.stylet">
                            <label for="stylet">灰色細Stylet</label>
                        </div>
                        <div class="item" :class="{disable:item.skin}">
                            <input id="skin" type="checkbox" class="checkbox" v-model="item.skin">
                            <label for="skin">Endo貼紙+人工皮</label>
                        </div>
                        <div class="item" :class="{disable:item.bottle}">
                            <input id="bottle" type="checkbox" class="checkbox" v-model="item.bottle">
                            <label for="bottle">O2鋼瓶(測試完記得關緊)</label>
                        </div>
                           <div class="item" :class="{disable:item.hat}">
                            <input id="hat" type="checkbox" class="checkbox" v-model="item.hat">
                            <label for="hat">保溫毛帽</label>
                        </div>
                        <div class="item" :class="{disable:item.thermometer}">
                            <input id="thermometer" type="checkbox" class="checkbox" v-model="item.thermometer">
                            <label for="thermometer">肛溫計</label>
                        </div>
                    </div>
                    <div class="block">
                        <div class="item" :class="{disable:item.uc}">
                            <input id="uc" type="checkbox" class="checkbox" v-model="item.uc">
                            <label for="uc">Umbilical Catheter一條</label>
                        </div>
                        <div class="item" :class="{disable:item.needle}">
                            <input id="needle" type="checkbox" class="checkbox" v-model="item.needle">
                            <label for="needle">頭皮針 (for tapping)</label>
                        </div>
                        <div class="item" :class="{disable:item.iv}">
                            <input id="iv" type="checkbox" class="checkbox" v-model="item.iv">
                            <label for="iv">IV用物</label>
                        </div>
                        <div class="item" :class="{disable:item.uvsampling}">
                            <input id="uvsampling" type="checkbox" class="checkbox" v-model="item.uvsampling">
                            <label for="uvsampling">抽臍帶血用品：針筒/綠+紫頭管/Culture瓶/GAS空針</label>
                        </div>
                    </div>

                    <div class="block">
                        <div class="item" :class="{disable:item.bag}">
                            <input id="bag" type="checkbox" class="checkbox" v-model="item.bag">
                            <label for="bag">塑膠袋(剪開，留一邊相連，不用魔鬼氈)</label>
                        </div>
                        <div class="item" :class="{disable:item.incubator}">
                            <input id="incubator" type="checkbox" class="checkbox" v-model="item.incubator">
                            <label for="incubator">長頸鹿保溫箱
                                <ul>
                                    <li>先在NICU加濕加熱，不用備巢</li>
                                    <li>第一次通知推進空手術室插電預熱</li>
                                    <li>第二次通知時推進產房</li>
                                </ul>
                            </label>
                        </div>
                        <div class="item" :class="{disable:item.monitor}">
                            <input id="monitor" type="checkbox" class="checkbox" v-model="item.monitor">
                            <label for="monitor">Portable Oximeter & EKG(置溫箱內)</label>
                        </div>
                        <div class="item" :class="{disable:item.stetho}">
                            <input id="stetho" type="checkbox" class="checkbox" v-model="item.stetho">
                            <label for="stetho">聽診器</label>
                        </div>
                        <div class="item" :class="{disable:item.thermometer}">
                            <input id="thermometer" type="checkbox" class="checkbox" v-model="item.thermometer">
                            <label for="thermometer">電子體溫計+凡士林</label>
                        </div>
                    </div>

                </div>
                <div class="block-container">
                    <div class="block chart">
                        <div class="chart-outer">
                            <canvas id="bwchart" width="300" height="200"></canvas>
                        </div>
                        <div class="percentile">
                            <div class="font-small">BW percentile</div>
                            <div class="font-large">{{percentile}}%</div>
                        </div>
                    </div>
                    <div class="block endo">
                        <div>
                            <div class="font-normal">Endo深度</div>
                            <div class="font-large depth">{{endoDepth}}cm</div>
                            <div class="font-small">記得找landmark</div>
                        </div>
                        <div>
                            <table>
                                <tr>
                                    <th>GA</th>
                                    <th>Length at lips</th>
                                    <th>BW</th>
                                </tr>
                                <tr v-for="(e,i) in endo" :key="i">
                                    <td :class="{selected:e.selected[0]}">{{e.ga_lower}}-{{e.ga_upper}}</td>
                                    <td :class="{selected:e.selected[1]}">{{e.depth.toFixed(1)}}</td>
                                    <td :class="{selected:e.selected[2]}">{{e.bw_lower.toFixed(1)}}-{{e.bw_upper.toFixed(1)}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="block uc">
                        <div>
                            <div>UA深度</div>
                            <div class="font-large">{{UA}}cm
                                <span class="font-normal">+stump</span>
                            </div>
                            <div class="font-small">bw * 3 + 9</div>
                        </div>
                        <div>
                            <div>UV深度</div>
                            <div class="font-large">{{UV}}cm
                                <span class="font-normal">+stump</span>
                            </div>
                            <div class="font-small">UA / 2 + 1</div>
                        </div>
                    </div>
                    <div class="block medication">
                        <input id="epi" type="checkbox" class="checkbox" v-model="item.epi">
                        <label for="epi">
                            <div class="title" :class="{disable:item.epi}">Epinephrine(1:10000)</div>
                            <div class="epinephrine">
                                <div>
                                    <div class="dose">IV {{epi_iv}}ml</div>
                                    <div class="font-small">0.1-0.3ml/kg</div>
                                </div>
                                <div>
                                    <div class="dose">ET {{epi_et}}ml</div>
                                    <div class="font-small">0.5-1ml/kg</div>
                                </div>
                            </div>
                        </label>
                        <input id="bica" type="checkbox" class="checkbox" v-model="item.bica">
                        <label for="bica">
                            <div class="title" :class="{disable:item.bica}">Sod Bicarb(+dis/w)</div>
                            <div class="dose">{{bica}}ml+{{bica}}ml</div>
                            <div class="font-small">1ml/kg</div>
                        </label>

                    </div>
                    <div class="block medication">
                        <input id="ns" type="checkbox" class="checkbox" v-model="item.ns">
                        <label for="ns">
                            <div class="title" :class="{disable:item.ns}">NS(vol. exp)</div>
                            <div class="dose">{{ns}}ml</div>
                            <div class="font-small">10ml/kg</div>
                        </label>
                        <input id="survanta" type="checkbox" class="checkbox" v-model="item.survanta">
                        <label for="survanta">
                            <div class="title" :class="{disable:item.survanta}">Survanta</div>
                            <div class="dose">每側{{survanta}}ml</div>
                            <div class="font-small">2ml/kg/每側</div>
                        </label>
                    </div>

                    <div class="block medication">
                        <div>
                            <div class="title">Ampicillin</div>
                            <div class="dose">{{ampicillin}}mg
                                <span class="font-small"> q12h</span>
                            </div>
                            <div class="font-small">200mg/kg/day</div>
                        </div>
                        <div>
                            <div class="title">Claforan</div>
                            <div class="dose">{{claforan}}mg
                                <span class="font-small"> q12h</span>
                            </div>
                            <div class="font-small">50mg/kg/dose</div>
                        </div>
                        <!-- <div>
                            <div class="title">Vanco</div>
                            <div class="dose">50mg
                                <span class="font-small"> q12h</span>
                            </div>
                            <div class="font-small">200mg/kg/day</div>
                        </div>
                        <div>
                            <div class="title">Mepem</div>
                            <div class="dose">50mg
                                <span class="font-small"> q12h</span>
                            </div>
                            <div class="font-small">200mg/kg/day</div>
                        </div> -->
                    </div>
                    <div class="block medication">
                        <div>
                            <div class="title">Fentanyl</div>
                            <div class="dilute">50mcg泡成25ml</div>
                            <div class="font-small">濃度2mcg/ml</div>
                            <div class="dose">{{fentanyl_lower}}
                                <span class="font-small">ml/hr起</span>
                            </div>
                            <div class="font-small">0.25mcg/kg/hr起</div>
                        </div>
                        <div>
                            <div class="title">Dormicum</div>
                            <div class="dilute">5mg泡成10ml</div>
                            <div class="font-small">濃度0.5mg/ml</div>
                            <div class="dose">
                                <div class="dose">{{dormicum_lower}}
                                    <span class="font-small">ml/hr起</span>
                                </div>
                            </div>
                            <div class="font-small">0.06mg/kg/hr起</div>
                        </div>
                        <div>
                            <div class="title">Dopamine</div>
                            <div class="dilute">{{dopamine_dilute}}mg泡成10ml</div>
                            <div class="font-small">0.1ml/hr=2mcg/kg/min</div>
                            <div class="dose">0.3
                                <span class="font-small">ml/hr起</span>
                            </div>
                            <div class="font-small">6mcg/kg/min起</div>
                        </div>
                        <!-- <div>PGE1</div> -->
                    </div>
                </div>
            </div>
            <div class="bottom-block">
                <h4>產房內注意事項</h4>
                <ol>
                    <li>將無菌鋪單放置於長頸鹿上(含擦拭毛巾、臍夾、剪刀)</li>
                    <li>neopuff接產房的O2, FiO2預設30%, 拿產房的mask</li>
                    <li>拿產房的8號(藍頭)suction tube接suction拉至保溫箱內</li>
                    <li>準備的Blade + Endo放到產房處理台上</li>
                    <li>將生理監視器開機並將EKG lead、Oximeter放置於保溫箱內standby</li>
                    <li>準備按APGAR Timer</li>
                    <li>出生後照NRP流程, 穩定病人後撤單, 用塑膠袋包裹baby身體</li>
                    <li>出產房前量肛溫</li>
                </ol>

            </div>
        </div>
    </div>
</template>

<script src="./static/standby.js">
</script>
<style scoped lang="scss" src="./static/standby.scss">
</style>
import $ from "jquery";
import $$ from "jquery-mousewheel";
import Chart from 'chart.js';

export default {
  name: "StandBy",
  data() {
    return {
      item: {
        cpap: false,
        neopuff: false,
        ambu: false,
        suction: false,
        endo: false,
        stylet: false,
        skin: false,
        bottle: false,
        thermometer: false,
        hat: false,
        uc: false,
        needle: false,
        iv: false,
        uvsampling: false,
        bag: false,
        incubator: false,
        monitor: false,
        stetho: false,
        thermometer: false,
        epi: false,
        bica: false,
        ns: false,
        survanta: false,
      },
      endo: endo,
      gawk: 28,
      gaday: 0,
      bw: 1000,
    };
  },
  computed: {
    chartPara: function () {
      let bw = this.bw;
      let gawk = this.gawk;
      let gaday = this.gaday;
      let ga = Number(gawk) + Number(gaday) / 7;
      updateChart(bw, ga);
      return bw;
    },
    percentile: function () {
      let bw = this.bw;
      let gawk = this.gawk;
      let gaday = this.gaday;
      let ga = Number(gawk) + Number(gaday) / 7;

      let reversePercentile10 = JSON.parse(JSON.stringify(percentile10));
      reversePercentile10.reverse();
      let percentile10lower = reversePercentile10.find(d => d.x <= ga)
      if (!percentile10lower) { percentile10lower = percentile10[0] }
      let percentile10upper = percentile10.find(d => d.x > ga)
      if (!percentile10upper) { percentile10upper = reversePercentile10[0] }

      let percentile10_interpolation = percentile10upper.x - percentile10lower.x == 0 ?
        percentile10lower.y :
        (percentile10upper.y - percentile10lower.y)
        * (ga - percentile10lower.x)
        / (percentile10upper.x - percentile10lower.x) + percentile10lower.y

      let reversePercentile90 = JSON.parse(JSON.stringify(percentile90));
      reversePercentile90.reverse();
      let percentile90lower = reversePercentile90.find(d => d.x <= ga)
      if (!percentile90lower) { percentile90lower = percentile90[0] }
      let percentile90upper = percentile90.find(d => d.x > ga)
      if (!percentile90upper) { percentile90upper = reversePercentile90[0] }
      let percentile90_interpolation = percentile90upper.x - percentile90lower.x == 0 ?
        percentile90lower.y :
        (percentile90upper.y - percentile90lower.y)
        * (ga - percentile90lower.x)
        / (percentile90upper.x - percentile90lower.x) + percentile90lower.y

      let percentile = (bw - percentile10_interpolation)
        / (percentile90_interpolation - percentile10_interpolation) * 0.8 + 0.1
      if (percentile < 0.1) {
        return "<10"
      } else if (percentile > 0.9) {
        return ">90"
      }
      return Math.round(percentile * 100, 1);
    },
    endoDepth: function () {
      let bw = this.bw / 1000;
      let gawk = this.gawk;
      endo = this.endo;
      endo.forEach(e => e.selected = [false, false, false]);
      let ga_index = _.findLastIndex(endo, x => x.ga_lower <= gawk)
      let bw_index = _.findLastIndex(endo, x => x.bw_lower <= bw)
      if (ga_index < 0) { ga_index = 0 }
      if (bw_index < 0) { bw_index = 0 }
      let start = ga_index < bw_index ? ga_index : bw_index;
      let end = ga_index > bw_index ? ga_index : bw_index;
      for (var i = start; i <= end; i++) {
        endo[i].selected[1] = true;
      }
      endo[ga_index].selected[0] = true;
      endo[bw_index].selected[2] = true;
      return start == end ? endo[start].depth : endo[start].depth + "-" + endo[end].depth
    }
    , UA: function () {
      let bw = this.bw;
      return (bw * 3 / 1000 + 9).toFixed(1)
    },
    UV: function () {
      let bw = this.bw;
      return ((bw * 3 / 1000 + 9) / 2 + 1).toFixed(1)
    },
    epi_iv: function () {
      let bw = this.bw;
      return _.floor(bw * 0.3 / 1000, 1)
    },
    epi_et: function () {
      let bw = this.bw;
      return _.floor(bw / 1000, 1)
    },
    bica: function () {
      let bw = this.bw;
      return _.floor(bw / 1000, 1)
    },
    ns: function () {
      let bw = this.bw;
      return _.floor(bw / 1000 * 10, 1)
    },
    survanta: function () {
      let bw = this.bw;
      return _.floor(bw / 1000 * 2, 1)
    },
    ampicillin: function () {
      let bw = this.bw / 1000;
      return _.floor(_.round(bw / 5 * 100) * 5, 1)
    },
    claforan: function () {
      let bw = this.bw / 1000;
      return _.floor(_.round(bw / 5 * 50) * 5, 1)
    },
    fentanyl_lower: function () {
      let bw = this.bw / 1000;
      return Math.max(_.floor(bw / 8, 1), 0.1)
    },
    dormicum_lower: function () {
      let bw = this.bw / 1000;
      return Math.max(_.floor(bw / 8.33, 1), 0.1)
    },
    dopamine_dilute: function () {
      let bw = this.bw / 1000;
      return _.floor(bw * 20 * 60 * 10 / 1000, 1)
    }

  },
  watch: {

  },
  mounted() {
    $('input[type="number"]').on('mousewheel', function (e) { })
    let bw = this.bw;
    let ga = Number(this.gawk) + Number(this.gaday) / 7;
    renderChart(bw, ga);
  }
};
let chart = {};
let updateChart = function (bw, ga) {
  if (!chart.data) { return; }
  chart.data.datasets.find(x => x.label == "patient").data = [{ x: ga, y: bw }]
  chart.update();
}

let percentile10 = [{ x: 24, y: 520 }, { x: 25, y: 600 }, { x: 27.5, y: 800 }, { x: 30, y: 1000 }
  , { x: 31, y: 1100 }, { x: 32, y: 1200 }, { x: 33, y: 1350 }, { x: 35, y: 1800 }
  , { x: 36, y: 1950 }, { x: 38, y: 2300 }, { x: 39, y: 2450 }, { x: 40, y: 2600 }
  , { x: 42, y: 2750 }
]
let percentile90 = [{ x: 24, y: 1280 }, { x: 25, y: 1300 }, { x: 27, y: 1400 }, { x: 28, y: 1520 },
{ x: 29, y: 1610 }, { x: 30, y: 1780 }, { x: 31, y: 1950 }, { x: 32, y: 2150 }, { x: 33, y: 2500 },
{ x: 34, y: 2800 }, { x: 35, y: 3100 }, { x: 36, y: 3300 }, { x: 37, y: 3420 }, { x: 38, y: 3580 },
{ x: 39, y: 3680 }, { x: 40, y: 3750 }, { x: 42, y: 3900 }
]
let renderChart = function (bw, ga) {
  var ctx = document.getElementById("bwchart");
  chart = new Chart(ctx, {
    type: 'scatter',
    data: {
      labels: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
      datasets: [{
        label: '10%',
        data: percentile10,
        borderWidth: 1,
        borderColor: "#99BB99",
        fill: false,
        showLine: true,
        pointRadius: 0
      }, {
        label: '90%',
        data: percentile90,
        borderWidth: 1,
        borderColor: "#99BB99",
        fill: false,
        showLine: true,
        pointRadius: 0
      }, {
        label: 'patient',
        data: [{ x: ga, y: bw }],
        borderWidth: 1,
        borderColor: "#000000",
        fill: false
      },],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false,
            min: 0,
            max: 4000,
            stepSize: 500
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: false,
            stepSize: 2,
            min: 22,
            max: 44
          }
        }]
      },
      elements: {
        line: {
          tension: 0.5
        }
      },
      tooltips: {
        enabled: false
      },
      legend: {
        onClick: (e) => e.stopPropagation(),
        position: "right",
        labels: {
          filter: function (item, chart) {
            // Logic to remove a particular legend item goes here
            // return !item.text.includes('patient');
            return false;
          }
        }
      },
      spanGaps: true,
      hover: { mode: null },
    }
  });
}

let endo = [
  { ga_lower: 23, ga_upper: 24, depth: 5.5, bw_lower: 0.5, bw_upper: 0.6, selected: [false, false, false] },
  { ga_lower: 25, ga_upper: 26, depth: 6, bw_lower: 0.7, bw_upper: 0.8, selected: [false, false, false] },
  { ga_lower: 27, ga_upper: 29, depth: 6.5, bw_lower: 0.9, bw_upper: 1.0, selected: [false, false, false] },
  { ga_lower: 30, ga_upper: 32, depth: 7, bw_lower: 1.1, bw_upper: 1.4, selected: [false, false, false] },
  { ga_lower: 33, ga_upper: 34, depth: 7.5, bw_lower: 1.5, bw_upper: 1.8, selected: [false, false, false] },
  { ga_lower: 35, ga_upper: 37, depth: 8, bw_lower: 1.9, bw_upper: 2.4, selected: [false, false, false] },
  { ga_lower: 38, ga_upper: 40, depth: 8.5, bw_lower: 2.5, bw_upper: 3.1, selected: [false, false, false] },
  { ga_lower: 41, ga_upper: 43, depth: 9, bw_lower: 3.2, bw_upper: 4.2, selected: [false, false, false] },
]
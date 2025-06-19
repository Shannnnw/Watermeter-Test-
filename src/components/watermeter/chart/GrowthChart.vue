<template>
  <div id="growth-chart">
    <div class="title">
      生長曲線表
    </div>
    <div id="chart-outer">
      <canvas id="growthcanvas"></canvas>
    </div>
    <div id="info">
      需在水表內輸入每日之「實際體重」才能繪製資料點。
      <!-- Ref: Fenton Preterm Growth Chart -->
    </div>
  </div>
</template>
<script>
import Chart from "chart.js/auto";
export default {
  methods: {
    render(patientData, watermeterData) {
      renderChart();
      updateChart(patientData, watermeterData);
    }
  }
};

let chart = {};
let renderChart = function() {
  chart.destroy && chart.destroy();
  var ctx = document.getElementById("growthcanvas");
  chart = new Chart(ctx, {
    type: "scatter",
    data: {
      labels: [
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43
      ],
      datasets: [
        {
          label: "10%",
          data: percentile10,
          borderWidth: 1.5,
          borderColor: "#6699BB",
          fill: false,
          showLine: true,
          pointRadius: 0
        },
        {
          label: "90%",
          data: percentile90,
          borderWidth: 1.5,
          borderColor: "#6699BB",
          fill: false,
          showLine: true,
          pointRadius: 0
        },
        {
          label: "patient",
          data: [],
          borderWidth: 0,
          radius: 1.5,
          borderColor: "rgb(200, 110, 110)",
          pointBackgroundColor: "rgb(200, 110, 110)",
          fill: false
        }
      ]
    },
    options: {
      maintainAspectRatio: true,
      animation: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
              min: 0,
              max: 4000,
              stepSize: 500
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              beginAtZero: false,
              stepSize: 2,
              min: 22,
              max: 44
            }
          }
        ]
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
        display: false
      },
      spanGaps: true,
      hover: { mode: null }
    }
  });
};
let updateChart = function(patientData, watermeterData) {
  if (!chart.data) {
    return;
  }
  let birthdate = patientData.birthdate;
  let gaWeek = patientData.ga_week;
  let gaDay = patientData.ga_day;
  let data = [];
  watermeterData.forEach(e => {
    if (e.bw_measure) {
      let daysDiff = Math.abs(new Date(e.date) - new Date(birthdate));
      daysDiff = Math.ceil(daysDiff / (1000 * 3600 * 24));
      let ageInDay = Number(gaWeek) * 7 + Number(gaDay) + daysDiff;
      data.push({ x: ageInDay / 7, y: e.bw_measure });
    }
  });

  chart.data.datasets.find(x => x.label == "patient").data = data;
  chart.update();
};
let percentile10 = [
  { x: 24, y: 520 },
  { x: 25, y: 600 },
  { x: 27.5, y: 800 },
  { x: 30, y: 1000 },
  { x: 31, y: 1100 },
  { x: 32, y: 1200 },
  { x: 33, y: 1350 },
  { x: 35, y: 1800 },
  { x: 36, y: 1950 },
  { x: 38, y: 2300 },
  { x: 39, y: 2450 },
  { x: 40, y: 2600 },
  { x: 42, y: 2750 }
];
let percentile90 = [
  { x: 24, y: 1280 },
  { x: 25, y: 1300 },
  { x: 27, y: 1400 },
  { x: 28, y: 1520 },
  { x: 29, y: 1610 },
  { x: 30, y: 1780 },
  { x: 31, y: 1950 },
  { x: 32, y: 2150 },
  { x: 33, y: 2500 },
  { x: 34, y: 2800 },
  { x: 35, y: 3100 },
  { x: 36, y: 3300 },
  { x: 37, y: 3420 },
  { x: 38, y: 3580 },
  { x: 39, y: 3680 },
  { x: 40, y: 3750 },
  { x: 42, y: 3900 }
];
</script>

<style lang="scss" scoped>
#growth-chart {
  text-align: center;
  .title {
    font-size: 1.2em;
    font-weight: 700;
    margin-bottom: 20px;
  }
  #chart-outer {
    width: 100%;
    height: 100%;
  }
  #info {
    padding-top: 10px;
    color: hsl(212, 27%, 50%);
    font-size: 0.8rem;
    padding-bottom: 10px;
  }
}
</style>

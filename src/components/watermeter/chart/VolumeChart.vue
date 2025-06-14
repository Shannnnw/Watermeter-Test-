<template>
  <div id="volume-chart">
    <div class="title">
      水量表(ml/kg/d)
    </div>
    <div class="chart-outer">
      <canvas id="volumecanvas"></canvas>
    </div>
  </div>
</template>
<script>
import Chart from "chart.js";
import util from "@/util";
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
  var ctx = document.getElementById("volumecanvas");
  ctx.height = 180;
  chart = new Chart(ctx, {
    type: "bar",
    data: {},
    options: {
      responsive: false,
      maintainAspectRatio: true,
      animation: {
        duration: 200
      },
      tooltips: {
        mode: "index",
        intersect: false
      },
      responsive: true,
      legend: {
        position: "right"
      },
      scales: {
        xAxes: [
          {
            stacked: true
          }
        ],
        yAxes: [
          {
            stacked: true,
            ticks: {
              max: 200,
              min: 0,
              stepsize: 25
            }
          }
        ]
      }
    }
  });
};
let updateChart = function(patientData, watermeterData) {
  if (!chart.data || watermeterData.length == 0) {
    return;
  }
  let data = {
    labels: [],
    datasets: [
      {
        label: "IV",
        data: [],
        backgroundColor: "#6898d6"
      },
      {
        label: "Feed",
        data: [],
        backgroundColor: "#d3cba0"
      }
    ]
  };
  let endD = util.getDayDiff(patientData.birthdate, watermeterData[0].date);
  let startD = util.getDayDiff(
    patientData.birthdate,
    watermeterData[watermeterData.length - 1].date
  );
  for (var i = startD; i <= endD; i++) {
    data.labels.push("D" + i);
    let e = watermeterData.find(
      x => util.getDayDiff(patientData.birthdate, x.date) === i
    );
    if (!e) {
      data.datasets[0].data.push(NaN);
      data.datasets[1].data.push(NaN);
    } else {
      let feed_perday = 0;
      if (e.bw && e.wm.feed_total) {
        feed_perday = Math.round(e.wm.feed_total / e.bw * 1000);
      }
      data.datasets[0].data.push(Math.round(e.wm.wm_summary_daily - feed_perday,0));
      data.datasets[1].data.push(feed_perday);
    }
  }
  chart.data = data;
  chart.update();
};
</script>

<style lang="scss" scoped>
#volume-chart {
  text-align: center;
  .title {
    font-size: 1em;
    font-weight: 700;
  }
  .chart-outer {
    width: 100%;
    height: 100%;
  }
}
test {
  color: #6898d6;
}
</style>

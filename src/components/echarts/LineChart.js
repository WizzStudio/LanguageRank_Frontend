import Taro, { Component } from "@tarojs/taro";
import * as echarts from "../ec-canvas/echarts";
// import * as echarts from "./ec-canvas/echarts.min.js";

function setChartData(chart, data) {
  console.log("data", data);
  let max = Math.max.apply(null, data.measures[0].data);
  let min = Math.min.apply(null, data.measures[0].data);
  let option = {
    color: ["#4f5fc5"],
    xAxis: [
      {
        type: "category",
        data: [],
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          interval: 0,
          rotate: 320,
          textStyle: {
            fontSize: "14",
            rich: {}
          }
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        min: min,
        max: max,
        // scale: true,
        // interval: 20,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          show: true,
          textStyle: {
            fontSize: "10",
            rich: {}
          }
        }
      }
    ],
    series: [
      {
        label: {
          normal: {
            textStyle: {
              fontSize: "12",
              color: "#000",
              rich: {}
            }
          }
        }
      }
    ]
  };
  if (data && data.dimensions && data.measures) {
    option.xAxis[0].data = data.dimensions.data;
    option.series = data.measures.map(item => {
      return {
        ...item,
        type: "line",
        smooth: true
      };
    });
  }
  chart.setOption(option);
}

export default class LineChart extends Component {
  config = {
    usingComponents: {
      "ec-canvas": "../ec-canvas/ec-canvas"
    }
  };

  constructor(props) {
    super(props);
  }

  state = {
    ec: {
      lazyLoad: true
    }
  };

  refresh(data) {
    this.Chart.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setChartData(chart, data);
      return chart;
    });
  }

  refChart = node => (this.Chart = node);

  render() {
    return (
      <ec-canvas
        ref={this.refChart}
        canvas-id="mychart-area"
        ec={this.state.ec}
      />
    );
  }
}

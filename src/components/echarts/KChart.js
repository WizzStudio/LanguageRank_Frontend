import Taro, { Component } from "@tarojs/taro";
import * as echarts from "../ec-canvas/echarts";

function setChartData(chart, data) {
  let option = {
    color: ["#4f5fc5"],
    tooltip: {
      trigger: "axis",
      formatter: function(params) {
        var res = "";
        res += "最低" + params[0].value[3] + "k" + "\n";
        res +=
          "平均" +
          params[0].value[1] +
          "k" +
          "\n" +
          "最高" +
          params[0].value[4] +
          "k";
        return res;
      }
    },
    xAxis: {
      data: [],
      axisLabel: {
        interval: 0,
        rotate: 320
      }
    },
    yAxis: {
      axisLabel: {
        formatter: "{value}k"
      }
    },
    series: [
      {
        itemStyle: {
          normal: {
            color: "#ff0000",
            borderWidth: 1,
            opacity: 1
          }
        }
      }
    ]
  };
  if (data && data.dimensions && data.measures) {
    option.xAxis.data = data.dimensions.data;
    console.log("option.xAxis.data", option.xAxis.data);
    option.series = data.measures.map(item => {
      return {
        ...item,
        type: "k"
      };
    });
  }
  chart.setOption(option);
}

export default class KChart extends Component {
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

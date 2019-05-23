import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtDivider } from "taro-ui";
import myApi from "../../service/api";
import PieChart from "../../components/echarts/PieChart";
import BarChart from "../../components/echarts/BarChart";
import KChart from "../../components/echarts/KChart";
import "./langDetail.scss";

export default class DemandHome extends Component {
  config = {
    navigationBarTitleText: "雇主需求详情"
  };
  constructor() {
    super();
    this.state = {
      posi: []
    };
  }
  componentWillMount() {}
  componentDidMount() {
    Promise.all([
      this.getInitData("posi"),
      this.getInitData("demandPosi"),
      this.getInitData("city"),
      this.getInitData("salary")
    ]).then(res => {
      if (res[0].code === 0) {
        this.setState({
          posi: res[0].data
        });
      }
      if (res[1].code === 0) {
        this.initBarChart(res[1].data);
      }
      if (res[2].code === 0) {
        this.initPieChart(res[2].data);
      }
      if (res[3].code === 0) {
        this.initKChart(res[3].data);
      }
    });
  }
  getInitData = async type => {
    let langName = this.props.demandNameProp;
    if (langName === "C#") {
      langName = "C%23";
    }
    let url = "";
    switch (type) {
      case "demandPosi":
        url = `/${langName}/companypost`;
        break;
      case "posi":
        url = `/${langName}/post`;
        break;
      case "city":
        url = `/${langName}/languagecity`;
        break;
      case "salary":
        url = `/${langName}/salary`;
      default:
        break;
    }
    const res = await myApi(url);
    return res;
  };
  initKChart = salary => {
    this.setState({
      isLoading: {
        salary: false
      }
    });
    let salaryX = [],
      salaryY = [];
    salary.map(item => {
      salaryX.push(item.companyName);
      salaryY.push([
        item.companyOrdSalary - 1,
        item.companyOrdSalary + 1,
        item.companyMinSalary,
        item.companyMaxSalary
      ]);
    });
    const kChartData = {
      dimensions: {
        data: salaryX
      },
      xAxis: {
        axisLabel: {
          interval: 0,
          rotate: 40
        }
      },

      measures: [
        {
          data: salaryY
        }
      ]
    };
    this.kChart.refresh(kChartData);
  };
  initBarChart = demandPosi => {
    this.setState({
      isLoading: {
        demandPosi: false
      }
    });
    let demandPosiX = [],
      demandPosiY = [];
    demandPosi.map(item => {
      demandPosiX.push(item.companyName);
      demandPosiY.push((item.companyPostNumber * 0.001).toFixed(3));
    });
    const barChartData = {
      dimensions: {
        data: demandPosiX
      },
      measures: [
        {
          data: demandPosiY
        }
      ]
    };
    this.barChart.refresh(barChartData);
  };
  initPieChart = city => {
    this.setState({
      isLoading: {
        city: false
      }
    });
    let cityPie = [];
    city.map(item => {
      cityPie.push({
        value: item.cityPostNumber,
        name: item.languageCity
      });
    });
    const pieChartData = cityPie;
    this.pieChart.refresh(pieChartData);
  };
  //选中dom
  refKChart = node => (this.kChart = node);
  refBarChart = node => (this.barChart = node);
  refPieChart = node => (this.pieChart = node);
  render() {
    const { posi } = this.state || [];
    return (
      <View>
        <View className="wrap-content">
          <View className="blank" />
          <View className="wrap-title">热门岗位</View>
          <View>
            {posi.map((item, index) => (
              <View key={index} className="demand-posi-wrap">
                <View className="demand-posi-name">
                  {item.companyName}|{item.languagePost}
                </View>
                <View className="demand-posi-salary">{item.postSalary}</View>
              </View>
            ))}
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">公司薪资排行</View>
          <View className="line-chart">
            <KChart ref={this.refKChart} />
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">公司需求量排行</View>
          <View className="line-chart">
            <BarChart ref={this.refBarChart} />
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">城市需求分析</View>
          <View className="line-chart">
            <PieChart ref={this.refPieChart} />
          </View>
        </View>
      </View>
    );
  }
}

import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtDivider, AtActivityIndicator } from "taro-ui";
import PieChart from "../../components/echarts/PieChart";
import BarChart from "../../components/echarts/BarChart";
import KChart from "../../components/echarts/KChart";
import { connect } from "@tarojs/redux";
import {
  ajaxGetDemandPosi,
  ajaxGetPosi,
  ajaxGetCity,
  ajaxGetSalary
} from "../../actions/rankList";
import "./langDetail.scss";

@connect(
  ({ demandHome }) => ({
    demandHome
  }),
  dispatch => ({
    getDemandHome(lang) {
      dispatch(ajaxGetDemandPosi(lang));
      dispatch(ajaxGetPosi(lang));
      dispatch(ajaxGetCity(lang));
      dispatch(ajaxGetSalary(lang));
    }
  })
)
export default class DemandHome extends Component {
  config = {
    navigationBarTitleText: "雇主需求详情"
  };
  constructor() {
    super();
    this.state = {
      langName: "",
      isLoading: {
        salary: false,
        demandPosi: false,
        city: false
      }
    };
  }
  componentWillMount() {}
  componentDidMount() {
    const { demandNameProp } = this.props;
    this.setState({
      langName: demandNameProp
    });
    console.log("langNameProp", demandNameProp);
    this.props.getDemandHome(demandNameProp);
  }
  componentWillReceiveProps(nextprops) {
    if (nextprops.demandHome.salary) {
      const { salary } = nextprops.demandHome;
      this.setState({
        isLoading: {
          salary: false
        }
      });
      //K线图
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
    }
    if (nextprops.demandHome.demandPosi) {
      const { demandPosi } = nextprops.demandHome;
      this.setState({
        isLoading: {
          demandPosi: false
        }
      });
      //柱状图
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
    }
    if (nextprops.demandHome.city) {
      const { city } = nextprops.demandHome;
      this.setState({
        isLoading: {
          city: false
        }
      });
      //饼状图
      let cityPie = [];
      city.map(item => {
        cityPie.push({
          value: item.cityPostNumber,
          name: item.languageCity
        });
      });
      const pieChartData = cityPie;
      this.pieChart.refresh(pieChartData);
    }
  }
  //选中dom
  refKChart = node => (this.kChart = node);
  refBarChart = node => (this.barChart = node);
  refPieChart = node => (this.pieChart = node);
  onShareAppMessage = res => {
    return {
      title: "进入小程序了解当下最流行、最赚钱的编程语言",
      path: "/pages/index/index"
    };
  };
  render() {
    const { langName, isLoading } = this.state;
    const { posi, logo } = this.props.demandHome ? this.props.demandHome : "";
    return (
      <View>
        <View className="wrap-content">
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
            {isLoading.salary ? (
              <View className="loading-wrap">
                <AtActivityIndicator content="加载中..." size={60} />
              </View>
            ) : (
              <KChart ref={this.refKChart} />
            )}
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">公司需求量排行</View>
          <View className="line-chart">
            {isLoading.salary ? (
              <View className="loading-wrap">
                <AtActivityIndicator content="加载中..." size={60} />
              </View>
            ) : (
              <BarChart ref={this.refBarChart} />
            )}
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">城市需求分析</View>
          <View className="line-chart">
            {isLoading.salary ? (
              <View className="loading-wrap">
                <AtActivityIndicator content="加载中..." size={60} />
              </View>
            ) : (
              <PieChart ref={this.refPieChart} />
            )}
          </View>
        </View>
      </View>
    );
  }
}

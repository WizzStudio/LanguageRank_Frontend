import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtDivider, AtActivityIndicator } from "taro-ui";
import PieChart from "../../components/echarts/PieChart";
import BarChart from "../../components/echarts/BarChart";
import KChart from "../../components/echarts/KChart";
import AddPlan from "../../components/rank/addPlan";
import { connect } from "@tarojs/redux";
import {
  ajaxGetDemandPosi,
  ajaxGetPosi,
  ajaxGetCity,
  ajaxGetSalary
} from "../../actions/rankList";
import demandHome from "../../reducers/index";
import "./langDetail.scss";
import { PropTypes } from "nervjs";

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
  // static defaultProps = {
  //   demandHome: {
  //     salary: [],
  //     demandPosi: [],
  //     city: [],
  //     posi: []
  //   }
  // };
  componentWillMount() {}
  componentDidMount() {
    const { langName } = this.$router.params;
    this.setState({
      langName
    });
    this.props.getDemandHome(langName);
  }
  componentWillReceiveProps(nextprops) {
    console.log("需求nextprops", nextprops);
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
        demandPosiY.push(item.companyPostNumber);
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

  render() {
    const { langName, isLoading } = this.state;
    const { posi, logo } = this.props.demandHome;
    return (
      <View>
        <View className="demand-title">
          <Image src={logo} className="demand-logo" />
          {langName}相关岗位
        </View>
        <View className="wrap-content">
          <View className="wrap-title">热门岗位</View>
          <View>
            {posi.map((item, index) => (
              <View key={index} className="demand-posi-wrap">
                <View className="demand-posi-name">{item.languagePost}</View>
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
        <AddPlan langName={langName} />
      </View>
    );
  }
}

import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtDivider } from "taro-ui";
import LineChart from "../../components/echarts/LineChart";
import PieChart from "../../components/echarts/PieChart";
import BarChart from "../../components/echarts/BarChart";
import { connect } from "@tarojs/redux";
import { ajaxGetDemandPosi } from "../../actions/rankList";
import demandHome from "../../reducers/index";

import "./langDetail.scss";
import javaLogo from "../../assets/img/language/java.png";
import share from "../../assets/icon/share.png";
import saveimg from "../../assets/icon/saveimg.png";
import rankList from "../../reducers/rankList";

// @connect(
//   ({ rankList }) => ({
//     rankList
//   }),
//   dispatch => ({
//     getAuth() {
//       dispatch(getAuth());
//     }
//   })
// )

@connect(
  ({ demandHome }) => ({
    demandHome
  }),
  dispatch => ({
    ajaxGetDemandPosi(lang) {
      dispatch(ajaxGetDemandPosi(lang));
    }
  })
)
export default class DemandHome extends Component {
  constructor() {
    super();
    this.state = {
      langName: ""
    };
  }
  componentWillMount() {
    const { langName } = this.$router.params;
    this.setState({
      langName
    });
  }
  componentDidMount() {
    this.props.ajaxGetDemandPosi(this.state.langName);
  }
  componentWillReceiveProps(nextprops) {
    console.log("nextprops", nextprops);
    const { demandHome } = nextprops;
    console.log("demandHome", demandHome);
    let barX = [],
      barY = [];
    demandHome.forEach(item => {
      barX.push(item.companyName);
      barY.push(item.companyPostNumber);
    });
    //折线图
    const lineChartData = {
      dimensions: {
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      },
      measures: [
        {
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    };
    this.lineChart.refresh(lineChartData);

    //柱状图
    const barChartData = {
      dimensions: {
        // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        data: barX
      },
      measures: [
        {
          // data: [10, 52, 200, 334, 390, 330, 220]
          data: barY
        }
      ]
    };
    this.barChart.refresh(barChartData);

    //饼状图
    const pieChartData = [
      { value: 335, name: "直接访问" },
      { value: 310, name: "邮件营销" },
      { value: 234, name: "联盟广告" },
      { value: 135, name: "视频广告" },
      { value: 1548, name: "搜索引擎" }
    ];
    this.pieChart.refresh(pieChartData);
  }
  //选中dom
  refLineChart = node => (this.lineChart = node);
  refBarChart = node => (this.barChart = node);
  refPieChart = node => (this.pieChart = node);

  render() {
    const { langName } = this.state;
    console.log("this.state", this.state);
    return (
      <View>
        <View className="demand-title">
          <Image src={javaLogo} className="demand-logo" />
          Java相关岗位
        </View>
        {/* <AtDivider /> */}
        <View className="wrap-content">
          <View className="wrap-title">热门岗位</View>
          <View>列表</View>
        </View>

        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">公司薪资排行</View>
          <View className="line-chart">
            <LineChart ref={this.refLineChart} />
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
        <View className="footer-wrap">
          <View className="fix-footer">
            <View className="add-plan">加入学习计划</View>
            <View className="share">
              <Image src={share} className="img" />
              <View className="share-title">分享</View>
            </View>
            <View className="ge-img">
              <Image src={saveimg} className="img" />
              <View className="save-title">生成图片</View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

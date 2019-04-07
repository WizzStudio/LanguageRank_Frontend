import Taro, { Component } from "@tarojs/taro";
import { View, Image, CoverView } from "@tarojs/components";
import { AtDivider, AtRate, AtButton, AtBadge, AtModal } from "taro-ui";
import LineChart from "../../components/echarts/LineChart";
import "./langDetail.scss";
import AddPlan from "../../components/rank/addPlan";
import { connect } from "@tarojs/redux";
import { ajaxGetLangHome } from "../../actions/rankList";
import { ajaxGetUserAllInfo } from "../../actions/useInfo";
@connect(
  ({ rankList, userInfo }) => ({
    rankList,
    userInfo
  }),
  dispatch => ({
    ajaxGetLangHome(langName) {
      dispatch(ajaxGetLangHome(langName));
    },
    ajaxGetUserAllInfo(data) {
      dispatch(ajaxGetUserAllInfo(data));
    }
  })
)
export default class LangHome extends Component {
  constructor() {
    super();
    this.state = {
      langName: "",
      isModalOpen: false
    };
  }
  componentWillMount() {}
  componentDidMount() {
    const loginInfo = Taro.getStorageSync("login");
    this.props.ajaxGetUserAllInfo(loginInfo.userid);
    const { langName } = this.$router.params;
    this.props.ajaxGetLangHome(langName);
    this.setState({
      langName
    });
  }

  navigateToDetail(name) {
    Taro.navigateTo({
      url: "/pages/detail/langDetail?langName=" + encodeURI(name)
    });
  }
  componentWillReceiveProps(nextprops) {
    console.log("nextprops", nextprops);
    if (nextprops.rankList.langHome) {
      const chartData = {
        dimensions: {
          data: ["第一天", "第二天", "Wed", "Thu", "Fri", "六", "七"]
        },
        measures: [
          {
            // data: [10, 52, 200, 334, 390]
            data: nextprops.rankList.langHome.exponentOfLastSevenDays
          }
        ]
      };
      this.lineChart.refresh(chartData);
    }
  }

  refLineChart = node => (this.lineChart = node);
  render() {
    const { langName } = this.state;
    const { langHome } = this.props.rankList;

    return (
      <View>
        <View className="wrap-content">
          <View className="lang-title">
            <View className="icon">
              <Image src={langHome.languageSymbol} className="logo" />
            </View>
            <View className="name">
              <View>
                {langName}&nbsp;&nbsp;&nbsp;
                <AtBadge value="HOT" className="badge" />
              </View>
              <View>
                <AtRate value={langHome.languageDifficultyIndex} />
              </View>
            </View>
            <View className="state">
              <View>{langHome.joinedNumber}人</View>
              <View>已加入学习计划</View>
            </View>
          </View>
        </View>
        <AtDivider />
        <View class="wrap-content">
          <View className="wrap-title">数据概况</View>
          <View className="data-info">
            <View className="tend-wrap">
              <View className="tend-num">{langHome.fixedFinalExponent}</View>
              <View className="tend-title">猿指数</View>
            </View>
            <View className="tend-wrap">
              <View className="tend-num">
                {langHome.fixedFinalExponentIncreasing}
              </View>
              <View className="tend-title">成长指数</View>
            </View>
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">指数趋势</View>
          <View className="tend-graph">
            <View className="line-chart">
              <LineChart ref={this.refLineChart} />
            </View>
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">热门公司</View>
          {langHome.company.map((item, index) => (
            <View className="heat-company" key={index}>
              <View className="icon">
                <Image src={item.companySymbol} className="logo" />
              </View>
              <View className="name">{item.companyName}</View>
              <View className="detail">
                <View>{item.companyMaxSalaryPost}</View>
                <View>最高月薪：{item.companyMaxSalary}k</View>
              </View>
            </View>
          ))}
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">语言简史</View>
          <View className="history">{langHome.languageDevelopmentHistory}</View>
        </View>
        <View className="wrap-content to-detail-wrap">
          <View
            type="primary"
            className="to-detail"
            onClick={this.navigateToDetail.bind(this, langName)}>
            更多信息
          </View>
        </View>
        <AddPlan langName={langName} />
      </View>
    );
  }
}

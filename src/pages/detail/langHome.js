import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtDivider, AtRate, AtButton, AtBadge } from "taro-ui";
import LineChart from "../../components/echarts/LineChart";
import langInfo from "../../mock/langInfo.json";
import "./langDetail.scss";

import javaLogo from "../../assets/img/language/java.png";
import aliLogo from "../../assets/img/company/alibaba.png";

export default class LangHome extends Component {
  constructor() {
    super();
    this.state = {
      langInfo,
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
    const chartData = {
      dimensions: {
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      },
      measures: [
        {
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    };
    this.lineChart.refresh(chartData);
  }
  refLineChart = node => (this.lineChart = node);
  navigateToDetail(name) {
    Taro.navigateTo({
      url: "/pages/detail/langDetail?langName=" + encodeURI(name)
    });
  }
  render() {
    const { langName } = this.state;
    const detailInfo = this.state.langInfo[langName];
    console.log("detailInfo", detailInfo);
    console.log("this.state", this.state);
    return (
      <View>
        <View className="wrap-content">
          <View className="lang-title">
            <View className="icon">
              <Image src={javaLogo} className="logo" />
            </View>
            <View className="name">
              <View>
                {langName}&nbsp;&nbsp;&nbsp;
                <AtBadge value="HOT" className="badge" />
              </View>
              <View>
                <AtRate value={detailInfo.complexity} />
              </View>
            </View>
            <View className="state">
              <View>1000人</View>
              <View>已加入学习计划</View>
            </View>
          </View>
        </View>
        <AtDivider />
        <View class="wrap-content">
          <View className="wrap-title">数据概况</View>
          <View className="data-info">
            <View className="tend-wrap">
              <View className="tend-num">26</View>
              <View className="tend-title">猿指数</View>
            </View>
            <View className="tend-wrap">
              <View className="tend-num">6</View>
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
          <View className="heat-company">
            <View className="icon">
              <Image src={aliLogo} className="logo" />
            </View>
            <View className="name">阿里巴巴</View>
            <View className="detail">
              <View>热招岗位：xxx个</View>
              <View>最高月薪：xxx元</View>
            </View>
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">语言简史</View>
          <View className="history">{detailInfo.history.join("\n")}</View>
        </View>
        <View className="wrap-content">
          <AtButton
            type="primary"
            className="to-detail"
            onClick={this.navigateToDetail.bind(this, langName)}>
            更多语言信息
          </AtButton>
        </View>
      </View>
    );
  }
}

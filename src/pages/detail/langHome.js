import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtDivider } from "taro-ui";
import LineChart from "../../components/echarts/LineChart";
import "./langDetail.scss";
import myApi from "../../service/api";
class LangHome extends Component {
  config = {
    navigationBarTitleText: "语言热度详情"
  };
  constructor() {
    super();
    this.state = {
      langHome: {}
    };
  }
  componentDidMount() {
    const { langNameProp } = this.props;
    this.getLangHome(langNameProp).then(res => {
      this.initChart(res.data);
      this.setState({
        langHome: res.data
      });
    });
  }
  getLangHome = async langName => {
    if (langName === "C#") {
      langName = "C%23";
    }
    const res = await myApi(`/languagerank/${langName}`);
    return res;
  };
  navigateToDetail = () => {
    const { langNameProp } = this.props;
    Taro.navigateTo({
      url: "/pages/detail/langDetail?langName=" + encodeURI(langNameProp)
    });
  };
  initChart = langHome => {
    let dataX = [],
      dataY = [];
    langHome.exponentOfLastSevenDays.map(item => {
      dataX.push(item.updateTime);
      dataY.push(item.fixedFinalExponent);
    });
    const chartData = {
      dimensions: {
        data: dataX.reverse()
      },
      measures: [
        {
          data: dataY.reverse()
        }
      ]
    };
    this.lineChart.refresh(chartData);
  };
  refLineChart = node => (this.lineChart = node);

  render() {
    const { langHome } = this.state;
    return (
      <View className="wrap-content">
        <View className="blank" />
        <View className="wrap-title">指数趋势</View>
        <View className="tend-graph">
          <View className="line-chart">
            <LineChart ref={this.refLineChart} />
          </View>
        </View>
        <AtDivider />
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
        <AtDivider />
        <View>
          <View className="wrap-title">github热门项目</View>
          <View className="history">{langHome.languageDevelopmentHistory}</View>
        </View>
        <View className="to-detail-wrap">
          <View
            type="primary"
            className="to-detail"
            onClick={this.navigateToDetail}>
            更多信息
          </View>
        </View>
      </View>
    );
  }
}
LangHome.defaultProps = {
  langNameProp: ""
};
export default LangHome;

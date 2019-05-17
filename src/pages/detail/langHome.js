import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtDivider } from "taro-ui";
import LineChart from "../../components/echarts/LineChart";
import "./langDetail.scss";
import { connect } from "@tarojs/redux";
import { ajaxGetLangHome } from "../../actions/rankList";
@connect(
  ({ rankList }) => ({
    rankList
  }),
  dispatch => ({
    ajaxGetLangHome(langName) {
      dispatch(ajaxGetLangHome(langName));
    }
  })
)
export default class LangHome extends Component {
  config = {
    navigationBarTitleText: "语言热度详情"
  };
  constructor() {
    super();
    this.state = {
      langName: "",
      isModalOpen: false
    };
  }
  componentWillMount() {}
  componentDidMount() {
    const { langNameProp } = this.props;
    console.log("home里面的this.props", this.props);
    this.props.ajaxGetLangHome(langNameProp);
    this.setState({
      langName: langNameProp
    });
  }

  navigateToDetail(name) {
    console.log("name", name);
    Taro.navigateTo({
      url: "/pages/detail/langDetail?langName=" + encodeURI(name)
    });
  }
  componentWillReceiveProps(nextprops) {
    if (nextprops.rankList.langHome) {
      const { langHome } = nextprops.rankList;
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
    }
  }
  refLineChart = node => (this.lineChart = node);
  onShareAppMessage = res => {
    return {
      title: "进入小程序了解当下最流行、最赚钱的编程语言",
      path: "/pages/index/index"
    };
  };
  render() {
    const { langName } = this.state;
    const { langHome } = this.props.rankList || {};
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
            onClick={this.navigateToDetail.bind(this, this.state.langName)}>
            更多信息
          </View>
        </View>
      </View>
    );
  }
}

import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtFloatLayout } from "taro-ui";
import AuthItem from "../../components/rank/authItem";
import "./authRankList.scss";
import { connect } from "@tarojs/redux";

//本地静态数据
import { getDemand } from "../../actions/rankList";

@connect(
  ({ rankList }) => ({ rankList }),
  dispatch => ({
    getDemand() {
      dispatch(getDemand());
    }
  })
)
export default class DemandRankList extends Component {
  constructor() {
    super();
    this.state = {
      isOpened: false
    };
  }
  componentDidMount() {
    this.props.getDemand();
    console.log("this.props", this.props);
  }
  handleNavigate(name) {
    Taro.navigateTo({
      url: "/pages/detail/demandHome?langName=" + encodeURI(name)
    });
  }
  openIntro = () => {
    this.setState({
      isOpened: true
    });
  };
  closeIntro = () => {
    this.setState({
      isOpened: false
    });
  };
  render() {
    const { rankList } = this.props;

    return (
      <View>
        {rankList.map((rank, index) => {
          return (
            <View
              key={index}
              onClick={this.handleNavigate.bind(this, rank.languageName)}>
              <AuthItem
                langImg="logo"
                langName={rank.languageName}
                heatNum={rank.languageNumber}
                tend={rank.languageTend}
                index={index}
              />
            </View>
          );
        })}
        <View className="rank-intro" onClick={this.openIntro.bind(this)}>
          榜单介绍
        </View>
        <AtFloatLayout
          isOpened={this.state.isOpened}
          onClose={this.closeIntro.bind(this)}>
          <View>
            <View className="intro-title">榜单介绍</View>
            <View className="intro-content">哈哈哈</View>
            <View className="intro-close">
              <AtButton type="primary" onClick={this.closeIntro.bind(this)}>
                确定
              </AtButton>
            </View>
          </View>
        </AtFloatLayout>
      </View>
    );
  }
}

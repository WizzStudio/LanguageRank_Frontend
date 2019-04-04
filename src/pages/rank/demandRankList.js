import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtFloatLayout } from "taro-ui";
import AuthItem from "../../components/rank/authItem";
import "./authRankList.scss";
import { connect } from "@tarojs/redux";
import ShareCanvas from "../../components/rank/shareCanvas";

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
      isOpened: false,
      isShared: false
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
  openCanvas = () => {
    this.setState({
      isShared: true
    });
  };
  closeCanvas = () => {
    this.setState({
      isShared: false
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
        <View className="share" onClick={this.openCanvas}>
          分享
        </View>
        {isShared ? (
          <View className="share-bg">
            <View className="share-wrap">
              <ShareCanvas langImg="test" />
              <AtButton onClick={this.closeCanvas}>关闭</AtButton>
            </View>
          </View>
        ) : (
          ""
        )}
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

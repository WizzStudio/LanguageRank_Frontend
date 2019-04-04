import Taro, { Component } from "@tarojs/taro";
import { View, Canvas } from "@tarojs/components";
import { AtFloatLayout, AtButton } from "taro-ui";
import "./authRankList.scss";
import AuthItem from "../../components/rank/authItem";
import ShareCanvas from "../../components/rank/shareCanvas";

import { connect } from "@tarojs/redux";
import { ajaxGetAuth } from "../../actions/rankList";
@connect(
  ({ rankList }) => ({
    rankList
  }),
  dispatch => ({
    ajaxGetAuth() {
      dispatch(ajaxGetAuth());
    }
  })
)
export default class AuthRankList extends Component {
  constructor() {
    super();
    this.state = {
      isOpened: false,
      isShared: false
    };
  }
  componentWillMount() {
    this.props.ajaxGetAuth();
    // this.props.asyncGetUser();
  }
  handleNavigate(name) {
    Taro.navigateTo({
      url: "/pages/detail/langHome?langName=" + encodeURI(name)
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
    const rankList = this.props.rankList.authRank;
    const { isShared } = this.state;
    return (
      <View>
        {rankList.map((rank, index) => {
          return (
            <View
              key={index}
              onClick={this.handleNavigate.bind(this, rank.languageName)}>
              <AuthItem
                langImg={rank.languageSymbol}
                langName={rank.languageName}
                heatNum={rank.fixedFinalExponent}
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
              <ShareCanvas rankContent="213" />
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
            <View className="intro-title" ref={this.refTest}>
              榜单介绍
            </View>
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

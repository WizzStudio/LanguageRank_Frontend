import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtFloatLayout, AtButton } from "taro-ui";
import "./authRankList.scss";

import AuthItem from "../../components/rank/authItem";

import { connect } from "@tarojs/redux";
import { getAuth } from "../../actions/rankList";
import { asyncGetUser } from "../../actions/userlist";
@connect(
  ({ rankList, userlist }) => ({
    rankList,
    userlist
  }),
  dispatch => ({
    getAuth() {
      dispatch(getAuth());
    },
    asyncGetUser() {
      dispatch(asyncGetUser());
    }
  })
)
export default class AuthRankList extends Component {
  constructor() {
    super();
    this.state = {
      isOpened: false
    };
  }
  componentWillMount() {
    this.props.getAuth();
    this.props.asyncGetUser();
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
  render() {
    const rankList = this.props.rankList;

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

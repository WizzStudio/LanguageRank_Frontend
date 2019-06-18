import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { AtAvatar, AtToast, AtDivider, AtButton, AtIcon } from "taro-ui";
import "./myInfo.scss";
import Notice from "../../components/rank/notice";
import logo from "../../assets/img/logo.png";
import { connect } from "@tarojs/redux";
import { ajaxGetUserScore } from "../../actions/useInfo";
@connect(
  ({ userInfo }) => ({
    userInfo
  }),
  dispatch => ({
    ajaxGetUserScore(data) {
      return dispatch(ajaxGetUserScore(data));
    }
  })
)
export default class MyInfo extends Component {
  config = {
    navigationBarTitleText: "HelloWorld Rank"
  };
  constructor() {
    super();
    this.state = {
      isLogin: false,
      basicInfo: {
        avatar: "",
        nickName: ""
      },
      noPlan: false,
      score: 0
    };
  }
  componentDidMount() {
    this.confirmLogin();
    this.ajaxGetInfo();
  }
  componentDidUpdate(prevProps) {
    console.log("进入", this.props, prevProps);
    if (prevProps.userInfo.userScore) {
      if (
        this.props.userInfo.userScore.totalScore !=
        prevProps.userInfo.userScore.totalScore
      )
        this.ajaxGetInfo();
    }
  }
  ajaxGetInfo = () => {
    let myUserId = Taro.getStorageSync("login").userId;
    const data = {
      userId: myUserId
    };
    this.props.ajaxGetUserScore(data).then(res => {
      if (res.code === 0) {
        this.setState({
          score: this.props.userInfo.userScore.totalScore
        });
      }
    });
  };
  confirmLogin = () => {
    if (
      Taro.getStorageSync("login") &&
      Taro.getStorageSync("basicInfo") &&
      Taro.getStorageSync("version")
    ) {
      const basicInfo = Taro.getStorageSync("basicInfo");
      this.setState({
        isLogin: true,
        basicInfo: basicInfo
      });
    } else {
      this.toLogin();
    }
  };
  toPage = type => {
    const { isLogin } = this.state;
    if (!isLogin) {
      this.toLogin();
      return;
    }
    switch (type) {
      case "myAward":
        Taro.navigateTo({
          url: "/pages/amount/myAward"
        });
        break;
      case "memberRank":
        Taro.navigateTo({
          url: "/pages/amount/memberRank"
        });
        break;
      case "myCollect":
        Taro.navigateTo({
          url: "/pages/amount/myCollect"
        });
        break;
      case "attention":
        Taro.navigateTo({
          url: "/pages/amount/attention"
        });
        break;
      case "scoreLottery":
        Taro.showToast({
          title: "正在开发中...",
          icon: "none"
        });
        break;
      default:
        break;
    }
  };
  noteLogin = () => {
    Taro.showToast({
      icon: "none",
      title: "登陆即可查看奖励"
    });
  };
  toLogin = () => {
    Taro.redirectTo({
      url: "/pages/login/login"
    });
  };
  render() {
    const { isLogin, basicInfo, noPlan, score } = this.state;
    return (
      <View className="top-bg">
        {/* {allInfo.isViewedJoinMyApplet && <Notice />} */}
        <View>
          {isLogin ? (
            <View className="intro">
              <View className="my-avatar center">
                <AtAvatar circle={true} size="large" image={basicInfo.avatar} />
              </View>
              <View className="intro-right">
                <View className="my-name center">{basicInfo.nickName}</View>
                <View className="my-score">积分：{score}</View>
              </View>
            </View>
          ) : (
            <View className="intro">
              <View className="my-avatar center">
                <AtAvatar circle={true} size="large" image={logo} />
              </View>
              <View className="intro-right">
                <AtButton onClick={this.toLogin} type="secondary">
                  点击登陆
                </AtButton>
              </View>
            </View>
          )}
          <View className="study-plan">
            <AtToast
              isOpened={noPlan}
              text="{请先登陆哦~}"
              icon="{close-circle}"
              status="error"
              hasMask={true}
              duration={500}
            />
            <View className="plan-action">
              <View
                className="per-action"
                onClick={this.toPage.bind(this, "myCollect")}>
                <AtIcon value="heart" size="30" color="#4f5fc5" />
                <View className="name">我的收藏</View>
              </View>
              <AtDivider />
              <View
                className="per-action"
                onClick={this.toPage.bind(this, "memberRank")}>
                <AtIcon value="numbered-list" size="30" color="#4f5fc5" />
                <View className="name">好友排行</View>
              </View>
              <AtDivider />
              <View
                className="per-action"
                onClick={this.toPage.bind(this, "myAward")}>
                <AtIcon value="shopping-bag" size="30" color="#4f5fc5" />
                <View className="name">积分商城</View>
              </View>
              <AtDivider />
              <View
                className="per-action"
                onClick={this.toPage.bind(this, "scoreLottery")}>
                <AtIcon value="bell" size="30" color="#4f5fc5" />
                <View className="name">积分抽奖</View>
              </View>

              <AtDivider />
              <View
                className="per-action"
                onClick={this.toPage.bind(this, "attention")}>
                <AtIcon value="tag" size="30" color="#4f5fc5" />
                <View className="name">关注公众号</View>
              </View>
              <AtDivider />
            </View>
          </View>
        </View>
        <View className="footer">
          <View className="about">关于我们</View>
          <Text decode="{{true}}" space="{{true}}">
            \r\t\r\t | \r\t\r\t
          </Text>
          <View className="question">
            <button open-type="feedback">问题反馈</button>
          </View>
        </View>
      </View>
    );
  }
}

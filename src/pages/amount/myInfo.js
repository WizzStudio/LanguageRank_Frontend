import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { AtAvatar, AtToast, AtDivider, AtButton, AtIcon } from "taro-ui";
import "./myInfo.scss";
import Notice from "../../components/rank/notice";
import { connect } from "@tarojs/redux";
import { ajaxGetUserAllInfo } from "../../actions/useInfo";
import logo from "../../assets/img/logo.png";
@connect(
  ({ userInfo }) => ({
    userInfo
  }),
  dispatch => ({
    ajaxGetUserAllInfo(data) {
      return dispatch(ajaxGetUserAllInfo(data));
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
      allInfo: {}
    };
  }
  static defaultProps = {
    userInfo: {
      allInfo: {
        studyPlanDay: 0
      }
    }
  };

  componentDidMount() {
    this.checkLogin();
  }
  componentWillReceiveProps(nextprops) {
    if (nextprops.userInfo.allInfo) {
      this.setState({
        allInfo: nextprops.userInfo.allInfo
      });
    }
  }
  checkLogin = () => {
    if (Taro.getStorageSync("login")) {
      if (Taro.getStorageSync("basicInfo")) {
        const loginInfo = Taro.getStorageSync("login");
        this.props.ajaxGetUserAllInfo(loginInfo.userId);
        const basicInfo = Taro.getStorageSync("basicInfo");
        this.setState({
          isLogin: true,
          basicInfo: basicInfo
        });
      } else {
      }
    } else {
      this.handleLogin();
    }
  };
  handleLogin = () => {
    Taro.login().then(res => {
      console.log("res", res);
      if (res.code) {
        Taro.request({
          url: "https://pgrk.wizzstudio.com/login",
          method: "POST",
          data: {
            code: res.code
          }
        }).then(loginRes => {
          console.log("loginRes", loginRes);
          if (loginRes.data.code === 0) {
            const data = loginRes.data.data;
            Taro.setStorageSync("login", {
              userId: data.userId,
              openId: data.openId,
              session_key: data.session_key
            });
          }
        });
      }
    });
  };
  bindGetUserInfo = e => {
    if (e.detail.userInfo) {
      Taro.setStorageSync("basicInfo", {
        nickName: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl
      });
      const loginInfo = Taro.getStorageSync("login");
      this.props.ajaxGetUserAllInfo(loginInfo.userId);
      this.setState({
        isLogin: true,
        basicInfo: {
          nickName: e.detail.userInfo.nickName,
          avatar: e.detail.userInfo.avatarUrl
        }
      });
      // this.checkLogin();
    }
  };
  toPage = type => {
    const { allInfo, isLogin } = this.state;
    // if (!isLogin) {
    //   Taro.showToast({
    //     title: "请先进行登陆哦~",
    //     icon: "none"
    //   });
    //   return;
    // }
    // if (!allInfo.myLanguage) {
    //   Taro.showToast({
    //     title: "请先去语言主页加入学习计划哦~",
    //     icon: "none"
    //   });
    //   return;
    // }
    switch (type) {
      case "myAward":
        Taro.navigateTo({
          url: "/pages/amount/myAward?userId=111"
        });
        break;
      case "memberRank":
        Taro.navigateTo({
          url: "/pages/amount/memberRank"
        });
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
  render() {
    const { isLogin, basicInfo, noPlan } = this.state;
    // const { allInfo } = this.props.userInfo;
    const { allInfo } = this.state;
    return (
      <View className="top-bg">
        {allInfo.isViewedJoinMyApplet && <Notice />}
        <View>
          {isLogin ? (
            <View className="intro">
              <View className="my-avatar center">
                <AtAvatar circle={true} size="large" image={basicInfo.avatar} />
              </View>
              <View className="intro-right">
                <View className="my-name center">{basicInfo.nickName}</View>
                <View className="my-score">积分：555</View>
              </View>
            </View>
          ) : (
            <View className="intro">
              <View className="my-avatar center">
                <AtAvatar circle={true} size="large" image={logo} />
              </View>
              <View className="intro-right">
                <AtButton
                  openType="getUserInfo"
                  onGetUserInfo={this.bindGetUserInfo}
                  type="secondary">
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
              <View className="per-action">
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
              <View className="per-action">
                <AtIcon value="bell" size="30" color="#4f5fc5" />
                <View className="name">积分抽奖</View>
              </View>

              <AtDivider />
              <View className="per-action">
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
          <View className="question">问题反馈</View>
        </View>
      </View>
    );
  }
}

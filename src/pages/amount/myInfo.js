import Taro, { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { AtAvatar, AtToast, AtDivider, AtButton, AtIcon } from "taro-ui";
import "./myInfo.scss";
import Notice from "../../components/rank/notice";
import logo from "../../assets/img/logo.png";
import { getLoginInfo } from "../../utils/getlocalInfo";
import checkToLogin from "../../utils/checkToLogin";
const myUserId = getLoginInfo().userId;
import myApi from "../../service/api";
import addUserRelation from "../../utils/addUserRelation";
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
  componentWillMount() {
    checkToLogin();
  }
  componentDidMount() {
    this.checkLogin();
    this.ajaxGetIngo();
  }
  ajaxGetIngo = async () => {
    const data = {
      userId: myUserId
    };
    const res = await myApi("/userinfo", "POST", data);
    if (res.code === 0) {
      this.setState({
        score: res.data.totalScore
      });
    }
    return res;
  };
  checkLogin = () => {
    if (Taro.getStorageSync("login")) {
      if (Taro.getStorageSync("basicInfo")) {
        const basicInfo = Taro.getStorageSync("basicInfo");
        this.setState({
          isLogin: true,
          basicInfo: basicInfo
        });
      }
    } else {
    }
  };
  toPage = type => {
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

  //特加测试的东西
  bindGetUserInfo = e => {
    if (e.detail.userInfo) {
      Taro.setStorageSync("basicInfo", {
        nickName: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl
      });
      Taro.getSetting()
        .then(res => {
          if (res.authSetting["scope.userInfo"]) {
            Taro.getUserInfo().then(userInfoRes => {
              this.handleLogin(userInfoRes.iv, userInfoRes.encryptedData);
            });
          }
        })
        .catch(() => {
          Taro.showToast({
            title: "登陆失败，请重试",
            icon: "fail"
          });
        });
    }
  };
  handleLogin = (iv, encryptedData) => {
    Taro.login().then(res => {
      if (res.code) {
        Taro.request({
          url: "https://pgrk.wizzstudio.com/login",
          method: "POST",
          data: {
            code: res.code,
            iv,
            encryptedData
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
            Taro.showToast({
              title: "测试登陆成功"
            });
            // addUserRelation(this, data.userId);
            // Taro.navigateBack();
          }
        });
      }
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
              <View className="per-action">
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
        <AtButton
          openType="getUserInfo"
          onGetUserInfo={this.bindGetUserInfo}
          type="primary">
          授权登陆
        </AtButton>
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

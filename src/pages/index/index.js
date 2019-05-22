import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import { AtSegmentedControl, AtNoticebar } from "taro-ui";
import AuthRankList from "../rank/authRankList";
import DemandRankList from "../rank/demandRankList";
import Notice from "../../components/rank/notice";
import "./index.scss";
import { connect } from "@tarojs/redux";
import { ajaxGetUserAllInfo } from "../../actions/useInfo";
import checkToLogin from "../../utils/checkToLogin";
import { addUserRelation } from "../../utils/addUserRelation";
@connect(
  ({ userInfo }) => ({
    userInfo
  }),
  dispatch => ({
    ajaxGetUserAllInfo(id) {
      return dispatch(ajaxGetUserAllInfo(id));
    }
  })
)
class Index extends Component {
  config = {
    navigationBarTitleText: "HelloWorld Rank"
  };
  constructor() {
    super();
    this.state = {
      current: 0,
      basicInfo: {},
      isViewedJoinMyApplet: false
    };
  }
  componentWillMount() {
    checkToLogin();
  }
  componentDidMount() {
    // if (Taro.getStorageSync("basicInfo")) {
    //   Taro.getSetting().then(res => {
    //     if (res.authSetting["scope.userInfo"]) {
    //       Taro.getUserInfo().then(userInfoRes => {
    //         // console.log("userInfoRes", userInfoRes);
    //         this.handleLogin(userInfoRes.iv, userInfoRes.encryptedData);
    //       });
    //     }
    //   });
    // }
  }
  handleClick(value) {
    this.setState({
      current: value
    });
  }

  checkLogin = () => {
    if (Taro.getStorageSync("basicInfo")) {
      this.setState({
        isLogin: true
      });
      const loginInfo = Taro.getStorageSync("login");
      const basicInfo = Taro.getStorageSync("basicInfo");
      this.props.ajaxGetUserAllInfo(loginInfo.userid);
      this.setState({
        basicInfo: basicInfo
      });
    } else {
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
          }
        });
      }
    });
  };
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onShareAppMessage = res => {
    const loginInfo = Taro.getStorageSync("login");
    const id = loginInfo.userid;
    return {
      title: "进入小程序了解当下最流行、最赚钱的编程语言",
      path: `/pages/index/index?userid=${id}`
    };
  };
  render() {
    const { isViewedJoinMyApplet } = this.state;
    return (
      <View className="top-bg">
        <View className="blank" />
        <View className="wrap">
          {isViewedJoinMyApplet && <Notice />}
          {/* <Notice /> */}
          <View className="tab-wrap">
            <AtSegmentedControl
              values={["语言热度榜", "雇主需求榜"]}
              onClick={this.handleClick.bind(this)}
              current={this.state.current}
              className="tab-seg"
            />
          </View>
          {this.state.current === 0 ? (
            <View className="tab-content">
              <AuthRankList isViewed={this.state.isViewedStudyPlan} />
            </View>
          ) : null}
          {this.state.current === 1 ? (
            <View className="tab-content">
              <DemandRankList />
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}

export default Index;

import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtAvatar, AtToast, AtProgress, AtButton } from "taro-ui";
import "./myInfo.scss";
import { connect } from "@tarojs/redux";
import { ajaxGetUserAllInfo } from "../../actions/useInfo";
@connect(
  ({ userInfo }) => ({
    userInfo
  }),
  dispatch => ({
    ajaxGetUserAllInfo(data) {
      dispatch(ajaxGetUserAllInfo(data));
    }
  })
)
export default class MyInfo extends Component {
  constructor() {
    super();
    this.state = {
      isLogin: false,
      basicInfo: {
        avatar: "",
        nickName: ""
      },
      noPlan: false
    };
  }
  componentDidMount() {
    this.checkLogin();
  }
  checkLogin = () => {
    if (Taro.getStorageSync("login")) {
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
        //这个else可以不要？？
        this.bindGetUserInfo();
        if (Taro.getStorageSync("basicInfo")) {
          const basicInfo = Taro.getStorageSync("basicInfo");
          this.setState({
            basicInfo: basicInfo
          });
        }
      }
    } else {
      this.handleLogin();
    }
  };
  handleLogin = () => {
    Taro.login({
      success(res) {
        if (res.code) {
          console.log("res.code", res.code);
          Taro.request({
            url: "http://pgrk.wizzstudio.com/login",
            method: "POST",
            data: {
              code: res.code
            }
          }).then(res => {
            console.log("re的res", res);
            if (res.data.code === 0) {
              const data = res.data.data;
              Taro.setStorageSync("login", {
                userid: data.userId,
                openId: data.openId,
                session_key: data.session_key
              });
            }
          });
        }
      }
    });
  };

  bindGetUserInfo = e => {
    console.log("e", e);
    if (e.detail.userInfo) {
      Taro.setStorageSync("basicInfo", {
        nickName: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl
      });
      this.setState({
        isLogin: true,
        basicInfo: {
          nickName: e.detail.userInfo.nickName,
          avatar: e.detail.userInfo.avatarUrl
        }
      });
      this.checkLogin();
    }
    // Taro.getSetting({
    //   success(res) {
    //     if (res.authSetting["scope.userInfo"]) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       Taro.getUserInfo(
    //         // success(res) {
    //         //   // console.log(res.userInfo);
    //         //   // Taro.setStorageSync("basicInfo", {
    //         //   //   nickname: res.userInfo.nickName,
    //         //   //   avatar: res.userInfo.avatarUrl
    //         //   // });
    //         // }
    //         {}
    //       ).then(res => {
    //         console.log(res.userInfo);
    //         Taro.setStorageSync("basicInfo", {
    //           nickname: res.userInfo.nickName,
    //           avatar: res.userInfo.avatarUrl
    //         });
    //         //TODO争议点
    //         this.setState({
    //           basicInfo: {
    //             avatar: res.userInfo.nickName,
    //             nickname: res.userInfo.avatarUrl
    //           }
    //         });
    //       });
    //     }
    //   }
    // });
  };
  handleNavigate = () => {
    const { isLogin } = this.state;
    if (isLogin) {
      Taro.navigateTo({
        url: "/pages/amount/dailyPlan"
      });
    } else {
      this.setState({
        noPlan: true
      });
    }
  };
  render() {
    const { isLogin, basicInfo, noPlan } = this.state;
    const { allInfo } = this.props.userInfo;
    console.log("this.state", this.state);
    return (
      <View className="top-bg">
        <View className="blank" />
        {isLogin ? (
          <View className="intro">
            <View className="my-avatar center">
              <AtAvatar circle={true} size="large" image={basicInfo.avatar} />
            </View>
            <View className="my-name center">{basicInfo.nickName}</View>
          </View>
        ) : (
          <View className="intro">
            <View className="my-avatar center">
              <AtAvatar
                circle
                size="large"
                image="https://jdc.jd.com/img/200"
              />
            </View>
            <View className="my-name center">
              <AtButton
                openType="getUserInfo"
                onGetUserInfo={this.bindGetUserInfo}
                className="my-name center">
                点击授权信息
              </AtButton>
            </View>
          </View>
        )}

        <View className="blank" />

        <View className="study-plan">
          <View className="blank" />

          <View className="plan-title-wrap" onClick={this.handleNavigate}>
            <View className="plan-title">我的学习计划</View>
            {allInfo.myLanguage ? (
              <View className="isPlaned">{allInfo.myLanguage}</View>
            ) : (
              <View className="isPlaned">未加入</View>
            )}
          </View>
          <AtToast
            isOpened={noPlan}
            text="{请先登陆哦~}"
            icon="{close-circle}"
            status="error"
            hasMask={true}
            duration={500}
          />
          <View className="plan-state">
            <View className="per-plan-state">
              {allInfo.joinedNumber ? (
                <View>{allInfo.joinedNumber}</View>
              ) : (
                <View>?</View>
              )}

              <View>已加入学习计划 </View>
            </View>
            <View className="per-plan-state">
              {allInfo.joinedToday ? (
                <View>{allInfo.joinedToday}</View>
              ) : (
                <View>?</View>
              )}

              <View>今日新增 </View>
            </View>
          </View>
          <View className="plan-progress">
            <AtProgress percent={10} strokeWidth={10} status="progress" />
            <View className="progress-intro">完成计划可获得相应奖励</View>
          </View>
          <View className="plan-action">
            <View>
              <AtButton type="secondary" className="my-award my-button">
                我的奖励
              </AtButton>
              <AtButton type="secondary" className="my-question my-button">
                问题反馈
              </AtButton>
            </View>
            <View>
              <AtButton type="primary" className="login-out my-button">
                退出登录
              </AtButton>
            </View>
          </View>

          {/* <View className="kinds">
            <View className="kinds-title">编程语言种类</View>
            <View className="kinds-img">语言图片</View>
          </View>
          <View className="plan-graph">学习路线图</View>
          <View className="books">
            <View className="per-book">
              <View>java推荐书籍</View>
              <Image />
            </View>
            <View className="per-book">
              <View>java推荐书籍</View>
              <Image />
            </View>
          </View> */}
        </View>
      </View>
    );
  }
}

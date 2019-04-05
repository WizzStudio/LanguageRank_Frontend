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
  // propTypes = {
  //   userInfo: PropTypes.object.isRequired,
  //   ajaxGetUserAllInfo: PropTypes.function.isRequired
  // };

  // defaultProps = {
  //   userInfo: {}
  // };
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
        // this.bindGetUserInfo();
        // if (Taro.getStorageSync("basicInfo")) {
        //   const basicInfo = Taro.getStorageSync("basicInfo");
        //   this.setState({
        //     basicInfo: basicInfo
        //   });
        // }
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
            url: "https://pgrk.wizzstudio.com/login",
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
  toDailyPlan = () => {
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
  toAward = () => {
    const { allInfo } = this.state;
    if (allInfo.studyPlanDay === 7) {
      Taro.navigateTo({
        url: "/pages/amount/myAward"
      });
    } else {
      Taro.showModal({
        title: "提示",
        content: "需要完成七日计划才可领取奖励哦~",
        showCancel: false,
        confirmText: "继续学习",
        confirmColor: "#4f5fc5",
        success(res) {
          if (res.confirm) {
            console.log("用户点击确定");
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
  };
  render() {
    const { isLogin, basicInfo, noPlan } = this.state;
    // const { allInfo } = this.props.userInfo;
    const { allInfo } = this.state;
    console.log("allInfo", allInfo);
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

          <View className="plan-title-wrap" onClick={this.toDailyPlan}>
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
              {allInfo.joinedToday + 1 ? (
                <View>{allInfo.joinedToday}</View>
              ) : (
                <View>?</View>
              )}

              <View>今日新增 </View>
            </View>
          </View>
          <View className="plan-progress">
            {allInfo.studyPlanDay ? (
              <AtProgress
                percent={Math.round((allInfo.studyPlanDay / 7) * 100)}
                strokeWidth={10}
                status="progress"
              />
            ) : (
              <AtProgress percent={0} strokeWidth={10} status="progress" />
            )}
            {/* <AtProgress percent={0} strokeWidth={10} status="progress" /> */}
            <View className="progress-intro">完成计划可获得相应奖励</View>
          </View>
          <View className="plan-action">
            <View>
              <AtButton
                type="primary"
                className="my-award my-button"
                onClick={this.toAward}>
                我的奖励
              </AtButton>
              <AtButton type="primary" className="login-out my-button">
                退出登录
              </AtButton>
            </View>
            <View className="add-question">问题反馈</View>
          </View>
        </View>
      </View>
    );
  }
}

import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtAvatar, AtToast, AtProgress, AtButton } from "taro-ui";
import "./myInfo.scss";
import { connect } from "@tarojs/redux";
import { ajaxGetUserAllInfo } from "../../actions/useInfo";
import logo from "../../assets/img/logo.png";
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
    console.log("进入props");
    if (nextprops.userInfo.allInfo) {
      console.log("进入props的if");
      this.setState({
        allInfo: nextprops.userInfo.allInfo
      });
    }
  }
  componentDidShow() {
    this.checkLogin();
  }
  checkLogin = () => {
    if (Taro.getStorageSync("login")) {
      if (Taro.getStorageSync("basicInfo")) {
        const loginInfo = Taro.getStorageSync("login");
        this.props.ajaxGetUserAllInfo(loginInfo.userid);
        const basicInfo = Taro.getStorageSync("basicInfo");
        this.setState({
          isLogin: true,
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
          Taro.request({
            url: "https://pgrk.wizzstudio.com/login",
            method: "POST",
            data: {
              code: res.code
            }
          }).then(res => {
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
    if (e.detail.userInfo) {
      Taro.setStorageSync("basicInfo", {
        nickName: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl
      });
      const loginInfo = Taro.getStorageSync("login");
      this.props.ajaxGetUserAllInfo(loginInfo.userid);
      this.setState({
        isLogin: true,
        basicInfo: {
          nickName: e.detail.userInfo.nickName,
          avatar: e.detail.userInfo.avatarUrl
        }
      });
      // this.checkLogin();
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
    Taro.navigateTo({
      url: "/pages/amount/myAward"
    });
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
        <View className="blank" />
        {isLogin ? (
          <View>
            <View className="intro">
              <View className="my-avatar center">
                <AtAvatar circle={true} size="large" image={basicInfo.avatar} />
              </View>
              <View className="my-name center">{basicInfo.nickName}</View>
            </View>
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
                  {allInfo.joinedNumber + 1 ? (
                    <View className="num">{allInfo.joinedNumber}</View>
                  ) : (
                    <View className="num">?</View>
                  )}

                  <View className="text">已加入学习计划 </View>
                </View>
                <View className="per-plan-state">
                  {allInfo.joinedToday + 1 ? (
                    <View className="num">{allInfo.joinedToday}</View>
                  ) : (
                    <View className="num">?</View>
                  )}

                  <View className="text">今日新增 </View>
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
                    className="my-plan my-button"
                    onClick={this.toDailyPlan}>
                    我的计划
                  </AtButton>
                  <AtButton
                    type="primary"
                    className="my-award my-button"
                    onClick={this.toAward}>
                    我的奖励
                  </AtButton>
                  <AtButton
                    openType="feedback"
                    type="secondary"
                    className="my-question">
                    问题反馈
                  </AtButton>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View>
            <View className="intro">
              <View className="my-avatar center">
                <AtAvatar
                  circle
                  size="large"
                  // image="https://jdc.jd.com/img/200"
                  image={logo}
                />
              </View>
              <View className="my-name center">
                <AtButton
                  openType="getUserInfo"
                  onGetUserInfo={this.bindGetUserInfo}
                  className="my-name center">
                  点击登陆
                </AtButton>
              </View>
            </View>
            <View className="blank" />
            <View className="study-plan">
              <View className="blank" />

              <View className="plan-title-wrap" onClick={this.noteLogin}>
                <View className="plan-title">我的学习计划</View>
                <View className="isPlaned">未加入</View>
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
                  <View className="num">?</View>

                  <View className="text">已加入学习计划 </View>
                </View>
                <View className="per-plan-state">
                  <View className="num">?</View>

                  <View className="text">今日新增 </View>
                </View>
              </View>
              <View className="plan-progress">
                <AtProgress percent={0} strokeWidth={10} status="progress" />
                <View className="progress-intro">完成计划可获得相应奖励</View>
              </View>
              <View className="plan-action">
                <View>
                  <AtButton
                    type="primary"
                    className="my-plan my-button"
                    onClick={this.noteLogin}>
                    我的计划
                  </AtButton>
                  <AtButton
                    type="primary"
                    className="my-award my-button"
                    onClick={this.noteLogin}>
                    我的奖励
                  </AtButton>
                  <AtButton
                    openType="feedback"
                    type="secondary"
                    className="my-question">
                    问题反馈
                  </AtButton>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

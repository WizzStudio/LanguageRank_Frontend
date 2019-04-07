import Taro, { Component, getStorageSync } from "@tarojs/taro";
import { View, Swiper } from "@tarojs/components";
import { AtCard, AtButton, AtActivityIndicator } from "taro-ui";
import "./dailyPlan.scss";
import { connect } from "@tarojs/redux";
import { ajaxGetUserPlan } from "../../actions/useInfo";
@connect(
  ({ userInfo }) => ({
    userInfo
  }),
  dispatch => ({
    ajaxGetUserPlan(data) {
      dispatch(ajaxGetUserPlan(data));
    }
  })
)
export default class DailyPlan extends Component {
  config = {
    navigationBarTitleText: "七日学习计划"
  };
  constructor() {
    super();
    this.state = {
      current: 0,
      userInfo: {
        userPlan: []
      },
      isLoading: true
    };
  }
  // static defaultProps = {
  //   userInfo: {
  //     userPlan: []
  //   }
  // };
  componentDidMount() {
    const loginInfo = getStorageSync("login");
    this.props.ajaxGetUserPlan(loginInfo.userid);
  }
  componentWillReceiveProps(nextprops) {
    if (nextprops.userInfo) {
      this.setState({
        userInfo: nextprops.userInfo,
        isLoading: false
      });
    }
  }
  handleSwiper = e => {
    this.setState({
      current: e.detail.current
    });
  };
  toAward = () => {
    const { userPlan } = this.state.userInfo;
    if (userPlan.length === 7) {
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
  showPlanDay = str => {
    switch (str) {
      case "FIRST_DAY":
        return "第一天";
      case "SECOND_DAY":
        return "第二天";
      case "THIRD_DAY":
        return "第三天";
      case "FOURTH_DAY":
        return "第四天";
      case "FIFTH_DAY":
        return "第五天";
      case "SIXTH_DAY":
        return "第六天";
      case "SEVEN_DAY":
        return "第七天";
      default:
        break;
    }
  };
  onShareAppMessage = res => {
    console.log("res", res);
    if ((res.from = "button")) {
      console.log("用户点击了分享");
      console.log("this.state.current", this.state.current);
      const loginInfo = getStorageSync("login");
      // Taro.request({
      //   url:'https://pgrk.wizzstudio.com/updatetranspond',
      //   method:'POST',
      //   data:{
      //     userId:loginInfo.userid,
      //     studyPlanDay:
      //   }
      // })
    }
    return {
      title: "转发标题"
      // path: '/page/user?id=123'
    };
  };
  render() {
    const { studyPlan } = this.state.userInfo.userPlan;
    const { current, isLoading } = this.state;
    return (
      <View>
        <View className="main-plan">
          <View className="plan-content">
            {isLoading ? (
              <View className="loading-wrap">
                <AtActivityIndicator
                  content="正在为你加载学习内容..."
                  size={40}
                />
              </View>
            ) : (
              <Swiper
                className="swiper"
                indicatorColor="#999"
                indicatorActiveColor="#333"
                previousMargin="50px"
                nextMargin="50px"
                current={studyPlan.length - 1}
                onChange={this.handleSwiper}
                indicatorDots>
                {studyPlan.map((item, index) => {
                  return (
                    <SwiperItem
                      index={index}
                      key={index}
                      // className={`plan-item ${current === index ? active : ""}`}
                      className={[
                        "plan-item",
                        current === index ? "active" : ""
                      ].join(" ")}>
                      <View className="plan-title">
                        {this.showPlanDay(item.studyPlanDay)}
                      </View>
                      <AtCard className="plan-card">
                        <Image className="full-plan" src={item.imageOne} />
                      </AtCard>

                      {/* <AtCard className="plan-card">{item}</AtCard> */}
                    </SwiperItem>
                  );
                })}
              </Swiper>
            )}
          </View>
        </View>

        <View className="action">
          <AtButton
            type="secondary"
            className="transfer-award"
            open-type="share">
            转发可领取当天第二份资料
          </AtButton>
          <AtButton type="primary" className="get-award" onClick={this.toAward}>
            领取奖励
          </AtButton>
        </View>
      </View>
    );
  }
}

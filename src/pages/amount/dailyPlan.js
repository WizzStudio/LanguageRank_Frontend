import Taro, {
  Component,
  getStorageSync,
  closeBLEConnection
} from "@tarojs/taro";
import { View, Swiper } from "@tarojs/components";
import { AtCard, AtButton, AtActivityIndicator, AtIcon } from "taro-ui";
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
    navigationBarTitleText: "累计七天领取奖励"
  };
  constructor() {
    super();
    this.state = {
      current: 0,
      userInfo: {
        userPlan: []
      },
      isLoading: true,
      allPlan: []
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
    let allPlan = [];
    if (nextprops.userInfo) {
      const isShow = nextprops.userInfo.userPlan.isTranspondedList;
      let initCurrent = (nextprops.userInfo.userPlan.studyPlan.length - 1) * 2;
      console.log("ini", initCurrent);
      nextprops.userInfo.userPlan.studyPlan.map((item, index) => {
        allPlan.push({
          studyPlanDay: item.studyPlanDay,
          image: item.imageOne,
          show: true,
          number: 0
        });
        allPlan.push({
          studyPlanDay: item.studyPlanDay,
          image: item.imageTwo,
          show: isShow[index],
          number: 1
        });
      });
      this.setState({
        userInfo: nextprops.userInfo,
        isLoading: false,
        allPlan: allPlan,
        current: initCurrent
      });
    }
  }

  toAward = () => {
    Taro.navigateTo({
      url: "/pages/amount/myAward"
    });
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
      case "ACCOMPLISHED":
        return "第七天";
      default:
        break;
    }
  };
  handleSwiper = e => {
    this.setState({
      current: e.detail.current
    });
  };
  onShareAppMessage = res => {
    const { current } = this.state;
    // current === 0 ? this.state.current - 1 : current;
    const loginInfo = getStorageSync("login");
    Taro.request({
      url: "https://pgrk.wizzstudio.com/updatetranspond",
      method: "POST",
      data: {
        userId: loginInfo.userid,
        studyPlanDay: parseInt(current / 2) + 1
      }
    }).then(response => {
      const res = response.data;
      console.log("res", res);
      if (res.code === 0) {
        //用户转发成功后向后台更新用户每日转发状态
        //这一步触发dispatch请求成功之后如何及时更新到页面上
        this.props.ajaxGetUserPlan(loginInfo.userid);
      }
    });
    return {
      title: "HelloWorld Rank"
    };
  };
  render() {
    // const { studyPlan } = this.state.userInfo.userPlan;
    const { current, isLoading, allPlan } = this.state;
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
                current={current}
                onChange={this.handleSwiper}
                indicatorDots>
                {allPlan.map((item, index) => {
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
                        {item.number
                          ? this.showPlanDay(item.studyPlanDay) + "(二)"
                          : this.showPlanDay(item.studyPlanDay) + "（一）"}
                      </View>

                      {item.show ? (
                        <AtCard className="plan-card">
                          <Image className="full-plan" src={item.image} />
                        </AtCard>
                      ) : (
                        <AtCard className="plan-card cover">
                          <View className="no-plan-note">点击下方按钮</View>
                          <View className="no-plan-note">
                            可领取第二份资料~
                          </View>
                          <View className="no-plan-note">
                            <AtIcon value="arrow-down" size="49" color="#fff" />
                          </View>
                        </AtCard>
                      )}

                      {/* <AtCard className="plan-card">{item}</AtCard> */}
                    </SwiperItem>
                  );
                })}
              </Swiper>
            )}
          </View>
        </View>

        <View className="action">
          <AtButton type="primary" className="transfer-award" open-type="share">
            转发领取当天第二份资料
          </AtButton>
          <AtButton
            type="secondary"
            className="get-award"
            onClick={this.toAward}>
            领取奖励
          </AtButton>
        </View>
      </View>
    );
  }
}

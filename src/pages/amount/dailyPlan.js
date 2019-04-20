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
    navigationBarTitleText: "七天认识一门编程语言"
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
  componentDidMount() {
    const loginInfo = getStorageSync("login");
    this.props.ajaxGetUserPlan(loginInfo.userid);
  }
  componentWillReceiveProps(nextprops) {
    let allPlan = [];
    if (nextprops.userInfo) {
      const isShow = nextprops.userInfo.userPlan.isTranspondedList;
      let initCurrent = (nextprops.userInfo.userPlan.studyPlan.length - 1) * 2;
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
      if (res.code === 0) {
        this.props.ajaxGetUserPlan(loginInfo.userid);
      }
    });
    return {
      title: "进入小程序了解当下最流行、最赚钱的编程语言",
      path: "/pages/index/index"
    };
  };
  preview = url => {
    Taro.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    });
  };
  render() {
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
                        <AtCard
                          className="plan-card"
                          onClick={this.preview.bind(this, item.image)}>
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

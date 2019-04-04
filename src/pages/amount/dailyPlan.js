import Taro, { Component } from "@tarojs/taro";
import { View, Swiper, MovableArea, MovableView } from "@tarojs/components";
import { AtCard, AtButton } from "taro-ui";
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
  constructor() {
    super();
    this.state = {
      current: 0
    };
  }
  componentDidMount() {
    this.props.ajaxGetUserPlan(1);
  }
  handleSwiper = e => {
    console.log("e", e);
    this.setState({
      current: e.detail.current
    });
  };
  render() {
    const { userPlan } = this.props.userInfo;
    const { current } = this.state;
    console.log("userPlan", userPlan);
    return (
      <View>
        <View className="main-plan">
          <View className="plan-content">
            <Swiper
              className="swiper"
              indicatorColor="#999"
              indicatorActiveColor="#333"
              previousMargin="50px"
              nextMargin="50px"
              current={userPlan.length - 1}
              onChange={this.handleSwiper}
              indicatorDots>
              {userPlan.map((item, index) => {
                return (
                  <SwiperItem
                    index={index}
                    key={index}
                    // className={`plan-item ${current === index ? active : ""}`}
                    className={[
                      "plan-item",
                      current === index ? "active" : ""
                    ].join(" ")}>
                    <View className="plan-title">{item.studyPlanDay}</View>
                    <AtCard className="plan-card">
                      <Image className="full-plan" src={item.imageOne} />
                    </AtCard>

                    {/* <AtCard className="plan-card">{item}</AtCard> */}
                  </SwiperItem>
                );
              })}
            </Swiper>
          </View>
        </View>

        <View className="action">
          <AtButton type="secondary" className="transfer-award">
            转发可领取当天第二份资料
          </AtButton>
          <AtButton type="primary" className="get-award">
            领取奖励
          </AtButton>
        </View>
      </View>
    );
  }
}

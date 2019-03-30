import Taro, { Component } from "@tarojs/taro";
import { View, Swiper, MovableArea, MovableView } from "@tarojs/components";
import { AtCard, AtButton } from "taro-ui";
import "./dailyPlan.scss";
export default class DailyPlan extends Component {
  constructor() {
    super();
    this.state = {
      current: 0
    };
  }
  handleSwiper = e => {
    // console.log("e", e);
    this.setState({
      current: e.detail.current
    });
  };
  render() {
    const { current } = this.state;
    const plan = ["con1", "con2", "con3", "con4", "con5"];
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
              current="1"
              onChange={this.handleSwiper}
              indicatorDots>
              {plan.map((item, index) => {
                return (
                  <SwiperItem
                    index={index}
                    key={index}
                    // className={`plan-item ${current === index ? active : ""}`}
                    className={[
                      "plan-item",
                      current === index ? "active" : ""
                    ].join(" ")}>
                    <View className="plan-title">第一天</View>
                    <AtCard className="plan-card">{item}</AtCard>
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

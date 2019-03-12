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
    console.log("e", e);
    this.setState({
      current: e.detail.current
    });
  };
  render() {
    const { current } = this.state;
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
              <SwiperItem
                index="0"
                // className={`plan-item ${current === index ? active : ""}`}
                className="plan-item">
                <View className="plan-title">第一天</View>
                <AtCard className="plan-card">
                  这也是内容区 可以随意定义功能 这也是内容区 可以随意定义功能
                  这也是内容区 可以随意定义功能 这也是内容区 可以随意定义功能
                  这也是内容区 可以随意定义功能 这也是内容区 可以随意定义功能
                  这也是内容区 可以随意定义功能 这也是内容区 可以随意定义功能
                  这也是内容区 可以随意定义功能
                </AtCard>
              </SwiperItem>
              <SwiperItem index="1" className="plan-item active">
                <View className="plan-title">第二天</View>
                <AtCard className="plan-card">
                  这也是内容区 可以随意定义功能 这也是内容区 可以随意定义功能
                  这也是内容区 可以随意定义功能 这也是内容区 可以随意定义功能
                  这也是内容区 可以随意定义功能 这也是内容区 可以随意定义功能
                  这也是内容区 可以随意定义功能 这也是内容区 可以随意定义功能
                  这也是内容区 可以随意定义功能
                </AtCard>
              </SwiperItem>
              <SwiperItem className="plan-item">
                <View className="plan-title">第三天</View>
                <AtCard className="plan-card">
                  这也是内容区 可以随意定义功能 这也是内容区 可以随意定义功能
                  这也是内容区 可以随意定义功能 这也是内容区 可以随意定义功能
                  这也是内容区 可以随意定义功能 这也是内容区 可以随意定义功能
                  这也是内容区 可以随意定义功能 这也是内容区 可以随意定义功能
                  这也是内容区 可以随意定义功能
                </AtCard>
              </SwiperItem>
              <SwiperItem>
                <View className="demo-text-3">3</View>
              </SwiperItem>
              <SwiperItem>
                <View className="demo-text-3">3</View>
              </SwiperItem>
              <SwiperItem>
                <View className="demo-text-3">3</View>
              </SwiperItem>
              <SwiperItem>
                <View className="demo-text-3">3</View>
              </SwiperItem>
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

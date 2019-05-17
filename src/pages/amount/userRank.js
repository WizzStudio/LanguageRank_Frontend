import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtAvatar, AtDivider, AtTabs, AtTabsPane } from "taro-ui";
import "./userRank.scss";
export default class UserRank extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 0
    };
  }
  tabClick = value => {
    this.setState({
      currentTab: value
    });
  };
  render() {
    const tabList = [{ title: "勤奋排行" }, { title: "人气排行" }];
    const { currentTab } = this.state;
    return (
      <View className="userRank">
        <View className="title-wrap">
          <View className="avatar-wrap">
            <Image className="avatar" src="https://jdc.jd.com/img/200" />
          </View>
          <View className="card-wrap">
            <View className="per-item">
              <View className="name">连续打卡</View>
              <View className="num">1</View>
            </View>
            <View className="per-item">
              <View className="name">总计打卡</View>
              <View className="num">1000</View>
            </View>
            <View className="per-item">
              <View className="name">获得积分</View>
              <View className="num">10</View>
            </View>
          </View>
          <View className="btn-wrap">
            {/* <View className="envy">
              <AtButton type="primary">膜拜TA</AtButton>
            </View> */}
            <View className="achieve">
              <AtButton type="primary">生成成就卡</AtButton>
            </View>
          </View>
        </View>
        <AtDivider />
        <AtTabs
          current={currentTab}
          tabList={tabList}
          onClick={this.tabClick.bind(this)}>
          <AtTabsPane current={currentTab} index={0}>
            <View className="member-list">
              <View className="member-item">
                <View className="rank">1</View>
                <View className="avatar-wrap">
                  <Image className="avatar" src="https://jdc.jd.com/img/200" />
                </View>
                <View className="name">二哈</View>
                <View className="total">30</View>
              </View>
              <View className="member-item">
                <View className="rank">1</View>
                <View className="avatar-wrap">
                  <Image className="avatar" src="https://jdc.jd.com/img/200" />
                </View>
                <View className="name">二哈</View>
                <View className="total">30</View>
              </View>
            </View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            人气排行
          </AtTabsPane>
        </AtTabs>
      </View>
    );
  }
}

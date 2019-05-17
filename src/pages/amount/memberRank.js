import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtDivider, AtButton } from "taro-ui";
import "./memberRank.scss";
export default class MemberRank extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <View className="memberRank">
        <View className="top">每晚24：00更新</View>
        <View className="nickname">taleyoung</View>
        <View className="title">
          <View className="rank">第2名</View>
          <View className="score">本周获得20分</View>
          <View className="score-btn">
            <AtButton size="small" type="primary">
              积分兑换
            </AtButton>
          </View>
        </View>
        <AtDivider />
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
      </View>
    );
  }
}

import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtDivider, AtButton } from "taro-ui";
import myApi from "../../service/api";
import "./memberRank.scss";
import { getLoginInfo, getBasicInfo } from "../../utils/getlocalInfo";

const myUserId = getLoginInfo().userId;
const myNickName = getBasicInfo().nickName;
export default class MemberRank extends Component {
  constructor() {
    super();
    this.state = {
      friRank: []
    };
  }
  componentDidMount() {
    this.getFriendRank();
  }
  getFriendRank = () => {
    const data = {
      userId: myUserId
    };
    myApi("/getuserrelationshiprank", "POST", data).then(res => {
      console.log("res", res);
      this.setState({
        friRank: res.data
      });
    });
  };
  toAwardStore = () => {
    Taro.navigateTo({
      url: "/pages/amount/myAward"
    });
  };
  render() {
    const { friRank } = this.state;
    return (
      <View className="memberRank">
        <View className="top">每晚24：00更新</View>
        <View className="nickname">{myNickName}</View>
        <View className="title">
          <View className="rank">第2名</View>
          <View className="score">本周获得20分</View>
          <View className="score-btn">
            <AtButton size="small" type="primary" onClick={this.toAwardStore}>
              积分兑换
            </AtButton>
          </View>
        </View>
        <AtDivider />
        <View className="member-list">
          {friRank.map(item => (
            <View className="member-item" key={item.nickName}>
              <View className="rank">1</View>
              <View className="avatar-wrap">
                <Image className="avatar" src="https://jdc.jd.com/img/200" />
              </View>
              <View className="name">{item.nickName}</View>
              <View className="total">{item.totalScore}</View>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

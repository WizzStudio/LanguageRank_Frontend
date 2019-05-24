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
      friRank: [],
      rankNum: 0,
      total: 0
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
      let rankNum = 0,
        total = 0;
      res.data.forEach((item, index) => {
        if (item.userId === myUserId) {
          (rankNum = index + 1), (total = item.totalScore);
        }
      });
      console.log("total", total);
      this.setState({
        friRank: res.data,
        rankNum,
        total
      });
    });
  };
  toAwardStore = () => {
    Taro.navigateTo({
      url: "/pages/amount/myAward"
    });
  };
  render() {
    const { friRank, rankNum, total } = this.state;
    return (
      <View className="memberRank">
        <View className="top">每晚24：00更新</View>
        <View className="nickname">{myNickName}</View>
        <View className="title">
          <View className="rank">第{rankNum}名</View>
          <View className="score">本周获得{total}分</View>
          <View className="score-btn">
            <AtButton size="small" type="primary" onClick={this.toAwardStore}>
              积分兑换
            </AtButton>
          </View>
        </View>
        <AtDivider />
        <View className="member-list">
          <View className="member-item title">
            <View className="rank">排名</View>
            <View className="avatar-wrap" />
            <View className="name">用户</View>
            <View className="total">积分</View>
          </View>
          {friRank.map(item => (
            <View className="member-item" key={item.nickName}>
              <View className="rank">1</View>
              <View className="avatar-wrap">
                <Image className="avatar" src={item.avatarUrl} />
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

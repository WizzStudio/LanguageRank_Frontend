import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtDivider } from "taro-ui";
import myApi from "../../service/api";
import ShareBtn from "../../components/class/shareBtn";
import "./memberRank.scss";
import { getLoginInfo, getBasicInfo } from "../../utils/getlocalInfo";
let myUserId, myNickName;

export default class MemberRank extends Component {
  config = {
    navigationBarTitleText: "好友排行"
  };
  constructor() {
    super();
    this.state = {
      friRank: [],
      rankNum: 0,
      total: 0
    };
  }
  componentDidMount() {
    myUserId = getLoginInfo().userId;
    myNickName = getBasicInfo().nickName;
    this.getFriendRank();
  }
  getFriendRank = () => {
    let myUserId = Taro.getStorageSync("login").userId;
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
      this.setState({
        friRank: res.data,
        rankNum,
        total
      });
    });
  };
  onShareAppMessage = () => {
    let myUserId = Taro.getStorageSync("login").userId;
    return {
      title: "进入小程序了解当下最流行、最赚钱的编程语言",
      path: `/pages/index/index?shareId=${myUserId}`
    };
  };
  render() {
    myNickName = getBasicInfo().nickName;
    const { friRank, rankNum, total } = this.state;
    return (
      <View className="memberRank">
        {/* <View className="top">每晚24：00更新</View> */}
        <View className="nickname">{myNickName}</View>
        <View className="title">
          <View className="rank">第{rankNum}名</View>
          <View className="score">已获得{total}分</View>
          <View className="score-wrap">
            <View className="add-note">邀请好友</View>
            <ShareBtn />
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
          {friRank.map((item, index) => (
            <View className="member-item" key={item.nickName}>
              <View className="rank">{index + 1}</View>
              <View className="avatar-wrap">
                <Image className="avatar" src={item.avatarUrl} />
              </View>
              <View className="name">{item.nickName}</View>
              <View className="total">{item.totalScore}</View>
            </View>
          ))}
          <View className="note-add">
            为保护您的隐私，小程序不会获取你的好友列表，想要和更多的好友一起pk排行，快点击上方邀请好友一起打卡吧！
          </View>
        </View>
      </View>
    );
  }
}

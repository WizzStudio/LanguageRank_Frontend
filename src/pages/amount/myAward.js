import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./myAward.scss";
import { AtDivider, AtButton, AtMessage } from "taro-ui";
import myApi from "../../service/api";
import { getLoginInfo } from "../../utils/getlocalInfo";
import testImg from "../../assets/img/canvasAuth.png";
const myUserId = getLoginInfo().userId;
export default class MyAward extends Component {
  config = {
    navigationBarTitleText: "积分商城"
  };
  constructor() {
    super();
    this.state = {
      myTotalScore: 0,
      myAvailableScore: 0,
      awardStoreList: []
    };
  }
  componentDidMount() {
    this.getAwardStore();
  }
  getAwardStore = () => {
    const data = {
      userId: myUserId
    };
    myApi("/scorestore", "POST", data).then(res => {
      this.setState({
        myTotalScore: res.data.myTotalScore,
        myAvailableScore: res.data.myAvailableScore,
        awardStoreList: res.data.awardStoreList
      });
    });
  };
  exchangeAward = (awardId, score) => {
    const { myAvailableScore } = this.state;
    if (myAvailableScore < score) {
      Taro.atMessage({
        message: "兑换成功",
        type: "warning"
      });
      return;
    }
    const data = {
      userId: myUserId,
      awardId
    };
    myApi("/exchangedaward", "POST", data).then(res => {
      if (res.code === 0) {
        Taro.atMessage({
          message: "兑换成功",
          type: "success"
        });
        this.getAwardStore();
      }
    });
  };
  render() {
    const { myTotalScore, myAvailableScore, awardStoreList } = this.state;
    return (
      <View>
        <AtMessage />
        <View className="my-award" key={index}>
          <View className="pre-award-title">
            总积分:{myTotalScore} 剩余积分:{myAvailableScore}
          </View>
          {awardStoreList.map((item, index) => (
            <View key={item.awardId} className="per-award">
              <View className="award-content">
                <Image src={testImg} className="award-img" />
              </View>
              <View className="award-name">所需积分:{item.score}</View>
              {item.isExchanged ? (
                <AtButton type="primary" size="small" disabled>
                  已兑换
                </AtButton>
              ) : (
                <AtButton
                  type="primary"
                  size="small"
                  onClick={this.exchangeAward.bind(
                    this,
                    item.awardId,
                    item.score
                  )}>
                  兑换
                </AtButton>
              )}{" "}
            </View>
          ))}
        </View>
        <AtDivider />
        <View className="blank" />
      </View>
    );
  }
}

import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./myAward.scss";
import { AtDivider, AtButton, AtMessage } from "taro-ui";
import myApi from "../../service/api";
import { getLoginInfo } from "../../utils/getlocalInfo";
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
    let myUserId = Taro.getStorageSync("login").userId;
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
    let myUserId = Taro.getStorageSync("login").userId;
    const { myAvailableScore } = this.state;
    if (myAvailableScore < score) {
      Taro.atMessage({
        message: "积分不够哦，快去打卡获取积分吧~",
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
  showAward = (title, content) => {
    Taro.showModal({
      title: title,
      content: content,
      confirmText: "关闭",
      confirmText: "复制",
      confirmColor: "#4f5fc5"
    }).then(res => {
      if (res.confirm) {
        this.copyContent(content);
      }
    });
  };
  copyContent = content => {
    Taro.setClipboardData({
      data: content
    })
      .then(() => {
        Taro.showToast({
          title: "复制成功"
        });
      })
      .catch(() => {
        Taro.showToast({
          title: "复制失败"
        });
      });
  };
  render() {
    const { myTotalScore, myAvailableScore, awardStoreList } = this.state;
    return (
      <View>
        <AtMessage />
        <View className="pre-award-title">
          总积分:{myTotalScore}\t\t|\t\t 剩余积分:{myAvailableScore}
        </View>
        <View className="my-award award-wrap" key={index}>
          {awardStoreList.map((item, index) => (
            <View key={item.awardId} className="per-award">
              <View className="award-content">
                <Image src={item.image} className="award-img" />
              </View>
              <View className="award-name">所需积分:{item.score}</View>
              {item.isExchanged ? (
                <AtButton
                  type="secondary"
                  size="small"
                  onClick={this.showAward.bind(this, item.content, item.link)}>
                  查看
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
              )}
            </View>
          ))}
        </View>
        <AtDivider />
        <View className="blank" />
      </View>
    );
  }
}

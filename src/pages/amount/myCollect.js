import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import myApi from "../../service/api";
import "./myCollect.scss";
import { getLoginInfo } from "../../utils/getlocalInfo";
import ShareBtn from "../../components/class/shareBtn";
const myUserId = getLoginInfo().userId;
export default class MyCollect extends Component {
  config = {
    navigationBarTitleText: "我的收藏"
  };
  constructor() {
    super();
    this.state = {
      collectList: []
    };
  }
  componentDidMount() {
    this.getCollection();
  }
  getCollection = () => {
    const data = {
      userId: myUserId
    };
    myApi("/getcollection", "POST", data).then(res => {
      console.log("res", res);
      this.setState({
        collectList: res.data
      });
    });
  };
  cancelCollection = () => {
    const data = {
      userId: myUserId,
      clazzId,
      studyPlanDay
    };
    myApi("/cancelcollection", "POST", data).then(res => {
      if (res.code === 0) {
        Taro.atMessage({
          message: "取消成功",
          type: "success"
        });
      }
    });
  };
  onShareAppMessage = res => {
    const loginInfo = Taro.getStorageSync("login");
    const id = loginInfo.userid;
    console.log("res", res);
    return {
      title: "进入小程序了解当下最流行、最赚钱的编程语言",
      path: `/pages/class/classHome?clazzId=${3}&userid=${id}`
    };
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
    const { collectList } = this.state;
    return (
      <View className="collect-padding">
        {collectList.map(item => (
          <View className="collect-wrap" key={item.briefIntroduction}>
            <View className="content-wrap">
              <View
                className="left"
                onClick={this.copyContent.bind(
                  this,
                  item.link + "提取码：" + item.extractedCode
                )}>
                <View className="title">{item.briefIntroduction}</View>
                <View className="content">{item.content}</View>
                <View className="codeStr">提取码：{item.extractedCode}</View>
              </View>
              <View className="right">
                <ShareBtn param={item.clazzName} />
              </View>
            </View>
            <View className="come-from">来自：{item.clazzName}</View>
            <View className="come-from">取消收藏</View>
          </View>
        ))}
      </View>
    );
  }
}

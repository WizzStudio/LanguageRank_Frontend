import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtMessage } from "taro-ui";
import myApi from "../../service/api";
import "./myCollect.scss";
import { getLoginInfo } from "../../utils/getlocalInfo";
import ShareBtn from "../../components/class/shareBtn";
import noCollectionImg from "../../assets/img/no-collection.png";
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
    let myUserId = Taro.getStorageSync("login").userId;
    const data = {
      userId: myUserId
    };
    myApi("/getcollection", "POST", data).then(res => {
      this.setState({
        collectList: res.data
      });
    });
  };
  showSheet = item => {
    Taro.showActionSheet({
      itemList: ["复制", "取消收藏"],
      itemColor: "#4f5fc5"
    }).then(res => {
      if (res.tapIndex === 0) {
        this.copyContent(item.link + "提取码：" + item.extractedCode);
      } else if (res.tapIndex === 1) {
        this.cancelCollection(item.clazzId, item.studyPlanDay);
      }
    });
  };
  cancelCollection = (clazzId, studyPlanDay) => {
    let myUserId = Taro.getStorageSync("login").userId;
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
        this.getCollection();
      } else {
        Taro.atMessage({
          message: "取消失败，请检查网络环境",
          type: "warning"
        });
      }
    });
  };
  onShareAppMessage = res => {
    const loginInfo = Taro.getStorageSync("login");
    const id = loginInfo.userid;
    return {
      title: "进入小程序了解当下最流行、最赚钱的编程语言",
      path: `/pages/index/index?shareId=${id}`
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
        <AtMessage />
        {collectList.length === 0 && (
          <View className="no-collect">
            <Image className="noImg" src={noCollectionImg} />
            <View className="no-collect-note">
              快去猿圈加入班级，\n收藏你的学习链接吧！
            </View>
          </View>
        )}
        {collectList.map(item => (
          <View className="collect-wrap" key={item.briefIntroduction}>
            <View className="content-wrap">
              <View className="left" onClick={this.showSheet.bind(this, item)}>
                <View className="title">{item.briefIntroduction}</View>
                <View className="content">{item.content}</View>
                <View className="codeStr">提取码：{item.extractedCode}</View>
              </View>
              <View className="right">
                <ShareBtn param={item.clazzId} />
              </View>
            </View>
            <View
              onClick={this.showSheet.bind(this, item)}
              className="come-from">
              来自：{item.clazzName}
            </View>
          </View>
        ))}
      </View>
    );
  }
}

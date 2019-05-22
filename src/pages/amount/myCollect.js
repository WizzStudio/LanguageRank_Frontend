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
  onShareAppMessage = res => {
    const loginInfo = Taro.getStorageSync("login");
    const id = loginInfo.userid;
    console.log("res", res);
    return {
      title: "进入小程序了解当下最流行、最赚钱的编程语言",
      path: `/pages/class/classHome?clazzId=${clazzId}&userid=${id}`
    };
  };
  render() {
    const { collectList } = this.state;
    return (
      <View className="collect-padding">
        {collectList.map(item => (
          <View className="collect-wrap" key={item.briefIntroduction}>
            <View className="content-wrap">
              <View className="left">
                <View className="title">{item.briefIntroduction}</View>
                <View className="content">{item.content}</View>
              </View>
              <View className="right">{/* <ShareBtn /> */}</View>
            </View>
            <View className="come-from">来自：{item.clazzName}</View>
          </View>
        ))}
      </View>
    );
  }
}

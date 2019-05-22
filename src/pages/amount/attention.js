import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import subImg from "../../assets/img/sub.jpg";
import "./attention.scss";
export default class Attention extends Component {
  render() {
    return (
      <View className="attention">
        <Image src={subImg} className="sub-img" />
        <View className="text-bottom">
          长按图片，扫描二维码，关注公众号。\n
          了解编程语言最新热点资讯，\n掌握雇主最新动态。
        </View>
      </View>
    );
  }
}

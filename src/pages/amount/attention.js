import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import subImg from "../../assets/img/sub.jpg";
import "./attention.scss";
const codeImg =
  "http://qiniu.ben286.top/HelloWorld%20Rank%E6%B6%88%E6%81%AF%E5%8A%A9%E6%89%8B%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BA%8C%E7%BB%B4%E7%A0%81.jpg";
export default class Attention extends Component {
  showImage = () => {
    Taro.previewImage({
      urls: [codeImg],
      current: codeImg
    });
  };
  render() {
    return (
      <View className="attention">
        <Image src={codeImg} className="sub-img" onClick={this.showImage} />
        <View className="text-bottom">
          点击预览图片，\n长按扫描二维码，\n关注公众号，\n
          了解编程语言最新热点资讯，\n掌握雇主最新动态。
        </View>
      </View>
    );
  }
}

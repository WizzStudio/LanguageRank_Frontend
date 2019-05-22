import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton } from "taro-ui";
import shareImg from "../../assets/img/share.png";
import "./shareBtn.scss";
export default class ShareBtn extends Component {
  render() {
    return (
      <View className="share-wrap">
        <button open-type="share">
          <Image className="share-img" src={shareImg} />
        </button>
      </View>
    );
  }
}

import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./authItem.scss";
import "taro-ui/dist/style/index.scss";
import up from "../../assets/icon/up.png";
import no from "../../assets/icon/no.png";
import down from "../../assets/icon/down.png";
import cmt from "../../assets/icon/cmt.png";
export default class AuthItem extends Component {
  render() {
    const { langImg, langName, heatNum, tend, index } = this.props;
    return (
      // <View className={["authItem", index % 2 ? "oddbg" : ""].join(" ")}>
      <View className="authItem">
        <View className="at-row">
          <View className="at-col at-col-2 rank-num">
            {parseInt(index) + 1}
          </View>
          <View className="at-col at-col-1 icon-wrap">
            <Image src={langImg} className="langImg" />
          </View>
          <View className="at-col at-col-3 lang-name">{langName}</View>
          <View className="at-col at-col-1" />
          <View className="at-col at-col-2 heat-num">{heatNum}</View>
          <View className="at-col at-col-1 tend-wrap">
            {tend === 0 && <Image src={no} className="tendlogo" />}
            {tend === 1 && <Image src={up} className="tendlogo" />}
            {tend === 2 && <Image src={down} className="tendlogo" />}
            {/* <Image src={cmt} className="tendlogo" /> */}
          </View>
          <View className="at-col at-col-2 tend-wrap">
            <Image src={cmt} className="tendlogo" />
          </View>
        </View>
      </View>
    );
  }
}

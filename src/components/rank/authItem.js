import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./authItem.scss";
import "taro-ui/dist/style/index.scss";
export default class AuthItem extends Component {
  render() {
    const { langImg, langName, heatNum, tend, index } = this.props;
    return (
      <View className={["authItem", index % 2 ? "oddbg" : ""].join(" ")}>
        {/* <View className={`at-row ${index % 2 === 1 ? oddbg : ""}`}> */}
        <View className="at-row">
          <View className="at-col at-col-2 rank-num">
            {parseInt(index) + 1}
          </View>
          <View className="at-col at-col-1 icon-wrap">
            <Image src={langImg} className="langImg" />
          </View>
          <View className="at-col at-col-3 lang-name">{langName}</View>
          <View className="at-col at-col-2" />
          <View className="at-col at-col-3 heat-num">{heatNum}</View>
          <View className="at-col at-col-1">{tend}</View>
        </View>
      </View>
    );
  }
}

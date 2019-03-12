import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./demandItem.scss";

export default class DemandItem extends Component {
  render() {
    const { lgImg, language, exponent, trend, index } = this.props;
    return (
      <View className="demandItem">
        <View className="at-row">
          <View className="at-col at-col-2">{index + 1}.</View>
          <View className="at-col at-col-2">
            <Image src={lgImg} className="langImg" />
          </View>
          <View className="at-col at-col-3">{language}</View>
          <View className="at-col at-col-3">{exponent}</View>
          <View className="at-col at-col-2">{trend}</View>
        </View>
      </View>
    );
  }
}

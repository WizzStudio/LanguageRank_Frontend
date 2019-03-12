import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import langInfo from "../../mock/langInfo.json";
import "./langDetail.scss";

export default class LangDetail extends Component {
  constructor() {
    super();
    this.state = {
      langInfo,
      langName: ""
    };
  }
  componentWillMount() {
    console.log("this", this);
    const { langName } = this.$router.params;
    this.setState({
      langName
    });
  }

  render() {
    const { langName } = this.state;
    const detailInfo = this.state.langInfo[langName];
    console.log("this.state", this.state);
    return (
      <View>
        <View>{langDetail.history}</View>
        <View className="at-row">
          <View className="at-col-3">图标</View>
          <View className="at-col-5">{langName}</View>
          <View className="at-col-4">始于{detailInfo.start}</View>
        </View>
        <View className="lang-title">语言发展历史</View>
        {/* <View>{detailInfo.history}</View> */}
        {detailInfo.history.map((item, index) => (
          <View key={index}>
            {item}
            <br />
          </View>
        ))}
        <View className="lang-title">{langName}可以用来做</View>
        <View className="at-row">
          {langName.usages.map((item, index) => (
            <View key={index}>{item}</View>
          ))}
        </View>

        <View>
          <View className="lang-title">{langName}的优缺点</View>
          <View>
            {detailInfo.advantages.map((item, index) => (
              <View key={index}>{item}</View>
            ))}
          </View>
          <View>
            {detailInfo.disadvantages.map((item, index) => (
              <View key={index}>{item}</View>
            ))}
          </View>
        </View>
        <View className="at-row">
          <View className="at-col-6">
            <View className="lang-title">{langName}的应用领域</View>
            {detailInfo.apps.map((item, index) => (
              <View key={index}>{item}</View>
            ))}
          </View>
          <View className="at-col-6">
            <View className="lang-title">顶级雇主</View>
            {detailInfo.employers.map((item, index) => (
              <View key={index}>{item}</View>
            ))}
          </View>
        </View>
      </View>
    );
  }
}

import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtDivider, AtRate, AtButton } from "taro-ui";
import langInfo from "../../mock/langInfo.json";
import "./langDetail.scss";

import javaLogo from "../../assets/img/language/java.png";

export default class LangDetail extends Component {
  constructor() {
    super();
    this.state = {
      langInfo,
      langName: ""
    };
  }
  componentWillMount() {
    const { langName } = this.$router.params;
    this.setState({
      langName
    });
  }
  componentDidMount() {}
  render() {
    const { langName } = this.state;
    const detailInfo = this.state.langInfo[langName];
    console.log("detailInfo", detailInfo);
    console.log("this.state", this.state);
    return (
      <View>
        <View className="wrap-content">
          <View className="lang-title">
            <View className="icon">
              <Image src={javaLogo} className="logo" />
            </View>
            <View className="name">
              <View>{langName}</View>
              <View>
                <AtRate value={detailInfo.complexity} />
              </View>
            </View>
            <View className="state">
              <View>1000人</View>
              <View>已加入学习计划</View>
            </View>
          </View>
        </View>
        <AtDivider />
        <View class="wrap-content">
          <View className="wrap-title">语言简史</View>
          <View className="history">{detailInfo.history.join("\n")}</View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">{langName}可以用来做</View>
          <View>移动开发。。。</View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">{langName}的优缺点</View>
          <View>移动开发。。。</View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">{langName}应用领域</View>
          <View>移动开发。。。</View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">{langName}的顶级雇主</View>
          <View>移动开发。。。</View>
        </View>
      </View>
    );
  }
}

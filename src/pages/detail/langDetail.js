import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtDivider, AtRate, AtIcon } from "taro-ui";
import langInfo from "../../mock/langInfo.json";
import "./langDetail.scss";

import javaLogo from "../../assets/img/language/java.png";
import ai from "../../assets/icon/ai.png";
import cloud from "../../assets/icon/cloud.png";
import AddPlan from "../../components/rank/addPlan";
export default class LangDetail extends Component {
  constructor() {
    super();
    this.state = {
      langInfo: {},
      langName: ""
    };
  }
  componentWillMount() {}
  componentDidMount() {
    const { langName } = this.$router.params;
    this.setState({
      langName
    });
  }
  render() {
    const { langName } = this.state;
    const detailInfo = this.state.langInfo[langName];
    console.log("detailInfo", detailInfo);
    console.log("this.state", this.state);
    return (
      <View className="lang-detail">
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
          <View className="history">简史</View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">{langName}可以用来做</View>
          <View className="app">
            <View className="wrap-item">
              <View className="wrap-img">
                <Image src={ai} className="img" />
              </View>
              <View className="little-title">人工智能</View>
            </View>
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">{langName}的优缺点</View>
          <View className="ad-disad">
            {detailInfo.advantages.map((item, index) => (
              <View key={index} className="row-wrap">
                <AtIcon value="check-circle" color="#65DF63" className="icon" />
                {item}
              </View>
            ))}
            {detailInfo.disadvantages.map((item, index) => (
              <View key={index} className="row-wrap">
                <AtIcon value="close-circle" color="#FF8080" className="icon" />
                {item}
              </View>
            ))}
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">{langName}应用领域</View>
          <View className="app">
            <View className="wrap-item">
              <View className="wrap-img">
                <Image src={ai} className="img" />
              </View>
              <View className="little-title">人工智能</View>
            </View>

            <View className="wrap-item">
              <View className="wrap-img">
                <Image src={ai} className="img" />
              </View>
              <View className="little-title">人工智能</View>
            </View>
          </View>
        </View>
        <AtDivider />
        <View className="wrap-content">
          <View className="wrap-title">{langName}的顶级雇主</View>
          <View>移动开发。。。</View>
        </View>
        <AddPlan langName={langName} />
      </View>
    );
  }
}

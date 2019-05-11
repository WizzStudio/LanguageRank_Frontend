import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./classIndex.scss";
import testImg from "../../assets/img/canvasAuth.png";

export default class ClassIndex extends Component {
  config = {
    navigationBarTitleText: "猿圈"
  };
  constructor() {
    super();
  }
  componentWillMount() {}
  toClassList = () => {
    Taro.navigateTo({
      url: "/pages/class/classList"
    });
  };
  toClassHome = () => {
    Taro.navigateTo({
      url: "/pages/class/classHome"
    });
  };
  render() {
    return (
      <View>
        <View className="blank" />
        <View className="my-award">
          <View className="award-wrap">
            <View className="per-award" onClick={this.toClassHome}>
              <View className="award-content">
                <Image src={testImg} className="award-img" />
              </View>
              <View className="award-name">班级介绍</View>
            </View>
            <View className="per-award">
              <View className="award-content">
                <Image src={testImg} className="award-img" />
              </View>
              <View className="award-name">班级介绍</View>
            </View>
          </View>
        </View>
        <View className="award-wrap">
          <View className="per-award">
            <View
              className="add-award-content award-img"
              onClick={this.toClassList}>
              <View>+</View>
              <View>加入项目</View>
            </View>
          </View>
        </View>
        <View className="blank" />
      </View>
    );
  }
}

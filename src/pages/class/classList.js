import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton } from "taro-ui";
import "./classList.scss";

export default class ClassList extends Component {
  config = {
    navigationBarTitleText: "圈内项目"
  };
  constructor() {
    super();
  }
  componentWillMount() {}

  render() {
    return (
      <View>
        <View className="per-class">
          <View className="title">Java七天入门</View>
          <View className="person-num">99人</View>
          <View className="add-btn">
            <AtButton type="primary" size="small">
              加入
            </AtButton>
          </View>
        </View>
        <View className="per-class">
          <View className="title">Java七天入门</View>
          <View className="person-num">99人</View>
          <View className="add-btn">
            <AtButton type="primary" size="small">
              加入
            </AtButton>
          </View>
        </View>
      </View>
    );
  }
}

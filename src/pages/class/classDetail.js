import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import myApi from "../../service/api";
import "./classDetail.scss";
export default class ClassDetail extends Component {
  config = {
    navigationBarTitleText: "课程详情"
  };
  constructor() {
    super();
    this.state = {
      classPlan: {}
    };
  }
  componentDidMount() {
    this.getClassPlan();
  }
  getClassPlan() {
    const { clazzId } = this.$router.params;
    const data = {
      clazzId
    };
    myApi("/getclazzstudyplan", "POST", data).then(res => {
      if (res.code === 0) {
        console.log("res.data", res.data);
        this.setState({
          classPlan: res.data
        });
      }
    });
  }
  render() {
    const { classPlan } = this.state;
    return (
      <View className="classDetail">
        <View className="title">课程简介</View>
        <View className="content">{classPlan.clazzBriefIntroduction}</View>
        {classPlan.studyPlanBriefIntroductionList.map((item, index) => (
          <View key={item}>
            <View className="title">第{index + 1}天</View>
            <View className="content">{item}</View>
          </View>
        ))}
      </View>
    );
  }
}

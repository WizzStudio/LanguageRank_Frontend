import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./classDetail.scss";
export default class ClassDetail extends Component {
  config = {
    navigationBarTitleText: "课程详情"
  };
  constructor() {
    super();
    this.state = {
      classPlan: []
    };
  }
  componentDidMount() {
    this.getClassPlan();
  }
  getClassPlan() {
    const { clazzId } = this.$router.params;
    Taro.request({
      url: "https://pgrk.wizzstudio.com/getclazzstudyplan",
      method: "POST",
      data: {
        clazzId
      }
    }).then(response => {
      const res = response.data;
      if (res.code === 0) {
        this.setState({
          classPlan: res.data
        });
      }
    });
  }
  render() {
    const { classPlan = [] } = this.state;
    return (
      <View className="classDetail">
        {/* <View className="top-title">课程详情</View> */}
        {classPlan.map((item, index) => (
          <View key={item}>
            <View className="title">第{index + 1}天</View>
            <View className="content">{item}</View>
          </View>
        ))}
      </View>
    );
  }
}

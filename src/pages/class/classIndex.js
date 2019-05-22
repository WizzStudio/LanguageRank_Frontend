import Taro, { Component } from "@tarojs/taro";
import { View, Picker } from "@tarojs/components";
import "./classIndex.scss";
import testImg from "../../assets/img/canvasAuth.png";
import { AtMessage } from "taro-ui";
import { connect } from "@tarojs/redux";
import { ajaxGetUserClass } from "../../actions/classInfo";
import { getLoginInfo } from "../../utils/getlocalInfo";
import myApi from "../../service/api";
const myUserId = getLoginInfo().userId;
@connect(
  ({ classInfo }) => ({
    classInfo
  }),
  dispatch => ({
    ajaxGetUserClass(userId) {
      return dispatch(ajaxGetUserClass(userId));
    }
  })
)
export default class ClassIndex extends Component {
  config = {
    navigationBarTitleText: "猿圈"
  };
  constructor() {
    super();
    this.state = {
      timeSel: ""
    };
  }
  componentDidMount() {
    const data = {
      userId: myUserId
    };
    this.props.ajaxGetUserClass(data).then(res => {});
  }
  toClassList = () => {
    Taro.navigateTo({
      url: "/pages/class/classList"
    });
  };
  toClassHome = clazzId => {
    Taro.navigateTo({
      url: `/pages/class/classHome?clazzId=${clazzId}`
    });
  };
  onTimeChange = e => {
    console.log("ePICK", e);
    let res = JSON.parse(e.detail.value);
    let timeSel = res === 0 ? res : res + 7;
    this.setState({
      timeSel
    });
    let data = {
      userId: myUserId,
      reminderTime: timeSel
    };
    myApi("/updatepunchcardremindertime", "POST", data).then(res => {
      if (res.code === 0) {
        Taro.atMessage({
          message: "修改成功",
          type: "success"
        });
      }
    });
  };
  render() {
    const { userClass } = this.props.classInfo || [];
    const { timeSel } = this.state;
    const timeSelArr = ["不提醒", "8点", "9点", "10点", "11点"];
    return (
      <View>
        <AtMessage />
        <View className="my-form">
          <View>当前提醒时间：{timeSel ? timeSel + "点" : "不提醒"}</View>
          <Picker
            mode="selector"
            range={timeSelArr}
            onChange={this.onTimeChange}>
            <View className="picker">修改</View>
          </Picker>
        </View>
        <View className="blank" />
        <View className="my-award">
          <View className="award-wrap">
            {userClass.map((item, index) => (
              <View
                key={item.clazzName}
                className="per-award"
                onClick={this.toClassHome.bind(this, item.clazzId)}>
                <View className="award-content">
                  <Image src={item.clazzImage} className="award-img" />
                  <View className="monitor-name">
                    班长：{item.monitorNickName}
                  </View>
                </View>
                <View className="award-name">{item.clazzName}</View>
              </View>
            ))}
            <View className="per-award">
              <View
                className="add-award-content award-img"
                onClick={this.toClassList}>
                <View className="add">+</View>
                <View>加入班级</View>
              </View>
            </View>
          </View>
        </View>

        <View className="blank" />
      </View>
    );
  }
}

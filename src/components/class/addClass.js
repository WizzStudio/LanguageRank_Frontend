import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtMessage } from "taro-ui";
import { connect } from "@tarojs/redux";
import { ajaxJoinClass } from "../../actions/classInfo";
import { getLoginInfo } from "../../utils/getlocalInfo";
@connect(
  classInfo => ({
    classInfo
  }),
  dispatch => ({
    ajaxJoinClass(data) {
      return dispatch(ajaxJoinClass(data));
    }
  })
)
export default class AddClass extends Component {
  userAddClass = () => {
    const clazzId = this.props.clazzId;
    const userId = getLoginInfo().userId || "";
    if (userId) {
      let data = {
        userId,
        clazzId
      };
      console.log("data", data);
      this.props.ajaxJoinClass(data).then(res => {
        console.log("res", res);
        if (res.code === 0) {
          Taro.showToast({
            title: "加入成功",
            icon: "success"
          });
        } else if (res.code === 5) {
          // Taro.showToast({
          //   title: "你已经在该班级中了",
          //   icon: "fail"
          // });
          Taro.atMessage({
            message: "你已经在该班级中了",
            type: "error"
          });
        } else {
          Taro.showToast({
            title: "加入失败",
            icon: "fail"
          });
        }
      });
    }
  };
  render() {
    return (
      <View>
        <AtMessage />
        <AtButton type="primary" size="small" onClick={this.userAddClass}>
          加入
        </AtButton>
      </View>
    );
  }
}

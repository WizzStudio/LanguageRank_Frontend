import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtMessage } from "taro-ui";
import { connect } from "@tarojs/redux";
import { ajaxJoinClass, ajaxGetUserClass } from "../../actions/classInfo";
import { getLoginInfo } from "../../utils/getlocalInfo";
@connect(
  classInfo => ({
    classInfo
  }),
  dispatch => ({
    ajaxJoinClass(data) {
      return dispatch(ajaxJoinClass(data));
    },
    ajaxGetUserClass(data) {
      return dispatch(ajaxGetUserClass(data));
    }
  })
)
class JoinClass extends Component {
  userAddClass = () => {
    const clazzId = this.props.clazzId;
    const userId = getLoginInfo().userId || "";
    if (userId) {
      let data = {
        userId,
        clazzId
      };
      this.props.ajaxJoinClass(data).then(res => {
        if (res.code === 0) {
          Taro.atMessage({
            message: "加入成功",
            type: "success"
          });
          //打卡成功后更新store中的用户班级 触发classHome中的检测到更新。
          this.props.ajaxGetUserClass({ userId }).then(res => {
            if (res.code === 0 && this.props.type === "classList") {
              Taro.navigateTo({
                url: `/pages/class/classHome?clazzId=${clazzId}`
              });
            }
          });
        } else if (res.code === 5) {
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
JoinClass.defaultProps = {
  clazzId: 0,
  type: "",
  onChangeAdd: () => {}
};

import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { getLoginInfo } from "../../utils/getlocalInfo";
export default class QuitClass extends Component {
  userQuitClass = () => {
    const clazzId = this.props.clazzId;
    const userId = getLoginInfo().userId || "";
    if (userId) {
      let data = {
        userId,
        clazzId
      };
      console.log("data", data);
      Taro.request({
        url: "https://pgrk.wizzstudio.com/quitclazz",
        method: "POST",
        data
      }).then(response => {
        const res = response.data;
        if (res.code === 0) {
          Taro.showToast({
            title: "退出成功"
          });
        }
      });
    }
  };
  render() {
    return (
      <View>
        <AtButton type="secondary" size="small" onClick={this.userQuitClass}>
          退出
        </AtButton>
      </View>
    );
  }
}

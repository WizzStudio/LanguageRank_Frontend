import Taro, { Component } from "@tarojs/taro";

import { AtNoticebar, AtIcon } from "taro-ui";
import { View } from "@tarojs/components";
import "./notice.scss";

export default class Notice extends Component {
  closeNotice = () => {
    let loginInfo = {};
    if (Taro.getStorageSync("login")) {
      loginInfo = Taro.getStorageSync("login");
      Taro.request({
        url: "https://pgrk.wizzstudio.com/updateisviewedjoinmyapplet",
        method: "POST",
        data: {
          userId: loginInfo.userid
        }
      }).then(res => {
        console.log("res", res);
      });
    }
  };
  render() {
    return (
      <View>
        {/* <View> */}
        {/* <AtIcon value="chevron-up" size="40" color="#F00" /> */}
        {/* </View> */}
        <View className="top" />
        <AtNoticebar onClose={this.closeNotice} close={true}>
          添加到我的小程序，快捷了解榜单最新动态
        </AtNoticebar>
      </View>
    );
  }
}

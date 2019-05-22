import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton } from "taro-ui";
import "./login.scss";
import { addUserRelation } from "../../utils/addUserRelation";
import loginImg from "../../assets/img/login.png";
export default class Login extends Component {
  bindGetUserInfo = e => {
    if (e.detail.userInfo) {
      Taro.setStorageSync("basicInfo", {
        nickName: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl
      });
      Taro.getSetting()
        .then(res => {
          if (res.authSetting["scope.userInfo"]) {
            Taro.getUserInfo().then(userInfoRes => {
              this.handleLogin(userInfoRes.iv, userInfoRes.encryptedData);
            });
          }
        })
        .catch(() => {
          Taro.showToast({
            title: "登陆失败，请重试",
            icon: "fail"
          });
        });
    }
  };
  handleLogin = (iv, encryptedData) => {
    Taro.login().then(res => {
      if (res.code) {
        Taro.request({
          url: "https://pgrk.wizzstudio.com/login",
          method: "POST",
          data: {
            code: res.code,
            iv,
            encryptedData
          }
        }).then(loginRes => {
          console.log("loginRes", loginRes);
          if (loginRes.data.code === 0) {
            const data = loginRes.data.data;
            Taro.setStorageSync("login", {
              userId: data.userId,
              openId: data.openId,
              session_key: data.session_key
            });
            addUserRelation(this, data.userId);
            Taro.navigateBack();
          }
        });
      }
    });
  };
  render() {
    return (
      <View className="login-wrap">
        {/* <Image className="login-img" src={loginImg} /> */}
        <View className="btn-wrap">
          <AtButton
            openType="getUserInfo"
            onGetUserInfo={this.bindGetUserInfo}
            type="primary">
            授权登陆
          </AtButton>
        </View>
      </View>
    );
  }
}

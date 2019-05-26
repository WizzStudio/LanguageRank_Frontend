import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton } from "taro-ui";
import myApi from "../../service/api";
import logo from "../../assets/img/logo.png";
import "./login.scss";
import { addUserRelation } from "../../utils/addUserRelation";
export default class Login extends Component {
  config = {
    navigationBarTitleText: "HelloWorld Rank"
  };
  bindGetUserInfo = e => {
    Taro.showLoading({
      title: "正在登录..."
    });
    if (e.detail.userInfo) {
      Taro.setStorageSync("basicInfo", {
        nickName: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl
      });
      Taro.login().then(res => {
        console.log("调用taroLogin返回", res);
        if (res.code) {
          const userCode = res.code;
          Taro.getUserInfo()
            .then(userInfoRes => {
              const data = {
                code: userCode,
                iv: userInfoRes.iv,
                encryptedData: userInfoRes.encryptedData
              };
              console.log("发给后端login的data", data);
              myApi("/login", "POST", data).then(loginRes => {
                console.log("后端返回的res", loginRes);
                if (loginRes.code === 0) {
                  Taro.setStorageSync("login", {
                    userId: loginRes.data.userId,
                    openId: loginRes.data.openId,
                    session_key: loginRes.data.session_key
                  });
                  Taro.setStorageSync("version", {
                    ver: "2.0"
                  });
                  const shareId = this.$router.params.shareId || 0;
                  console.log("login页面即将去addUSer的shareId", shareId);
                  if (shareId) {
                    addUserRelation(shareId, loginRes.data.userId);
                  }
                  Taro.hideLoading();
                  Taro.switchTab({
                    url: "/pages/index/index"
                  });
                } else {
                  Taro.hideLoading();
                  Taro.showToast({
                    title: "登录失败，请查看网络环境",
                    icon: "none"
                  });
                }
              });
            })
            .catch(e => {
              console.log("调用getUserInfo失败的返回", e);
            });
        } else {
          Taro.hideLoading();
          Taro.showToast({
            title: "登录失败，请检查网络环境",
            icon: "none"
          });
        }
      });
    } else {
      Taro.hideLoading();
      Taro.showToast({
        title: "你已拒绝授权,将无法正常使用小程序",
        icon: "none"
      });
      Taro.openSetting().then(res => {
        console.log("res", res);
      });
    }
  };
  render() {
    return (
      <View className="login-wrap">
        <View className="logo-wrap">
          <Image src={logo} className="logo" />
        </View>
        <View className="title-one">来HelloWorld Rank</View>
        <View className="title-one">了解最酷的编程语言</View>
        <View className="title-two">语言排行&组团学习</View>
        <View className="btn-wrap">
          <AtButton
            openType="getUserInfo"
            onGetUserInfo={this.bindGetUserInfo}
            type="primary">
            授权登录
          </AtButton>
        </View>
      </View>
    );
  }
}

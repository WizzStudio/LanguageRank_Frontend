import Taro from "@tarojs/taro";
import myApi from "../service/api";
import { addUserRelation } from "./addUserRelation";
const againLogin = shareId => {
  console.log("开始againLogin收到的shareId", shareId);
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
              console.log("即将要建立关系的shareId", shareId);
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
          Taro.redirectTo({
            url: `/pages/login/login?shareId=${shareId}`
          });
        });
    } else {
      Taro.hideLoading();
      Taro.showToast({
        title: "登录失败，请检查网络环境",
        icon: "none"
      });
    }
  });
};
export default function checkToLogin(shareId = 0) {
  Taro.showLoading({
    title: "loading...",
    icon: "loading"
  });
  const version = Taro.getStorageSync("version") || null;
  if (!version) {
    console.log("!version的情况", version);
    Taro.hideLoading();
    Taro.redirectTo({
      url: `/pages/login/login?shareId=${shareId}`
    });
  } else if (version.ver !== "2.0") {
    console.log("version!=2的情况", version);
    Taro.hideLoading();
    Taro.redirectTo({
      url: `/pages/login/login?shareId=${shareId}`
    });
  } else {
    Taro.checkSession({
      success: function() {
        const basicInfo = Taro.getStorageSync("basicInfo") || null;
        const loginInfo = Taro.getStorageSync("login") || null;
        if (!basicInfo || !loginInfo) {
          console.log(
            "登陆态进入 无basic或login",
            basicInfo,
            loginInfo,
            shareId
          );
          Taro.hideLoading();
          Taro.navigateTo({
            url: `/pages/login/login?shareId=${shareId}`
          });
        } else {
          console.log(
            "登陆态进入 有basic和login",
            basicInfo,
            loginInfo,
            shareId
          );
          Taro.hideLoading();
          console.log("进入登陆态后将传的shareId", shareId);
          if (shareId) {
            const userId = Taro.getStorageSync("login").userId;
            console.log("进入登陆态后将传的shareI", userId);
            addUserRelation(shareId, userId);
          }
        }
      },
      fail: function() {
        console.log("登陆态失效");
        console.log("传给againLogin的shareId", shareId);
        againLogin(shareId);
      }
    });
  }
}

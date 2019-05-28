import Taro from "@tarojs/taro";
import myApi from "../service/api";
import { addUserRelation } from "./addUserRelation";
const againLogin = shareId => {
  Taro.login().then(res => {
    if (res.code) {
      const userCode = res.code;
      Taro.getUserInfo()
        .then(userInfoRes => {
          const data = {
            code: userCode,
            iv: userInfoRes.iv,
            encryptedData: userInfoRes.encryptedData
          };
          myApi("/login", "POST", data).then(loginRes => {
            if (loginRes.code === 0) {
              Taro.setStorageSync("login", {
                userId: loginRes.data.userId,
                openId: loginRes.data.openId,
                session_key: loginRes.data.session_key
              });
              Taro.setStorageSync("version", {
                ver: "2.0"
              });
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
    Taro.hideLoading();
    Taro.redirectTo({
      url: `/pages/login/login?shareId=${shareId}`
    });
  } else if (version.ver !== "2.1") {
    //手动在缓存中维护一个版本号，解决小程序的版本缓存问题
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
          Taro.hideLoading();
          Taro.navigateTo({
            url: `/pages/login/login?shareId=${shareId}`
          });
        } else {
          Taro.hideLoading();
          if (shareId) {
            const userId = Taro.getStorageSync("login").userId;
            addUserRelation(shareId, userId);
          }
        }
      },
      fail: function() {
        againLogin(shareId);
      }
    });
  }
}

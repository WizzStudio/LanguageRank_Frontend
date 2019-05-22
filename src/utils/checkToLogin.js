import Taro from "@tarojs/taro";
export default function checkToLogin() {
  if (!Taro.getStorageSync("basicInfo")) {
    Taro.navigateTo({
      url: "/pages/login/login"
    });
  }
}

import Taro from "@tarojs/taro";
export function getLoginInfo() {
  if (!Taro.getStorageSync("login")) {
    Taro.redirectTo({
      url: "/pages/login/login"
    });
    return "";
  } else {
    const loginInfo = Taro.getStorageSync("login");
    return loginInfo;
  }
}

export function getBasicInfo() {
  if (!Taro.getStorageSync("basicInfo")) {
    Taro.redirectTo({
      url: "/pages/login/login"
    });
    return "";
  } else {
    const basicInfo = Taro.getStorageSync("basicInfo");
    return basicInfo;
  }
}

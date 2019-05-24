import Taro from "@tarojs/taro";
export default function checkToLogin() {
  const version = Taro.getStorageSync("version") || {};
  if (!version) {
    Taro.redirectTo({
      url: "/pages/login/login"
    });
    return true;
  } else if (version.ver !== "2.0") {
    Taro.redirectTo({
      url: "/pages/login/login"
    });
    return true;
  } else {
    Taro.checkSession()
      .then(() => {
        if (
          !Taro.getStorageSync("basicInfo") ||
          !Taro.getStorageSync("login")
        ) {
          Taro.navigateTo({
            url: "/pages/login/login"
          });
          return true;
        }
      })
      .catch(() => {
        Taro.redirectTo({
          url: "/pages/login/login"
        });
        return true;
      });
  }
  return false;
}

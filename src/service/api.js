import Taro from "@tarojs/taro";
// import { HOST } from "./config";
const HOST = "https://pgrk.wizzstudio.com";

export default async function myApi(url, method = "GET", data = {}) {
  Taro.showLoading({
    title: "loading..."
  });
  try {
    const response = await Taro.request({
      url: HOST + url,
      method,
      data
    });
    Taro.hideLoading();
    const res = response.data;
    return res;
  } catch (e) {
    Taro.hideLoading();
    Taro.showToast({
      title: "加载失败"
    });
  }
}

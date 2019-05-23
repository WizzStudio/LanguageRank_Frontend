import Taro from "@tarojs/taro";
export default function copyContent(content) {
  Taro.setClipboardData({
    data: content
  })
    .then(() => {
      Taro.showToast({
        title: "复制成功"
      });
    })
    .catch(() => {
      Taro.showToast({
        title: "复制失败"
      });
    });
}

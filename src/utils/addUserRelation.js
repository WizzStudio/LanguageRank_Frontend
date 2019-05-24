import Taro from "@tarojs/taro";
import myApi from "../service/api";
export function addUserRelation(that, ownId) {
  console.log("that", that.$router);
  const params = that.$router.params;
  if (params && params.shareId) {
    const userOne = params.shareId;
    const userTwo = ownId || Taro.getStorageSync("login").userId;
    const data = {
      userOne,
      userTwo
    };
    myApi("/updateuserrelationship", "POST", data).then(res => {
      if (res.code === 0) {
        console.log("添加成功");
      }
    });
  }
}

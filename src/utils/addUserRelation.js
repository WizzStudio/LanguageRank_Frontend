import Taro from "@tarojs/taro";
import myApi from "../service/api";
export function addUserRelation(userOne, userTwo) {
  console.log("进入addUser收到的两个user", userOne, userTwo);
  if (userOne != 0 && userTwo != 0) {
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

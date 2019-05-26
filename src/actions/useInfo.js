import Taro from "@tarojs/taro";
import {
  GET_USER_FAIL,
  GET_USER_AWARD,
  GET_USER_SCORE
} from "../constants/userInfo";
import fetchData from "../service/createAction";

export const getUserFail = data => {
  return {
    type: GET_USER_FAIL,
    payload: data
  };
};

//获取用户全部信息-积分
export const ajaxGetUserScore = data => {
  const option = {
    url: "/userinfo",
    method: "POST",
    data
  };
  return fetchData(option, GET_USER_SCORE);
};

//获取个人奖励
export const ajaxGetUserAward = userId => {
  const option = {
    url: "/myaward",
    method: "POST",
    data: {
      userId
    }
  };
  return fetchData(option, GET_USER_AWARD);
};

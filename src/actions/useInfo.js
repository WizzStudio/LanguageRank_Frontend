import Taro from "@tarojs/taro";
import {
  GET_USER_FAIL,
  GET_USER_ALLINFO,
  GET_USER_PLAN
} from "../constants/userInfo";

export const getUserFail = data => {
  return {
    type: GET_USER_FAIL,
    payload: data
  };
};

//获取用户全部信息
export const getUserAllInfo = data => {
  return {
    type: GET_USER_ALLINFO,
    payload: data
  };
};
export const ajaxGetUserAllInfo = userId => {
  return async dispatch => {
    const response = await Taro.request({
      url: "http://pgrk.wizzstudio.com/userinfo",
      method: "POST",
      data: {
        userId: userId
      }
    });
    const res = response.data;
    console.log("res", res);
    if (res.code === 0) {
      dispatch(getUserAllInfo(res.data));
    } else {
      dispatch(getUserFail(res.msg));
    }
  };
};

//获取用户七日计划
export const getUserPlan = data => {
  return {
    type: GET_USER_PLAN,
    payload: data
  };
};
export const ajaxGetUserPlan = userId => {
  return async dispatch => {
    const response = await Taro.request({
      url: "http://pgrk.wizzstudio.com/studyplan",
      method: "POST",
      data: {
        userId: userId
      }
    });
    const res = response.data;
    console.log("res", res);
    if (res.code === 0) {
      dispatch(getUserPlan(res.data));
    } else {
      dispatch(getUserFail(res.msg));
    }
  };
};

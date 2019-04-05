import Taro from "@tarojs/taro";
import {
  GET_USER_FAIL,
  GET_USER_ALLINFO,
  GET_USER_PLAN,
  ADD_USER_PLAN,
  GET_USER_AWARD
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
      url: "https://pgrk.wizzstudio.com/userinfo",
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
      url: "https://pgrk.wizzstudio.com/studyplan",
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

//添加学习计划
export const addUserPlan = data => {
  return {
    type: ADD_USER_PLAN,
    payload: data
  };
};
export const ajaxAddUserPlan = (lang, id) => {
  return async dispatch => {
    const response = await Taro.request({
      url: "https://pgrk.wizzstudio.com/updatelanguage",
      method: "POST",
      data: {
        languageName: lang,
        userId: id
      }
    });
    const res = response.data;
    console.log("学习计划返回的数据", res);
    if (res.code === 0) {
      dispatch(addUserPlan(res.code));
    } else {
      dispatch(getUserFail(res.msg));
    }
  };
};

//获取个人奖励
export const getUserAward = data => {
  return {
    type: GET_USER_AWARD,
    payload: data
  };
};
export const ajaxGetUserAward = id => {
  return async dispatch => {
    const response = await Taro.request({
      url: "https://pgrk.wizzstudio.com/myaward",
      method: "POST",
      data: {
        userId: id
      }
    });
    const res = response.data;
    console.log("个人奖励", res);
    if (res.code === 0) {
      dispatch(getUserAward(res.data));
    } else {
      dispatch(getUserFail(res.msg));
    }
  };
};

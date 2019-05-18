import Taro from "@tarojs/taro";
import {
  GET_USER_FAIL,
  GET_USER_ALLINFO,
  GET_USER_PLAN,
  ADD_USER_PLAN,
  GET_USER_AWARD
} from "../constants/userInfo";
import fetchData from "../service/createAction";

export const getUserFail = data => {
  return {
    type: GET_USER_FAIL,
    payload: data
  };
};

//获取用户全部信息
export const ajaxGetUserAllInfo = userId => {
  const option = {
    url: "/userinfo",
    method: "POST",
    data: {
      userId: userId
    }
  };
  return fetchData(option, GET_USER_ALLINFO);
};

//获取用户七日计划
export const ajaxGetUserPlan = userId => {
  const option = {
    url: "/studyplan",
    method: "POST",
    data: {
      userId: userId
    }
  };
  return fetchData(option, GET_USER_PLAN);
};

//添加学习计划
export const addUserPlan = data => {
  return {
    type: ADD_USER_PLAN,
    payload: data
  };
};
export const ajaxAddUserPlan = (lang, id) => {
  if (lang === "C#") {
    lang = "C%23";
  }
  return async dispatch => {
    Taro.showLoading({
      title: "加载中..."
    });
    const response = await Taro.request({
      url: "https://pgrk.wizzstudio.com/updatelanguage",
      method: "POST",
      data: {
        languageName: lang,
        userId: id
      }
    });
    Taro.hideLoading();
    const res = response.data;
    if (res.code === 0) {
      dispatch(addUserPlan(res.code));
    } else {
      dispatch(getUserFail(res.msg));
    }
    return res;
  };
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

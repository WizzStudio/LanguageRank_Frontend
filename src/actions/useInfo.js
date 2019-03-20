import Taro from "@tarojs/taro";
import { GET_USERINFO_SUCCESS, GET_USERINFO_FAIL } from "../constants/userInfo";
export const getUserInfoSuccess = data => {
  return {
    type: GET_USERINFO_SUCCESS,
    data: data
  };
};

export const getUserInfoFail = data => {
  return {
    type: GET_USERINFO_FAIL,
    data: data
  };
};

export const asyncGetUserInfo = () => {
  return async dispatch => {
    const response = await Taro.request({
      url: "http://gametgt.wizzstudio.com/manage/userlist"
    });

    const res = response.data;
    console.log("res", res);
    if (res.code === 0) {
      dispatch(getUserInfoSuccess(res.data));
    } else {
      dispatch(getUserInfoFail(res.msg));
    }
  };
};

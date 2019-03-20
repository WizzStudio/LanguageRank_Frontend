import Taro from "@tarojs/taro";
import { GET_USER_SUCCESS } from "../constants/userlist";
export const getUserSuccess = data => {
  return {
    type: GET_USER_SUCCESS,
    data: data
  };
};

export const asyncGetUser = () => {
  return async dispatch => {
    const response = await Taro.request({
      url: "http://gametgt.wizzstudio.com/manage/userlist"
    });

    const data = response.data;
    console.log("data", data);
    dispatch(getUserSuccess(data));
  };
};

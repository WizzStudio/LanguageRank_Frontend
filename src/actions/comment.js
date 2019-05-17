import Taro from "@tarojs/taro";
import {
  GET_AUTH_CMT,
  GET_DEMAND_CMT,
  GET_CLASS_CMT
} from "../constants/comment";
import fetchData from "../service/createAction";
import { getLoginInfo } from "../utils/getlocalInfo";
const userId = getLoginInfo().userId || "";

//权威榜评论
export const getAuthCmt = data => {
  const option = {
    url: "/getemployeerankcomment",
    method: "POST",
    data
  };
  return fetchData(option, GET_AUTH_CMT);
};
//需求榜评论
export const getDemandCmt = data => {
  const option = {
    url: "/getfixedrankcomment",
    method: "POST",
    data
  };
  return fetchData(option, GET_DEMAND_CMT);
};
export const getClassCmt = data => {
  const option = {};
  return fetchData(option, GET_CLASS_CMT);
};

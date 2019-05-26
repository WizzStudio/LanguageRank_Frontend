import Taro from "@tarojs/taro";
import {
  GET_USER_CLASS,
  GET_ALL_CLASS,
  JOIN_CLASS,
  GET_USER_CLASS_PLAN,
  GET_CLASS_CMT,
  GET_CLASS_FAIL,
  GET_CLASS_MSG
} from "../constants/classInfo";
import fetchData from "../service/createAction";
import { getLoginInfo } from "../utils/getlocalInfo";

//处理错误情况
export const getClassFail = data => {
  return {
    type: GET_CLASS_FAIL,
    payload: data
  };
};

//获取用户已加入班级列表
export const ajaxGetUserClass = data => {
  const option = {
    url: "/getuserclazzlist",
    method: "POST",
    data
  };
  return fetchData(option, GET_USER_CLASS);
};

//获取全部班级列表
export const ajaxGetAllClass = data => {
  const option = {
    url: "/getclazzlist",
    method: "GET",
    data
  };
  return fetchData(option, GET_ALL_CLASS);
};

//加入班级
export const ajaxJoinClass = data => {
  const option = {
    url: "/joinclazz",
    method: "POST",
    data
  };
  return fetchData(option, JOIN_CLASS);
};

//获取用户班级学习计划
export const ajaxGetUserClassPlan = data => {
  const option = {
    url: "/getuserclazzstudyplan",
    method: "POST",
    data
  };
  return fetchData(option, GET_USER_CLASS_PLAN);
};

//获取班级评论
export const ajaxGetClassCmt = data => {
  const option = {
    url: "/getclazzcomment",
    method: "POST",
    data
  };
  return fetchData(option, GET_CLASS_CMT);
};

//查看班级基本信息
export const getClassMsg = data => {
  const userId = getLoginInfo().userId || "";
  const option = {
    url: "/getclazzmessage",
    method: "POST",
    data: {
      userId,
      clazzId: data.clazzId
    }
  };
  return fetchData(option, GET_CLASS_MSG);
};

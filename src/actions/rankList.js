import {
  GET_AUTH_RANK,
  GET_DEMAND_RANK,
  GET_LANGHOME_SUCCESS,
  GET_POSI
} from "../constants/rank";
import authRank from "../mock/authRank.json";
import demandRank from "../mock/demandRank.json";
const authData = authRank.data;
const demandData = demandRank.data;

//请求失败的action
export const getRankFail = data => {
  return {
    type: GET_RANK_FAIL,
    payload: data
  };
};

//同步---请求权威和需求榜单
export const getAuth = () => {
  return {
    type: GET_AUTH_RANK,
    payload: authData
  };
};

export const getDemand = () => {
  return {
    type: GET_DEMAND_RANK,
    payload: demandData
  };
};
//异步---请求权威和需求榜单
export const ajaxGetAuth = () => {
  return async dispatch => {
    const response = await Taro.request({
      url: ""
    });
    const res = response.data;
    if (res.code === 0) {
      dispatch(getAuth(res.data));
    } else {
      //TODO  存疑  具体需要看后端返回字段。
      dispatch(getRankFail(res.msg));
    }
  };
};
export const ajaxGetDemand = () => {
  return async dispatch => {
    const response = await Taro.request({
      url: ""
    });
    const res = response.data;
    if (res.code === 0) {
      dispatch(getDemand(res.data));
    } else {
      //TODO  存疑  具体需要看后端返回字段。
      dispatch(getRankFail(res.msg));
    }
  };
};

//同步---请求语言主页
export const getLangHome = data => {
  return {
    type: GET_LANGHOME_SUCCESS,
    payload: data
  };
};
//异步---请求语言主页
export const ajaxGetLangHome = () => {
  return async dispatch => {
    const response = await Taro.request({
      url: ""
    });
    const res = response.data;
    if (res.code === 0) {
      dispatch(getLangHome(res.data));
    } else {
      dispatch(getRankFail(res.msg));
    }
  };
};

//同步---请求热门岗位
export const getPosi = data => {
  return {
    type: GET_POSI,
    payload: data
  };
};
//异步---请求热门岗位
export const ajaxGetPosi = () => {
  return async dispatch => {
    const response = await Taro.request({
      url: ""
    });
    const res = response.data;
    if (res.code === 0) {
      dispatch(getPosi(res.data));
    } else {
      dispatch(getRankFail(res.msg));
    }
  };
};

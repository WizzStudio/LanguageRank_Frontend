import Taro from "@tarojs/taro";
import {
  GET_AUTH_RANK,
  GET_DEMAND_RANK,
  GET_LANGHOME,
  GET_POSI,
  GET_SALARY,
  GET_DEMANDPOSI,
  GET_CITY,
  GET_RANK_FAIL,
  GET_LANG_MORE
} from "../constants/rank";

//请求失败的action
export const getRankFail = data => {
  return {
    type: GET_RANK_FAIL,
    payload: data
  };
};

//同步---请求权威和需求榜单
export const getAuth = data => {
  return {
    type: GET_AUTH_RANK,
    payload: data
  };
};

export const getDemand = data => {
  return {
    type: GET_DEMAND_RANK,
    payload: data
  };
};
//异步---请求权威和需求榜单
export const ajaxGetAuth = () => {
  return async dispatch => {
    const response = await Taro.request({
      url: "https://pgrk.wizzstudio.com/languagerank"
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
      url: "https://pgrk.wizzstudio.com/employerdemandrank"
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

//请求语言主页
export const getLangHome = data => {
  return {
    type: GET_LANGHOME,
    payload: data
  };
};
export const ajaxGetLangHome = langName => {
  return async dispatch => {
    const response = await Taro.request({
      url: `https://pgrk.wizzstudio.com/languagerank/${langName}`
    });
    const res = response.data;
    if (res.code === 0) {
      dispatch(getLangHome(res.data));
    } else {
      dispatch(getRankFail(res.msg));
    }
  };
};
//请求语言更多页面
export const getLangMore = data => {
  return {
    type: GET_LANG_MORE,
    payload: data
  };
};
export const ajaxGetLangMore = langName => {
  return async dispatch => {
    const response = await Taro.request({
      url: `https://pgrk.wizzstudio.com/languagerank/${langName}/more`
    });
    const res = response.data;
    if (res.code === 0) {
      dispatch(getLangMore(res.data));
    } else {
      dispatch(getRankFail(res.msg));
    }
  };
};

//请求热门岗位
export const getPosi = data => {
  return {
    type: GET_POSI,
    payload: data
  };
};
export const ajaxGetPosi = lang => {
  return async dispatch => {
    const response = await Taro.request({
      url: `https://pgrk.wizzstudio.com/${lang}/post`
    });
    const res = response.data;
    if (res.code === 0) {
      dispatch(getPosi(res.data));
    } else {
      dispatch(getRankFail(res.msg));
    }
  };
};

//请求薪资排行
export const getSalary = data => {
  return {
    type: GET_SALARY,
    payload: data
  };
};
export const ajaxGetSalary = lang => {
  return async dispatch => {
    const response = await Taro.request({
      url: `https://pgrk.wizzstudio.com/${lang}/salary`
    });
    const res = response.data;
    if (res.code === 0) {
      dispatch(getSalary(res.data));
    } else {
      dispatch(getRankFail(res.msg));
    }
  };
};

//请求公司需求排行
export const getDemandPosi = data => {
  return {
    type: GET_DEMANDPOSI,
    payload: data
  };
};
export const ajaxGetDemandPosi = lang => {
  return async dispatch => {
    const response = await Taro.request({
      url: `https://pgrk.wizzstudio.com/${lang}/companypost`
    });
    const res = response.data;
    if (res.code === 0) {
      dispatch(getDemandPosi(res.data));
    } else {
      dispatch(getRankFail(res.msg));
    }
  };
};

//请求城市需求
export const getCity = data => {
  return {
    type: GET_CITY,
    payload: data
  };
};
export const ajaxGetCity = lang => {
  return async dispatch => {
    const response = await Taro.request({
      url: `https://pgrk.wizzstudio.com/${lang}/languagecity`
    });
    const res = response.data;
    if (res.code === 0) {
      dispatch(getCity(res.data));
    } else {
      dispatch(getRankFail(res.msg));
    }
  };
};

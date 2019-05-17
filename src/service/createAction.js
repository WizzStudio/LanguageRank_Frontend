import Taro from "@tarojs/taro";
const HOST = "https://pgrk.wizzstudio.com";
const createActionSucess = (TYPE, data) => {
  return {
    type: TYPE,
    payload: data
  };
};
const createActionFail = data => {
  return {
    type: "GET_FAIL",
    payload: data
  };
};
export default function fetchData(option, TYPE) {
  return async dispatch => {
    Taro.showLoading({
      title: "拼命加载中..."
    });
    const response = await Taro.request({
      url: HOST + option.url,
      method: option.method || "GET",
      data: option.data || ""
    });
    const res = response.data;
    if (res.code === 0) {
      Taro.hideLoading();
      dispatch(createActionSucess(TYPE, res.data));
    } else {
      Taro.hideLoading();
      dispatch(createActionFail(res.data));
    }
    return res;
  };
}

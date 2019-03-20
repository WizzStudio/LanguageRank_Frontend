import { GET_USERINFO_SUCCESS, GET_USERINFO_FAIL } from "../constants/userInfo";

export default function userInfo(state = {}, action) {
  switch (action.type) {
    case GET_USERINFO_SUCCESS:
      return {
        ...state,
        ...action.data
      };
    case GET_USERINFO_FAIL:
      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
}

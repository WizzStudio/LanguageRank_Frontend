import {
  GET_USER_ALLINFO,
  GET_USER_FAIL,
  GET_USER_PLAN,
  ADD_USER_PLAN,
  GET_USER_AWARD
} from "../constants/userInfo";

export default function userInfo(state = [], action) {
  switch (action.type) {
    case GET_USER_ALLINFO:
      return {
        ...state,
        allInfo: {
          ...action.payload
        }
      };
    case GET_USER_PLAN:
      return {
        ...state,
        userPlan: {
          ...action.payload
        }
      };
    case GET_USER_FAIL:
      return {
        ...state,
        getFail: {
          ...action.payload
        }
      };
    case ADD_USER_PLAN:
      return {
        ...state,
        addPlan: action.payload
      };
    case GET_USER_AWARD:
      return {
        ...state,
        userAward: { ...action.payload }
      };
    default:
      return state;
  }
}

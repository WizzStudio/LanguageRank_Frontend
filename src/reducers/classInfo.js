import {
  ADD_CLASS,
  GET_USER_CLASS,
  GET_ALL_CLASS,
  JOIN_CLASS,
  QUIT_CLASS,
  GET_CLASS_PLAN,
  GET_USER_CLASS_PLAN,
  GET_CLASS_FRIEND,
  GET_CLASS_MEMBER,
  GET_CLASS_FAIL
} from "../constants/classInfo";

const INIT_STATE = [];
export default function classInfo(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_USER_CLASS:
      return {
        ...state,
        userClass: [...action.payload]
      };
    case GET_ALL_CLASS:
      return {
        ...state,
        allClass: [...action.payload]
      };
    case GET_USER_CLASS_PLAN:
      return {
        ...state,
        userClassPlan: [...action.payload]
      };
    case GET_CLASS_MEMBER:
      return {
        ...state,
        classMember: action.payload
      };
    default:
      return {
        ...state
      };
  }
}

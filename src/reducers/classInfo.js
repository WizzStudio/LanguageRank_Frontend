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
  GET_CLASS_FAIL,
  GET_CLASS_MSG
} from "../constants/classInfo";

const INIT_STATE = [];
export default function classInfo(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_USER_CLASS:
      let clazzIdArr = [];
      action.payload.forEach(item => {
        clazzIdArr.push(item.clazzId);
      });
      return {
        ...state,
        userClass: [...action.payload],
        userClassId: clazzIdArr
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
    case GET_CLASS_MSG:
      return {
        ...state,
        classMsg: action.payload
      };
    default:
      return {
        ...state
      };
  }
}

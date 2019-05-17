import {
  GET_AUTH_CMT,
  GET_DEMAND_CMT,
  GET_CLASS_CMT
} from "../constants/comment";

export default function cmtInfo(state = [], action) {
  switch (action.type) {
    case GET_AUTH_CMT:
      return {
        ...state,
        authCmt: action.payload
      };
    case GET_DEMAND_CMT:
      return {
        ...state,
        demandCmt: action.payload
      };
    case GET_CLASS_CMT:
      return {
        ...state,
        classCmt: action.payload
      };
    default:
      return {
        ...state
      };
  }
}

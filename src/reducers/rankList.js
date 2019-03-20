import { GET_AUTH_RANK, GET_DEMAND_RANK } from "../constants/rank";

const INIT_STATE = [];
export default function rankList(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_AUTH_RANK:
      return {
        ...state,
        ...action.payload
      };
    case GET_DEMAND_RANK:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

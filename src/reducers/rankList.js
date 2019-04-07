import {
  GET_AUTH_RANK,
  GET_DEMAND_RANK,
  GET_LANGHOME,
  GET_LANG_MORE
} from "../constants/rank";

const INIT_STATE = [];
export default function rankList(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_AUTH_RANK:
      return {
        ...state,
        authRank: [...action.payload]
      };
    case GET_DEMAND_RANK:
      return {
        ...state,
        demandRank: [...action.payload]
      };
    case GET_LANGHOME:
      return {
        ...state,
        langHome: {
          ...action.payload
        }
      };
    case GET_LANG_MORE:
      return {
        ...state,
        langMore: {
          ...action.payload
        }
      };
    default:
      return state;
  }
}

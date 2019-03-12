import { getAuth, getDemand } from "../actions/rankList";
import { GET_AUTH_RANK, GET_DEMAND_RANK } from "../constants/rank";
import authRank from "../mock/authRank.json";
const INIT_STATE = [];
export default function rankList(state = INIT_STATE, action) {
  const { data } = authRank;
  switch (action.type) {
    case GET_AUTH_RANK:
      return {
        ...state,
        data
      };
    case GET_DEMAND_RANK:
      return {
        ...state,
        data
      };
    default:
      return state;
  }
}

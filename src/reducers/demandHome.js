import { GET_DEMANDPOSI } from "../constants/rank";

const INIT_STATE = [];
export default function demandHome(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_DEMANDPOSI:
      return action.payload;
    default:
      return state;
  }
}

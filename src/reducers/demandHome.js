import {
  GET_DEMANDPOSI,
  GET_POSI,
  GET_SALARY,
  GET_CITY
} from "../constants/rank";

const INIT_STATE = [];
export default function demandHome(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_POSI:
      return {
        ...state,
        posi: [...action.payload.languagePostList],
        logo: action.payload.languageSymbol
      };
    case GET_SALARY:
      return {
        ...state,
        salary: [...action.payload]
      };
    case GET_DEMANDPOSI:
      return {
        ...state,
        demandPosi: [...action.payload]
      };
    case GET_CITY:
      return {
        ...state,
        city: [...action.payload]
      };
    default:
      return state;
  }
}

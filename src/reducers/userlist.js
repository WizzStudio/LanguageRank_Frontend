import { GET_USER_SUCCESS, GET_USER_FAILED } from "../constants/userlist";

export default function userlist(state = [], action) {
  switch (action.type) {
    case GET_USER_SUCCESS:
      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
}

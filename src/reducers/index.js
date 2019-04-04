import { combineReducers } from "redux";
import rankList from "./rankList";
import demandHome from "./demandHome";
import userInfo from "./userInfo";
export default combineReducers({
  rankList,
  demandHome,
  userInfo
});

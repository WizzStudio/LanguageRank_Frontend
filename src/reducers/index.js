import { combineReducers } from "redux";
import rankList from "./rankList";
import demandHome from "./demandHome";
import userInfo from "./userInfo";
import classInfo from "./classInfo";
import error from "./error";
import cmtInfo from "./cmtInfo";
export default combineReducers({
  rankList,
  demandHome,
  userInfo,
  classInfo,
  cmtInfo,
  error
});

import { combineReducers } from "redux";
import userInfo from "./userInfo";
import classInfo from "./classInfo";
import error from "./error";
import cmtInfo from "./cmtInfo";
export default combineReducers({
  userInfo,
  classInfo,
  cmtInfo,
  error
});

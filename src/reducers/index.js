import { combineReducers } from "redux";
import counter from "./counter";
import rankList from "./rankList";
import userlist from "./userlist";
export default combineReducers({
  counter,
  rankList,
  userlist
});

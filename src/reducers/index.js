import { combineReducers } from "redux";
import counter from "./counter";
import rankList from "./rankList";
import userlist from "./userlist";
import demandHome from "./demandHome";
export default combineReducers({
  counter,
  rankList,
  userlist,
  demandHome
});

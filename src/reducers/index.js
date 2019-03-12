import { combineReducers } from "redux";
import counter from "./counter";
import rankList from "./rankList";

export default combineReducers({
  counter,
  rankList
});

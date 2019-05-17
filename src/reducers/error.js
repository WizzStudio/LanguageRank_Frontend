export default function error(state = "", action) {
  switch (action.type) {
    case "GET_FAIL":
      return {
        ...state,
        error: error.msg
      };

    default:
      return {
        ...state
      };
  }
}

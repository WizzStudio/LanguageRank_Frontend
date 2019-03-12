import { GET_AUTH_RANK, GET_DEMAND_RANK } from "../constants/rank";

export const getAuth = () => {
  return {
    type: GET_AUTH_RANK
  };
};

export const getDemand = () => {
  return {
    type: GET_DEMAND_RANK
  };
};

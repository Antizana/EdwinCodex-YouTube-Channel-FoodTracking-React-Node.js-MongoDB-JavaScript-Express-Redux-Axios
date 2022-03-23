import { SET_USER } from "./types";

export const setUserAction = (user) => ({
  type: SET_USER,
  payload: user,
});

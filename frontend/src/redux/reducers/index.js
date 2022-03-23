import { combineReducers } from "redux";
import { SET_USER } from "../actions/types";

export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: {
      currentUser: user,
    },
  };
};

export const userReducer = (state, action) => {
  switch (action.type) {
    case action.SET_USER:
      return {
        currentUser: action.payload.currentUser,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: userReducer,
});

module.export = { userReducer, rootReducer };

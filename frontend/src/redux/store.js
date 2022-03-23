import { createStore } from "redux";
import { userReducer } from "./reducers";

const initialUserState = {
  currentUser: "user01",
};

export const store = createStore(
  userReducer,
  initialUserState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

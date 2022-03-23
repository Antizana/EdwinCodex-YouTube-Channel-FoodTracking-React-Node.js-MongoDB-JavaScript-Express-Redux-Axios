/**
 * @fileoverview this Component manages the user authentication.
 *   Generates the user access token, encrypts the access data and stores
 *   it
 *
 */
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import plainLoginCtrl from "../auth/auth";
import { decodeSign } from "../auth/generate_token";
import { setUserAction } from "../redux/actions";
import { modalPrompt } from "../components/PromptModalWindow";

/** Login Button Component that manage the application user access
 *  @props {props.currentUser} String - Current user name
 *  @props {props.setCurrentUser} func - setState function
 *    to update the current user
 */
const LoginButton = (props) => {
  const [, setCookie] = useCookies(["sessionToken"]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ADMIN = process.env.REACT_APP_ADMIN || "admin";

  /** Logins logic and authentication control */
  const login = async () => {
    /** Prompts for the user authentication data */
    let user = await modalPrompt("Enter User Name:", "Cancel", "OK", {
      title: "User Registration",
    }).then(
      ({ button, input }) => {
        if (button === 1) {
          return input;
        }
      },
      () => {
        return "";
      }
    );
    if (!user || user == null) return;
    /** Gets the access token for the user */
    const sessionToken = await plainLoginCtrl({ userName: user });
    /** Retrieves the user rol and stores to be used by the application
     * views
     */
    setCookie("sessionToken", sessionToken, { path: "/" });
    const payload = decodeSign(sessionToken);
    user = payload.userName;
    props.setCurrentUser(payload.userName);
    dispatch(setUserAction(payload.userName));

    /**Redirects the user to his specific view according his role */
    if (user === ADMIN) navigate("/foods/admin", { state: {}, replace: true });
    else {
      navigate(`/404`, { state: {}, replace: true });
      navigate("/foods", { state: {}, replace: true });
    }
  };

  return (
    <button className="btn btn-primary btn-block" onClick={login}>
      Log In
    </button>
  );
};

export default LoginButton;

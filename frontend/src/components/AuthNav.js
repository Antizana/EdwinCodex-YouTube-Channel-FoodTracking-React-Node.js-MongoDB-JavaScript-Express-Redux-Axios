/**
 * @fileoverview Component renders the Login button and the currentUser name
 */

import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

import AuthenticationButton from "./AuthenticationButton";

/**
 *  Component renders the Login button and the currentUser name
 *  @props {props.currentUser} String - Current user name
 *  @props {props.setCurrentUser} func - setState function
 *    to update the current user
 */
const AuthNav = (props) => {
  const [cookies] = useCookies();
  const currentUser = useSelector((state) => state.currentUser);

  useEffect(() => {}, [currentUser, cookies.sessionToken]);

  /**
   * Disables currentUser NavLink
   * @param {e} element - the currentUser NavLink
   */
  const handleClick = (e) => {
    e.preventDefault();
  };

  return (
    <div className="navbar-nav ml-auto">
      <NavLink
        to=""
        end
        className="nav-link nav-link-disabled"
        onClick={handleClick}
      >
        {props.currentUser}
      </NavLink>

      <AuthenticationButton
        setCurrentUser={props.setCurrentUser}
        currentUser={props.currentUser}
      />
    </div>
  );
};

export default AuthNav;

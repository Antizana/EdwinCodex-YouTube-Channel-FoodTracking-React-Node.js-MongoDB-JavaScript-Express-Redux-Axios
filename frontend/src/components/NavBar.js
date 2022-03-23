/**
 *  @fileoverview Component renders the system navigation NavBar with the
 *     application NavBar and the Authentication NavBar
 */
import React from "react";
import MainNav from "./MainNav";
import AuthNav from "./AuthNav";

/**
 * Component that renders the system navigation NavBar with the
 *  application NavBar and the Authentication NavBar
 *  @props {props.currentUser} String - Current user name
 *  @props {props.setCurrentUser} func - setState function
 *    to update the current user
 */
const NavBar = (props) => {
  return (
    <div className="nav-container mb-3">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container-fluid">
          <a href="/foods" className="navbar-brand ">
            Calories Tracker
          </a>
          <div className="navbar-nav me-auto">
            <MainNav currentUser={props.currentUser} className="me-auto" />
          </div>
          <div className="d-flex me-2">
            <AuthNav
              setCurrentUser={props.setCurrentUser}
              currentUser={props.currentUser}
            />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;

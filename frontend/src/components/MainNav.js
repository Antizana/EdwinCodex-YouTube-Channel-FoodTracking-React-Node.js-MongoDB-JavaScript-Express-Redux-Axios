/**
 *  @fileoverview This NavBar Component renders the application navigation NavBar
 *   with the two main routes Foods to display the food entries list and the
 *   Add food rout to create foods.
 */

import { NavLink } from "react-router-dom";
import React from "react";

const MainNav = (props) => (
  <>
    <NavLink to="/foods" end className="nav-link router-link-exact-active">
      Foods
    </NavLink>
    <NavLink to="/add" end className="nav-link router-link-exact-active">
      Add
    </NavLink>
  </>
);

export default MainNav;

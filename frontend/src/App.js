import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import NavBar from "./components/NavBar";

/**
 * Main Calories Tracker Application Component
 */
function App() {
  // Main current user to the whole app
  const [currentUser, setCurrentUser] = useState(
    useSelector((state) => state.currentUser)
  );

  useEffect(() => {
    return () => {};
  }, []);

  /**
   * Refreshes the App when a user change occurs
   */
  useEffect(() => {
    return () => {};
  }, [currentUser]);

  return (
    <div className="d-flex flex-column">
      <NavBar setCurrentUser={setCurrentUser} currentUser={currentUser} />
      <AppRoutes currentUser={currentUser} />
    </div>
  );
}
export default App;

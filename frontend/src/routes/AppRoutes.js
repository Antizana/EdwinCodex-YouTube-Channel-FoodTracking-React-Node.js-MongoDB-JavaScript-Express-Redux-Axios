import React from "react";
import { Routes, Route } from "react-router-dom";
import AddFood from "../views/AddFood";
import Foods from "../views/Foods";
import FoodsList from "../views/FoodsList";
import FoodsListAdmin from "../views/FoodsListAdmin";
import AdminReport from "../views/AdminReport";
import ProtectedRoute from "../components/ProtectedRoute";
import PageNotFound from "../components/PageNotFound";

const AppRoutes = (props) => {
  return (
    <div className="container mt-3">
      <Routes>
        <Route
          exact
          path="/"
          element={<FoodsList currentUser={props.currentUser} />}
        />
        <Route
          exact
          path="/foods"
          element={<FoodsList currentUser={props.currentUser} />}
        />
        <Route
          exact
          path="/add"
          element={<AddFood currentUser={props.currentUser} />}
        />
        <Route element={<ProtectedRoute userToken={props.currentUser} />}>
          <Route exact path="/foods/admin" element={<FoodsListAdmin />} />
          <Route exact path="/foods/admin/report" element={<AdminReport />} />
        </Route>
        <Route
          path="/foods/:id"
          element={
            <ProtectedRoute userToken={props.currentUser}>
              <Foods />
            </ProtectedRoute>
          }
        />

        <Route path="/404" element={<PageNotFound />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;

/**
 * @fileoverview this Component renders the list of existing food entries
 *   for all users. This is an Admin view.
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FoodDataService from "../controllers/foods_service";
import FoodAdminService from "../controllers/foods_admin_service";
import Icon from "react-crud-icons";
import "../../node_modules/react-crud-icons/dist/css/react-crud-icons.css";

/**
 * Component that renders the the list of existing food entries for all
 *   users.
 * @props {props.currentUser} String - Current user name
 * @props {props.setCurrentUser} func - setState function
 *   to update the current user
 */
const FoodsListAdmin = () => {
  /** Array of food entries */
  const [foods, setFoods] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchUser, setSearchUser] = useState("");

  const navigate = useNavigate();

  /** Renders the food entries list */
  useEffect(() => {
    retrieveFoods();
    return () => {};
  }, []);

  /** Search Event Handler where the food entries for a specific user is
   *   retrieved.
   */
  const onChangeSearchUser = (e) => {
    const searchUser = e.target.value;
    setSearchUser(searchUser);
  };

  /** Retrieves the all user's food entries
   */
  const retrieveFoods = () => {
    FoodDataService.getAll()
      .then((response) => {
        setFoods(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  /** Sets the current record in the food list */
  const setActiveFood = (index) => {
    setCurrentIndex(index);
  };

  /** Retrieves the food entries for user criteria.
   */
  const findByUser = () => {
    FoodDataService.findByUser(searchUser)
      .then((response) => {
        setFoods(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  /** Refresh the food entries list */
  const refreshList = () => {
    retrieveFoods();
    setCurrentIndex(-1);
  };

  /**
   * Deletes a foods entry. Restricted only for admin role
   * @param food object - The food entry that will be deleted
   *
   */
  const deleteFood = (food) => {
    FoodAdminService.delete(food._id)
      .then((response) => {
        refreshList();
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  /**
   * Redirects to the update view to update a foods entry.
   *   Restricted only for admin role
   * @param food object - The food entry that will be updated
   *
   */
  const updateFood = (food) => {
    navigate(`/foods/${food._id}`);
  };

  /**
   * Redirects to the add new food view to create a foods entry.
   *   Restricted only for admin role
   *
   */
  const addFood = () => {
    navigate(`/add`);
  };

  /**
   * Redirects to the Admin report view. Restricted only for admin role
   *
   */
  const adminReport = () => {
    navigate(`/foods/admin/report`);
  };

  return (
    //  Search by user criteria area
    <div className="list row">
      <div className="col-md-12">
        <div className="input-group mb-3 ">
          <input
            type="text"
            className="form-control me-3"
            placeholder="Search by user"
            value={searchUser}
            onChange={onChangeSearchUser}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByUser}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {/* End Search by user criteria area */}

      {/* Action Buttons */}
      <div className="container mb-2">
        <div className="row ">
          <div className="col">
            <button className="btn btn-outline-primary " onClick={adminReport}>
              Report
            </button>
          </div>
          <div className="col d-flex justify-content-end">
            <button className="btn btn-outline-success " onClick={addFood}>
              Add
            </button>
          </div>
        </div>
      </div>
      {/* End Action Buttons */}

      {/* Food Entries Table */}
      <div className="col-md-12">
        <h4>Foods List</h4>
        <table className="table">
          {/* List titles */}
          <thead>
            <tr>
              <th scope="col">User</th>
              <th scope="col">Date/Time</th>
              <th scope="col">Food</th>
              <th scope="col" className="cell-align-end">
                Calories
              </th>
              <th scope="col" className="cell-align-end">
                Price
              </th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          {/* End List titles */}

          {/* Food List entries */}
          <tbody>
            {foods &&
              foods.map((food, index) => (
                <tr
                  className={
                    index === currentIndex
                      ? "table-primary align-middle"
                      : "align-middle"
                  }
                  onClick={() => setActiveFood(index)}
                  key={food._id}
                >
                  <td>{food.user}</td>
                  <td>{new Date(food.dateTimeFoodTaken).toLocaleString()}</td>
                  <td>{food.productName}</td>
                  <td className="cell-align-end">
                    {food.calorieValue.toLocaleString()}
                  </td>
                  <td className="cell-align-end">
                    {food.price.toLocaleString()}
                  </td>
                  <td>
                    <span>
                      <Icon
                        name="edit"
                        tooltip="Edit"
                        theme="light"
                        size="small"
                        onClick={() => updateFood(food)}
                      />
                      <Icon
                        name="delete"
                        tooltip="Delete"
                        theme="light"
                        size="small"
                        onClick={() => deleteFood(food)}
                      />
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
          {/* End Food List entries */}
        </table>
      </div>
    </div>
  );
};

export default FoodsListAdmin;

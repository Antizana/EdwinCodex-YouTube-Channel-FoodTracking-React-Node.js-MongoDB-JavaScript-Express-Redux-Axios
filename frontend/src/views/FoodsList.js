/**
 * @fileoverview this Component renders the list of existing food entries.
 *   where the user can search the food entries by entry date (date from /
 *   date to)
 */
import React, { useState, useEffect } from "react";
import FoodDataService from "../controllers/foods_service";
import { passedCalories } from "../utils/utils";
import DateTimePicker from "react-datetime-picker";

/**
 * Component that renders the the list of existing food entries.
 *  @props {props.currentUser} String - Current user name
 *  @props {props.setCurrentUser} func - setState function
 *    to update the current user
 */
const FoodsList = (props) => {
  /**Array of food entries */
  const [foods, setFoods] = useState([]);
  /**Array of entries that surpass the calories threshold*/
  const [passedLimitCalories, setPassedLimitCalories] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const currentUser = props.currentUser;

  /** Renders the food entries list for the user*/
  useEffect(() => {
    retrieveFoods();
    return () => {};
  }, []);

  /**
   * Retrieves the food entries for the current user and retrieves the Dates
   * where the user surpass the calories limit threshold.
   */
  const retrieveFoods = () => {
    FoodDataService.findByUser(currentUser)
      .then((response) => {
        setFoods(response.data);
        retrievePassedLimitCalories();
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  /**
   * Retrieves the Dates where the current user surpass the calories limit
   *   threshold.
   */
  const retrievePassedLimitCalories = () => {
    FoodDataService.findLimitCalories(currentUser)
      .then((response) => {
        setPassedLimitCalories(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  /** Sets the current record in the food list */
  const setActiveFood = (food, index) => {
    setCurrentIndex(index);
  };

  /**
   * Retrieves the food entries for the current user between a range of dates
   *    criteria.
   */
  const findByDate = () => {
    FoodDataService.findByUserDates(currentUser, startDate, endDate)
      .then((response) => {
        setFoods(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="container justify-content-center">
      {/* Search by Dates fields area*/}
      <div className="row md-12">
        <div className="input-group mb-3">
          <DateTimePicker
            value={startDate}
            onChange={setStartDate}
            className="me-2 mb-2"
          />
          <DateTimePicker
            value={endDate}
            onChange={setEndDate}
            className="me-2 mb-2"
          />
          <div className="col-md-auto">
            <button
              className="btn btn-outline-secondary mb-2 "
              type="button"
              onClick={findByDate}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {/* End Search by Dates Area */}

      {/* Food Entries Table Area*/}
      <div className="col-md-12">
        <h4>Foods List</h4>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Date/Time</th>
              <th scope="col">Food</th>
              <th scope="col" className="cell-align-end">
                Calories
              </th>
              <th scope="col" className="cell-align-end">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {foods &&
              foods.map((food, index) => (
                <tr
                  className={index === currentIndex ? "table-primary " : ""}
                  onClick={() => setActiveFood(food, index)}
                  key={food._id}
                >
                  <td>{new Date(food.dateTimeFoodTaken).toLocaleString()}</td>
                  <td>{food.productName}</td>
                  <td
                    className={
                      "cell-align-end" +
                      (passedCalories(
                        new Date(food.dateTimeFoodTaken).toLocaleDateString(),
                        passedLimitCalories
                      )
                        ? " table-danger "
                        : "")
                    }
                  >
                    {food.calorieValue.toLocaleString()}
                  </td>
                  <td className="cell-align-end">
                    {food.price.toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* Food Entries Table Area*/}
    </div>
  );
};

export default FoodsList;

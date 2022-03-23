/**
 * @fileoverview this Component allows add food entries
 **/
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import DateTimePicker from "react-datetime-picker";
import FoodsDataService from "../controllers/foods_service";
import { firstDayOfMonth, justDate, validateNumberField } from "../utils/utils";
import { modalConfirm } from "../components/ConfirmationModalWindow";

const CALORIES_THRESHOLD =
  parseInt(process.env.REACT_APP_CALORIES_THRESHOLD) || 2100;
const COST_THRESHOLD = parseInt(process.env.REACT_APP_COST_THRESHOLD) || 1000;
const ADMIN = process.env.REACT_APP_ADMIN || "admin";

/**
 * Component that allows enter food entries into the database
 * @param {Object} props receives the current user in props.currentUser
 * @returns the rendered form to add food entries
 */
const AddFood = (props) => {
  const [isValidNumber, setIsValidNumber] = useState({
    field: "",
    myNumber: "",
    isValid: true,
  });
  const [notNullField, setNotNullField] = useState({
    field: "",
    isValid: true,
  });

  const formNumericFields = ["calorieValue", "price"];
  const formNotNullFields = ["user", "productName"];
  const CURRENT_USER = props.currentUser;

  const initialFoodState = {
    id: null,
    user: "",
    dateTimeFoodTaken: new Date(),
    productName: "",
    calorieValue: 0,
    price: 0,
  };
  const [food, setFood] = useState(initialFoodState);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  /**
   * Validates the input field triggered and stores its value
   *   into the food object. If fields are not valid stores
   *   the status in the isValidNumber Object
   * @param {Object} event Element triggered in the form
   */
  const handleInputChange = (event) => {
    const { name, value, id } = event.target;
    //Validates numeric fields
    let isValid = true;
    if (formNumericFields.includes(id)) {
      isValid = validateNumberField(value) && value ? true : false;
      setIsValidNumber({ field: id, myNumber: value, isValid });
    }
    // Validates not null fields
    if (formNotNullFields.includes(id)) {
      isValid = value ? true : false;
      setNotNullField({ field: id, isValid });
    }

    setFood({ ...food, [name]: value });
  };

  /**
   * Handle changes in date fields, builds the food entry object
   * @param {Date} date receives the date object
   */
  const handleInputChangeDate = (date) => {
    setFood({ ...food, dateTimeFoodTaken: date });
  };

  /**
   * Retrieves the calories consumed in the day plus
   *   the calories in this food
   * @param {Date} date dateTimeFoodTaken value
   * @param {Number} calories calories value
   * @returns the current calories consumed in the day plus
   *   the calories in this food
   */
  const retrieveCalories = async (date, calories) => {
    calories = parseInt(calories);
    const isoDate = justDate(date).toISOString();
    return FoodsDataService.totalCaloriesPerUserDate(CURRENT_USER, isoDate)
      .then((response) => {
        let currentCalories = 0;
        if (response.data.length > 0) {
          currentCalories = parseInt(response.data[0].totalCalories) + calories;
        } else {
          currentCalories = 0 + calories;
        }
        return currentCalories;
      })
      .catch((e) => {
        console.log(e);
      });
  };

  /**
   * Retrieves the amount spent in the moth plus
   *   the price of this food
   * @param {*} date dateTimeFoodTaken value
   * @param {*} price price value of the current food
   * @returns the current amount spent in the month plus
   *   the price of this food
   */
  const retrieveSpending = async (date, price) => {
    price = parseInt(price);
    const isoFirstDayOfMonth = firstDayOfMonth(date).toISOString();
    return FoodsDataService.totalSpendingPerUserInMonth(
      CURRENT_USER,
      isoFirstDayOfMonth
    )
      .then((response) => {
        let currentSpending = 0;
        if (response.data.length > 0) {
          currentSpending = parseInt(response.data[0].totalSpending) + price;
        } else {
          currentSpending = 0 + price;
        }
        return currentSpending;
      })
      .catch((e) => {
        console.log(e);
      });
  };

  /**
   * Validates if the calories and price threshold are not surpassed
   * @param {Object} data current entry food
   * @returns {bool} false if the thresholds are surpassed
   */
  const isValidFoodEntry = async (data) => {
    // Retrieves the current Calories for this date and current Spending totals for this month for this user.
    let currentCalories = 0;
    let currentSpending = 0;
    currentCalories = await retrieveCalories(
      data.dateTimeFoodTaken,
      data.calorieValue
    );
    currentSpending = await retrieveSpending(
      data.dateTimeFoodTaken,
      data.price
    );
    // Shows an alert of Maximum Calories Threshold or Maximum Spending Threshold reached, if applicable.
    if (
      currentCalories > CALORIES_THRESHOLD ||
      currentSpending > COST_THRESHOLD
    ) {
      let modalBodyText = "";
      if (currentCalories > CALORIES_THRESHOLD)
        modalBodyText = `Maximum calories threshold (${currentCalories.toLocaleString()})`;
      if (currentSpending > COST_THRESHOLD) {
        if (modalBodyText !== "") modalBodyText += " and ";
        modalBodyText += `Maximum spending threshold (${currentSpending.toLocaleString()})`;
      }
      modalBodyText += " reached! Do you want to save this food?";

      const isConfirmed = await modalConfirm(modalBodyText, "Cancel", "Yes", {
        title: "Threshold Alert!",
      });
      return isConfirmed;
    }
    return true;
  };

  /**
   * Validates the form fields
   * @param {Object} data Food entry object
   * @returns {bool} true if passed the validations otherwise else
   */
  const validateForm = (data) => {
    //Validates numeric values
    for (const formNumber of formNumericFields) {
      if (!(validateNumberField(data[formNumber]) ? true : false)) {
        setIsValidNumber({
          field: formNumber,
          myNumber: data[formNumber],
          isValid: false,
        });
        return false;
      } else {
        setIsValidNumber({
          field: formNumber,
          myNumber: data[formNumber],
          isValid: true,
        });
      }
    }
    //Validates not null values
    let isValid = true;
    for (const field of formNotNullFields) {
      isValid = data[field];
      setNotNullField({ field: field, isValid });
      if (!isValid) return false;
    }

    return true;
  };

  /**
   * Validates and saves the food entry
   * @returns {bool} false if not saved
   */
  const saveFood = () => {
    var data = {
      user: CURRENT_USER === ADMIN ? food.user : CURRENT_USER,
      dateTimeFoodTaken: food.dateTimeFoodTaken,
      productName: food.productName,
      calorieValue: food.calorieValue,
      price: food.price,
    };

    if (!validateForm(data)) {
      return false;
    }

    isValidFoodEntry(data).then((isValid) => {
      if (!isValid) return false;
      //Saves the Food entry
      FoodsDataService.create(data)
        .then((response) => {
          setFood({
            id: response.data.id,
            user: response.data.user,
            dateTimeFoodTaken: new Date(response.data.dateTimeFoodTaken),
            productName: response.data.productName,
            calorieValue: response.data.calorieValue,
            price: response.data,
          });
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  };

  /**
   * Initializes the food entry object
   */
  const newFood = () => {
    setFood(initialFoodState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <div className="container">
            <div className="row">
              <div className="col">
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-outline-secondary"
                >
                  Back
                </button>
              </div>
              <div className="col">
                <button onClick={newFood} className="btn btn-success">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {CURRENT_USER === ADMIN && (
            <div className="form-group">
              <label htmlFor="user">User</label>
              {notNullField.field === "user" && !notNullField.isValid && (
                <div style={{ color: "red" }}>Cannot be blank</div>
              )}
              <input
                type="text"
                className="form-control mb-3"
                id="user"
                name="user"
                value={food.user}
                onChange={handleInputChange}
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="title">Food</label>
            {notNullField.field === "productName" && !notNullField.isValid && (
              <div style={{ color: "red" }}>Cannot be blank</div>
            )}
            <input
              type="text"
              className="form-control mb-3"
              id="productName"
              required
              value={food.title}
              onChange={handleInputChange}
              name="productName"
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateTimeFoodTaken">Food Taken in </label>
            <div>
              <DateTimePicker
                value={food.dateTimeFoodTaken}
                onChange={handleInputChangeDate}
                className="mt-2 mb-3"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="calorieValue">Calories Value</label>
            {isValidNumber.field === "calorieValue" &&
              !isValidNumber.isValid && (
                <div style={{ color: "red" }}>Entered Number is invalid</div>
              )}
            <input
              type="text"
              className="form-control mb-3"
              id="calorieValue"
              required
              value={food.calorieValue}
              onChange={handleInputChange}
              name="calorieValue"
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            {isValidNumber.field === "price" && !isValidNumber.isValid && (
              <div style={{ color: "red" }}>Entered Number is invalid</div>
            )}
            <input
              type="text"
              className="form-control mb-3"
              id="price"
              required
              value={food.price}
              onChange={handleInputChange}
              name="price"
            />
          </div>
          <div className="container mt-3">
            <div className="row">
              <div className="col">
                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-outline-secondary"
                >
                  Back
                </button>
              </div>
              <div className="col">
                <button onClick={saveFood} className="btn btn-outline-success">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AddFood;

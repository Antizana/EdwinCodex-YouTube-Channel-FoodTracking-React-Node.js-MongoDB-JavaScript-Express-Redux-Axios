/**
 * @fileoverview this Component allows to modify food entries
 *   is needed an admin role
 **/
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FoodDataService from "../controllers/foods_service";
import FoodsAdminService from "../controllers/foods_admin_service";
import { validateNumberField } from "../utils/utils";
import DateTimePicker from "react-datetime-picker";

/**
 *
 * @param {Object} props receives the current user in props.currentUser
 * @returns the rendered form to maintain food entries
 */
const Food = (props) => {
  const initialFoodState = {
    id: null,
    user: "",
    dateTimeFoodTaken: new Date(),
    productName: "",
    calorieValue: 0,
    price: 0,
  };
  const [validNumber, setValidNumber] = useState({
    field: "",
    myNumber: "",
    isValid: true,
  });
  const [notNullField, setNotNullField] = useState({
    field: "",
    isValid: true,
  });
  const [currentFood, setCurrentFood] = useState(initialFoodState);
  const [message, setMessage] = useState("");
  const formNumericFields = ["calorieValue", "price"];
  const formNotNullFields = ["user", "productName"];

  const { id } = useParams();
  const navigate = useNavigate();

  /**
   * Retrieves the food entry to be updated
   * @param {number} id food entry id
   */
  const getFood = (id) => {
    FoodDataService.get(id)
      .then((response) => {
        response.data.dateTimeFoodTaken = new Date(
          response.data.dateTimeFoodTaken
        );
        setCurrentFood(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  /**
   * Refreshes the form when a the food entry id is changed
   */
  useEffect(() => {
    getFood(id);
    return () => {};
  }, [id]);

  /**
   * Validates the input field triggered and stores its value
   *   into the food object. If fields are not valid stores
   *   the status in the validNumber Object
   * @param {Object} event Element triggered in the form
   */
  const handleInputChange = (event) => {
    const { name, value, id } = event.target;
    //Validates numeric fields
    let isValid = true;
    if (formNumericFields.includes(id)) {
      isValid = value && validateNumberField(value) ? true : false;
      setValidNumber({ field: id, myNumber: value, isValid });
    }
    // Validates not null fields
    if (formNotNullFields.includes(id)) {
      isValid = value ? true : false;
      setNotNullField({ field: id, isValid });
    }
    setCurrentFood({ ...currentFood, [name]: value });
  };

  /**
   * Handle changes in date fields, builds the food entry object
   * @param {Date} date receives the date object
   */
  const handleInputChangeDate = (date) => {
    setCurrentFood({ ...currentFood, dateTimeFoodTaken: date });
  };

  /**
   * Validates the form fields
   * @returns {bool} true if passed the validations otherwise else
   */
  const validateForm = () => {
    //Validates numeric values
    for (const formNumber of formNumericFields) {
      if (!(validateNumberField(currentFood[formNumber]) ? true : false)) {
        setValidNumber({
          field: formNumber,
          myNumber: currentFood[formNumber],
          isValid: false,
        });
        return false;
      } else {
        setValidNumber({
          field: formNumber,
          myNumber: currentFood[formNumber],
          isValid: true,
        });
      }
    }

    //Validates not null values
    let isValid = true;
    for (const notNullField of formNotNullFields) {
      isValid = currentFood[notNullField];
      setNotNullField({ field: notNullField, isValid });
      if (!isValid) return false;
    }
    return true;
  };

  /**
   * Validates and updates the current food entry
   */
  const updateFood = () => {
    if (!validateForm()) {
      return false;
    }
    FoodsAdminService.update(currentFood._id, currentFood)
      .then((response) => {
        console.log(response.data);
        setMessage("The food entry was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  /**
   * Deletes the current entry food
   */
  const deleteFood = () => {
    FoodDataService.remove(currentFood.id)
      .then((response) => {
        console.log(response.data);
        props.history.push("/foods");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentFood ? (
        <div className="edit-form">
          <h4>Food</h4>
          <form>
            <div className="form-group">
              <label htmlFor="user">User</label>
              {notNullField.field === "user" && !notNullField.isValid && (
                <div style={{ color: "red" }}>Cannot be blank</div>
              )}
              <input
                type="text"
                className="form-control"
                id="user"
                name="user"
                value={currentFood.user}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="productName">Food</label>
              {notNullField.field === "productName" &&
                !notNullField.isValid && (
                  <div style={{ color: "red" }}>Cannot be blank</div>
                )}
              <input
                type="text"
                className="form-control"
                id="productName"
                name="productName"
                value={currentFood.productName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateTimeFoodTaken">Date</label>
              <div>
                <DateTimePicker
                  value={currentFood.dateTimeFoodTaken}
                  onChange={handleInputChangeDate}
                  className="mb-3"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="calorieValue">Calories</label>
              {validNumber.field === "calorieValue" && !validNumber.isValid && (
                <div style={{ color: "red" }}>Entered Number is invalid</div>
              )}
              <input
                type="text"
                className="form-control"
                id="calorieValue"
                name="calorieValue"
                value={currentFood.calorieValue}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              {validNumber.field === "price" && !validNumber.isValid && (
                <div style={{ color: "red" }}>Entered Number is invalid</div>
              )}
              <input
                type="text"
                className="form-control"
                id="price"
                name="price"
                value={currentFood.price}
                onChange={handleInputChange}
              />
            </div>
          </form>
          <div className="container">
            <div className="row">
              <div className="col">
                <button
                  className="btn btn-outline-secondary "
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
              </div>
              <div className="col">
                <button
                  className="btn btn-outline-danger "
                  onClick={deleteFood}
                >
                  Delete
                </button>
              </div>
              <div className="col">
                <button
                  type="submit"
                  className="btn btn-outline-success "
                  onClick={updateFood}
                >
                  Update
                </button>
              </div>
              <p>{message}</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Food...</p>
        </div>
      )}
    </div>
  );
};
export default Food;

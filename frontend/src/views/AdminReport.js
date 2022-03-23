/**
 * @fileoverview this Component renders the Admin Report.
 *   where the user can search the food entries by entry date (date from /
 *   date to)
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FoodAdminService from "../controllers/foods_admin_service";
const DAYS_ADMIN_AVERAGE_CALORIES_REPORT =
  parseInt(process.env.REACT_APP_DAYS_ADMIN_AVERAGE_CALORIES_REPORT) || 7;
const DAYS_ADMIN_LAST_ENTRIES_REPORT =
  parseInt(process.env.REACT_APP_DAYS_ADMIN_LAST_ENTRIES_REPORT) || 7;

/**
 * This Components render the
 * @returns
 */
const AdminReport = () => {
  const [caloriesEntry, setCaloriesEntry] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [comparisonNDays, setComparisonNDays] = useState(0);
  const [comparisonPreviousNDays, setComparisonPreviousNDays] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    retrieveLastEntriesComparison(DAYS_ADMIN_LAST_ENTRIES_REPORT);
    retrieveAverageCaloriesPerUser(DAYS_ADMIN_AVERAGE_CALORIES_REPORT);
    return () => {};
  }, []);

  /**
   * Retrieves the number of added entries in the las N days, including the current day
   * @param {Number} nDays Number of days from which the food entries will be retrieved
   */
  const retrieveLastEntriesComparison = (nDays) => {
    FoodAdminService.lastEntriesComparison(nDays)
      .then((response) => {
        console.log(response.data);
        setComparisonNDays(parseInt(response.data[0].totalEntries));
      })
      .catch((e) => {
        console.log(e);
      });
    FoodAdminService.lastEntriesComparison(nDays * 2)
      .then((response) => {
        console.log(response.data);
        setComparisonPreviousNDays(response.data[0].totalEntries);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const retrieveAverageCaloriesPerUser = (nDays) => {
    FoodAdminService.averageCalories(nDays)
      .then((response) => {
        setCaloriesEntry(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const setActiveEntry = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="list row">
      <div className="col-md-12">
        <div className="input-group mb-3">
          <h2>Admin Report</h2>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="container mb-2">
        <div className="row ">
          <div className="col">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-secondary"
            >
              Back
            </button>
          </div>
        </div>
      </div>
      {/* End Action Buttons */}

      {/* Adding Entries Comparative */}
      <div className="col-md-6">
        <h4>Entries Added</h4>
        <table className="table">
          <thead>
            <tr>
              <th scope="col" className=" justify-content-end">
                <div className=" d-flex justify-content-end">
                  Last {DAYS_ADMIN_LAST_ENTRIES_REPORT} days
                </div>
              </th>
              <th scope="col">
                <div className=" d-flex justify-content-end">
                  Previous {DAYS_ADMIN_LAST_ENTRIES_REPORT} days
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="cell-align-end">
                {comparisonNDays.toLocaleString()}
              </td>
              <td className="cell-align-end">
                {(comparisonPreviousNDays - comparisonNDays).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* End Adding Entries Comparative */}

      {/* Average Calories Per User Table */}
      <div className="col-md-6">
        <h4>
          Average Calories Per User the last{" "}
          {DAYS_ADMIN_AVERAGE_CALORIES_REPORT} days
        </h4>
        <table className="table">
          {/* List titles */}
          <thead>
            <tr>
              <th scope="col">User</th>
              <th scope="col" className="cell-align-end">
                Average Calories
              </th>
            </tr>
          </thead>
          {/* End List titles */}

          {/* Average Calories List entries */}
          <tbody>
            {caloriesEntry &&
              caloriesEntry.map((caloriesEntry, index) => (
                <tr
                  className={
                    index === currentIndex
                      ? "table-primary align-middle"
                      : "align-middle"
                  }
                  onClick={() => setActiveEntry(index)}
                  key={caloriesEntry.user}
                >
                  <td>{caloriesEntry.user}</td>
                  <td className="cell-align-end">
                    {caloriesEntry.averageCalories.toFixed(2).toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* End Average Calories Per User Table */}
      </div>
    </div>
  );
};

export default AdminReport;

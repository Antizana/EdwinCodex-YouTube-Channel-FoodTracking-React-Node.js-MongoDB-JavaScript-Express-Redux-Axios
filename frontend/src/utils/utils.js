/**
 * @fileoverview util functions
 */
import Cookies from "js-cookie";
import { decodeSign } from "../auth/generate_token";

/**
 * Checks if in currEntryDate is surpassed the calories limit
 * @param {Date} currEntryDate Food entry date
 * @param {Array} passedLimitCalories Array with the days
 *   where the calories surpass the threshold limit
 * @returns {bool} true if in the currEntryDate is surpassed
 *   the calories limit otherwise false
 */
export const passedCalories = (currEntryDate, passedLimitCalories) => {
  if (!passedLimitCalories) return false;
  const array = passedLimitCalories
    .map((entry) => {
      return new Date(entry.date).toLocaleDateString();
    })
    .filter((entry) => {
      return currEntryDate === entry;
    });
  return array.length > 0 ? true : false;
};

/**
 * Returns the first day of the month for Date para. The date *   will be returned with time set to 0's
 * @param {Date} date
 * @returns {Date} Returns first day of month with time set to 0's
 */
export const firstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Removes the time in a Date
 * @param {Date} date
 * @returns Just the Date without time (time set to 0's)
 */
export const justDate = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/**
 * Retrieves de current user
 * @returns {String} Current user
 */
export const retrieveUser = async () => {
  const token = Cookies.get("sessionToken");
  const userName = await decodeSign(token)?.userName;
  const currentUser =
    userName || parseInt(process.env.CURRENT_USER) || "user01";
  console.log(currentUser);
  return currentUser;
};

/**
 * Validates numeric fields
 * @param {Number} myNumber - Number to be validated
 * @returns {bool} true if number is valid otherwise false
 */
export const validateNumberField = (myNumber) => {
  const numberRegEx = /^\s*[+-]?(\d+|\d*\.\d+|\d+\.\d*)([Ee][+-]?\d+)?\s*$/;

  return numberRegEx.test(String(myNumber).toLowerCase()) ? true : false;
};

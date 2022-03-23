/**
 *  Validates a Date be of Date type and don't be NaN
 * @param {Date} d Date to be validated
 */
const isValidDate = (d) => {
  return d instanceof Date && !isNaN(d);
};

module.exports = { isValidDate };

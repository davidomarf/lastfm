/**
 * Utilities to unclutter the visualization components.
 *
 * @file    This file defines helping functions for the visualization components.
 * @author  davidomarf
 * @since   v1.0.0
 */

// Used to render the month's name without calling Date.toLocaleDateString()
export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

/**
 * Formats a Date in a readable String.
 *
 * The format is Month dd, YYYY.
 *
 * @param {Object} date  Date to be formatted
 * @returns {string}     Date to string in format Month dd, YYYY
 */
export function formatDate(date) {
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Generate an array of dates containing every day between start and end.
 *
 * You must ensure start is lower than end
 *
 * @param {Date} start      First value of the array
 * @param {Date} end        Last value of the array
 * @param {number} [step=1] Step in days between the dates in the array
 * @return {Date[]}         All the dates between start and end
 */
export function getDateArray(start, end, step = 1) {
  if (start > end) {
    throw new Error(
      "Start date is bigger than end date (start is in the future of end)"
    );
  }
  let arr = [];
  let dt = new Date(start);

  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + step);
  }

  return arr;
}

/**
 * Creates an ID for a date using its Year, Month, Date.
 *
 * It appends a prefix that should be unique for every instance the function is called
 * to distinguish between different elements that create elements using the same date.
 *
 * @param {Date} date           Date to be used
 * @param {string} [prefix="id"]  Prefix to append before the readable date
 * @returns {string}              prefix + Date in format YYYY-MM-D
 */
export function getIDFromDate(date, prefix = "id") {
  return `${prefix}-${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()}`;
}

/**
 * Formats a Date in a readable String.
 *
 * The format is Month dd, YYYY.
 *
 * @param {Object} date  Date to be formatted
 * @returns {string}     Date to string in format Month dd, YYYY
 */
export function formatWeekFromDate(sunday) {
  let saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  return `${months[sunday.getMonth()]} ${sunday.getDate()} — ${
    // If the month is the same for sunday an saturday, don't print the month
    saturday.getMonth() !== sunday.getMonth() ? months[saturday.getMonth()] : ""
  } ${saturday.getDate()}`;
}

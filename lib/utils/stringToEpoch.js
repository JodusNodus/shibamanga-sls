const moment = require("moment");

module.exports = function stringToEpoch(dateString, format) {
  const today = moment(0, "HH");
  const yesterday = today.subtract(1, "day");

  let date;
  if (/today/i.test(dateString)) {
    date = today;
  } else if (/yesterday/i.test(dateString)) {
    date = yesterday;
  } else {
    date = moment(dateString, format);
  }
  return date.valueOf();
};

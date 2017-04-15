import * as moment from "moment";

export default function stringToEpoch(dateString:string, format:string):number {
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

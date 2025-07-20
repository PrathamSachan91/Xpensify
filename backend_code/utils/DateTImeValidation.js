const moment = require("moment");

const dateTimeValidation = (type, value) => {
  console.log(value);
  const now = moment();

  if (type === "time") {
    const input = moment(value, "HH:mm:ss", true);
    if (!input.isValid()) return "Invalid Time Format";

    const todayInputTime = moment()
      .startOf("day")
      .add(input.hours(), "hours")
      .add(input.minutes(), "minutes")
      .add(input.seconds(), "seconds");

    return todayInputTime.isBefore(now) ? "Invalid Timestamp" : "true";
  }

  if (type === "date") {
    const input = moment(value, "YYYY-MM-DD", true);
    if (!input.isValid()) return "Invalid Date Format";

    return input.isBefore(now.clone().startOf("day")) ? "Invalid Date" : "true";
  }

  if (type === "datetime") {
    const input = moment(value, "YYYY-MM-DD HH:mm:ss", true);
    if (!input.isValid()) return "Invalid Date Time Format";

    return input.isBefore(now)
      ? "You Can't select a date/time in the past"
      : "true";
  }

  return "Invalid Type";
};

module.exports = dateTimeValidation;

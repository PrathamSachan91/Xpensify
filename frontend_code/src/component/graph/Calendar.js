import React from "react";

const CalendarCard = () => {
  const today = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 text-center mt-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        📅 Today
      </h2>
      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
        {formattedDate}
      </p>
    </div>
  );
};

export default CalendarCard;

// import React, { useState } from "react";
// import Calendar from "react-calendar";
// import 'react-calendar/dist/Calendar.css';

// const CalendarCard = () => {
//   const [date, setDate] = useState(new Date());

//   return (
//     <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 text-center">
//       <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
//         📅 Select Date
//       </h2>
//       <Calendar
//         onChange={setDate}
//         value={date}
//         className="react-calendar w-full border-0 text-gray-800"
//       />
//       <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//         Selected: {date.toDateString()}
//       </p>
//     </div>
//   );
// };

// export default CalendarCard;

import { useState } from "react";
import "./scss/DatePicker.scss";

interface Props {
  onDateClick: (date: Date) => void;
}

const Calendar = ({ onDateClick }: Props) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const displayCalendar = () => {
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const daysInMonth =
      32 -
      new Date(currentDate.getFullYear(), currentDate.getMonth(), 32).getDate();
    const startingDayOffset = firstDay === 0 ? 6 : firstDay - 1; // Calculate the offset for Monday

    let date = 1;
    let calendarCells = [];

    for (let i = 0; i < 6; i++) {
      let rowCells = [];
      for (let j = 0; j < 7; j++) {
        const cellIndex = i * 7 + j;
        if (cellIndex < startingDayOffset || date > daysInMonth) {
          rowCells.push(<td key={`empty-${cellIndex}`}></td>);
        } else {
          let day = date;
          const cellDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day,
            12
          );

          rowCells.push(
            <td
              className={"day"}
              key={`${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`}
              onClick={() => onDateClick(cellDate)}
            >
              {day}
            </td>
          );
          date++;
        }
      }
      calendarCells.push(<tr key={i}>{rowCells}</tr>);
      if (date > daysInMonth) break;
    }
    return calendarCells;
  };

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h3 className="monthYear">
          {currentDate.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <div className="arrows">
          <button className="btn" type="button" onClick={prevMonth}>
            {"<"}
          </button>
          <button className="btn" type="button" onClick={nextMonth}>
            {">"}
          </button>
        </div>
      </div>
      <table className="calendar-table">
        <thead>
          <tr>
            <th>M</th>
            <th>T</th>
            <th>W</th>
            <th>T</th>
            <th>F</th>
            <th>S</th>
            <th>S</th>
          </tr>
        </thead>
        <tbody>{displayCalendar()}</tbody>
      </table>
    </div>
  );
};

export default Calendar;

import { useState } from "react";
import "./scss/Events.scss";
import axios from "axios";
import AddEvent from "./AddEvent";

interface EventType {
  id: number;
  title: string;
  timeStart: string;
  timeEnd: string;
}

interface Props {
  events: { date: Date; events: EventType[] }[];
  updateEvents: () => void;
}

const Events = ({ events, updateEvents }: Props) => {
  const cellHeight = 32;
  const [selectedEvent, selectEvent] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    axios
      .delete(`http://localhost:80/api/events/${id}/delete`)
      .then((response) => {
        console.log(response.data);
        updateEvents();
      });
  };

  const calculateEventHeight = (event: EventType): number => {
    const { timeStart, timeEnd } = event;
    const [startHour, startMinute] = timeStart.split(":").map(Number);
    const [endHour, endMinute] = timeEnd.split(":").map(Number);

    const totalMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
    return (totalMinutes / 60) * cellHeight;
  };

  const calculateEventTop = (event: EventType): number => {
    const [, minute] = event.timeStart.split(":").map(Number);
    return (minute / 60) * cellHeight;
  };

  const renderEvent = (date: Date, event: EventType, hour: number) => {
    const { timeStart } = event;
    const [startHour, startMinute] = timeStart.split(":").map(Number);
    const eventHeight = Math.max(calculateEventHeight(event), cellHeight / 2);

    if (startHour === hour && startMinute <= 59) {
      return (
        <div className="event" key={event.id}>
          <div
            className="event-body"
            onClick={() => {
              if (selectedEvent == event.id) selectEvent(null);
              else selectEvent(event.id);
            }}
            style={{
              height: eventHeight + "px",
              top: calculateEventTop(event) + "px",
              flexDirection: eventHeight == cellHeight / 2 ? "row" : "column",
              padding: (eventHeight == cellHeight / 2 ? "0" : "4px") + " 4px",
            }}
          >
            <div className="event-title">{event.title}</div>
            <div className="event-time">
              {`${event.timeStart}-${event.timeEnd}`}
            </div>
          </div>

          {selectedEvent == event.id && (
            <div
              className="event-menu"
              style={{
                height: eventHeight + "px",
                top: calculateEventTop(event) + "px",
              }}
            >
              <AddEvent
                updateEvents={() => {
                  updateEvents();
                  selectEvent(null);
                }}
                url={`http://localhost:80/api/events/${event.id}/edit`}
                edit={true}
                event={{ eventType: event, date: date }}
              />
              <button
                onClick={() => handleDelete(event.id)}
                className="btn long"
                type="button"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="events">
      <table>
        <thead>
          <tr>
            <th className="hour-cell"></th>
            {events.map(({ date }) => (
              <th
                className="day"
                key={date.toLocaleDateString("en-US", { weekday: "short" })}
              >
                <div className="day-name">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className="day-number btn">{date.getDate()}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 24 }, (_, hour) => (
            <tr key={hour}>
              <td className="hour-cell">
                {hour !== 23 && (
                  <div className="hour-title">
                    {(hour < 9 ? `0${hour + 1}` : hour + 1) + ":00"}
                  </div>
                )}
              </td>
              {events.map(({ date, events: dayEvents }) => (
                <td key={`${date.getDate()}/${hour}`} className="hour">
                  {dayEvents.map((event) => renderEvent(date, event, hour))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Events;

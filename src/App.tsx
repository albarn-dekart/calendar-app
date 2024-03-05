import { useEffect, useState } from "react";
import Header from "./components/Header";
import DatePicker from "./components/DatePicker";
import Events from "./components/Events";
import "./App.scss";
import AddEvent from "./components/AddEvent";
import axios from "axios";

interface EventType {
  id: number;
  title: string;
  timeStart: string;
  timeEnd: string;
}

interface DayEvents {
  date: Date;
  events: EventType[];
}

function App() {
  //Use state
  const [selectedDate, setSelectedDate] = useState<Date>(
    getMondayDate(new Date())
  );
  const [weekState, setWeekState] = useState(true);
  const [events, setEvents] = useState<DayEvents[]>([]);

  //Functions
  const prev = () => {
    const newDate = new Date(selectedDate);
    newDate.setHours(12, 0, 0, 0);
    const diff = weekState ? 7 : 1;
    newDate.setDate(newDate.getDate() - diff);
    setSelectedDate(newDate);
  };

  const next = () => {
    const newDate = new Date(selectedDate);
    newDate.setHours(12, 0, 0, 0);
    const diff = weekState ? 7 : 1;
    newDate.setDate(newDate.getDate() + diff);
    setSelectedDate(newDate);
  };

  const weekAction = () => {
    setWeekState(!weekState);
    setSelectedDate(getMondayDate(selectedDate));
  };

  async function updateEvents() {
    const startDate = weekState ? getMondayDate(selectedDate) : selectedDate;
    try {
      const endDate = weekState ? getNextDate(startDate, 6) : selectedDate;

      const startOfWeekStr = startDate.toISOString().slice(0, 10);
      const endOfWeekStr = endDate.toISOString().slice(0, 10);

      const response = await axios.get(
        `http://localhost:80/api/?startOfWeek=${startOfWeekStr}&endOfWeek=${endOfWeekStr}`
      );

      let updatedEvents = [];

      if (weekState) {
        const daysInWeek = [];
        for (let i = 0; i < 7; i++) {
          const currentDate = getNextDate(startDate, i);
          const formattedDate = currentDate.toISOString().slice(0, 10);
          const eventsOfDay = response.data
            .filter((event: any) => event.date === formattedDate)
            .map(({ id, title, timeStart, timeEnd }: EventType) => ({
              id,
              title,
              timeStart,
              timeEnd,
            }));
          daysInWeek.push({ date: currentDate, events: eventsOfDay });
        }
        updatedEvents = daysInWeek;
      } else {
        updatedEvents.push({ date: selectedDate, events: response.data });
      }

      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error fetching or updating events:", error);
    }
  }

  function getMondayDate(date: Date) {
    const mondayDate = new Date(date);
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday being 0
    mondayDate.setDate(diff);
    mondayDate.setHours(12, 0, 0, 0);
    return mondayDate;
  }

  function getNextDate(date: Date, diff: number) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + diff);
    newDate.setHours(12, 0, 0, 0);
    return newDate;
  }

  useEffect(() => {
    updateEvents();
  });

  return (
    <>
      <Header
        date={selectedDate.toLocaleString("default", { month: "long" })}
        todayAction={() => {
          if (weekState) setSelectedDate(getMondayDate(new Date()));
          else setSelectedDate(new Date());
        }}
        prevWeek={prev}
        nextWeek={next}
        weekAction={weekAction}
        weekState={weekState}
      />
      <main id="main">
        <nav id="sideNav">
          <AddEvent
            updateEvents={() => updateEvents()}
            url="http://localhost:80/api/events/save"
            edit={false}
            event={null}
          />
          <DatePicker
            onDateClick={(date) => {
              const newSelectedDate = weekState ? getMondayDate(date) : date;
              setSelectedDate(newSelectedDate);
            }}
          />
        </nav>
        <Events events={events} updateEvents={() => updateEvents()} />
      </main>
    </>
  );
}

export default App;

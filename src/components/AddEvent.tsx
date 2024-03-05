import React, { useState, ChangeEvent } from "react";
import "./scss/addEvent.scss";
import axios from "axios";

interface EventType {
  id: number;
  title: string;
  timeStart: string;
  timeEnd: string;
}

interface Props {
  updateEvents: () => void;
  url: string;
  edit: boolean;
  event: { eventType: EventType; date: Date } | null;
}

const AddEvent = ({ updateEvents, url, edit, event }: Props) => {
  const [active, setActive] = useState(false);
  const [inputs, setInputs] = useState({
    title: event?.eventType.title || "",
    date: event?.date.toISOString().slice(0, 10) || "",
    timeStart: event?.eventType.timeStart || "",
    timeEnd: event?.eventType.timeEnd || "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (edit) {
      axios.put(url, inputs).then((response) => {
        console.log(response.data);
        updateEvents();
      });
    } else {
      axios.post(url, inputs).then((response) => {
        console.log(response.data);
        updateEvents();
      });
    }

    setInputs({
      title: "",
      date: "",
      timeStart: "",
      timeEnd: "",
    });
    setActive(false);
  };

  return (
    <div className="addEvent">
      {!active ? (
        <button
          onClick={() => setActive(true)}
          className="btn long"
          type="button"
        >
          {edit ? "Edit" : "Add event"}
        </button>
      ) : null}
      {active ? (
        <div className="addEvent-form">
          <button
            type="button"
            className="closeButton btn light"
            onClick={() => setActive(false)}
          >
            &times;
          </button>

          <form action="" method="get" onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Add title"
              value={inputs.title}
              onChange={handleChange}
            />
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              value={inputs.date}
              onChange={handleChange}
            />
            <label htmlFor="startTime">From</label>
            <input
              type="time"
              name="timeStart"
              id="startTime"
              value={inputs.timeStart}
              onChange={handleChange}
            />
            <label htmlFor="endTime">To</label>
            <input
              type="time"
              name="timeEnd"
              id="endTime"
              value={inputs.timeEnd}
              onChange={handleChange}
            />
            <input type="submit" value="Done" className="btn long" />
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default AddEvent;

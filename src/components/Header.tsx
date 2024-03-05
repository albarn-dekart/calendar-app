import WeekState from "./WeekToggle";

interface Props {
  date: string;
  todayAction: () => void;
  prevWeek: () => void;
  nextWeek: () => void;
  weekAction: () => void;
  weekState: boolean;
}

const Header = ({
  date,
  todayAction,
  prevWeek,
  nextWeek,
  weekAction,
  weekState,
}: Props) => {
  return (
    <>
      <header id="header">
        <div className="dateChange">
          <button className="btn long" type="button" onClick={todayAction}>
            Today
          </button>
          <div className="arrows">
            <button className="btn light" type="button" onClick={prevWeek}>
              {"<"}
            </button>
            <button className="btn light" type="button" onClick={nextWeek}>
              {">"}
            </button>
          </div>
          <div className="title">{date}</div>
        </div>
        <div className="weekState">
          <WeekState state={weekState} action={weekAction}></WeekState>
        </div>
      </header>
    </>
  );
};

export default Header;

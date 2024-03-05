interface Props {
  state: boolean;
  action: () => void;
}

const WeekState = ({ state, action }: Props) => {
  return (
    <button className="btn long" type="button" onClick={action}>
      {state ? "Week" : "Day"}
    </button>
  );
};

export default WeekState;

import Calendar from "../component/calendar/calendar";

export default function Page() {
  const today = new Date();
  return (
    <div>
      <Calendar year={today.getFullYear()} month={today.getMonth()} today={today.getDate()}/>
    </div>
  );
};

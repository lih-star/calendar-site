"use client";
import { useEffect, useState } from "react";
import styles from "../../style/calendar.module.css";

interface CalendarProps {
  year: number;
  month: number;
  today: number;
}

export default function Calendar ({ year, month, today} : CalendarProps) {
  const [currentYear, setYear] = useState(year);
  const [currentMonth, setMonth] = useState(month);
  const [cells, setCells] = useState<(number | null)[]>([]);
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];


  // 이전 달로 이동
  const prevMonth = () => {
    if (currentMonth === 0) {
      setYear(currentYear - 1);
      setMonth(11);
    } else {
      setMonth(currentMonth - 1);
    }
  };

  // 다음 달로 이동
  const nextMonth = () => {
    if (currentMonth === 11) {
      setYear(currentYear + 1);
      setMonth(0);
    } else {
      setMonth(currentMonth + 1);
    }
  };

  // 날짜 클릭 시 캘린더 작성
  const writeCalendar = (yr: number, mo: number, dat: number | null) => {
    if (dat === null) return;
    location.href = `/events/${yr}-${mo + 1}-${dat}`;
  };

  useEffect(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    const newCells: (number | null)[] = [];

    // 빈 칸 채우기
    for (let i = 0; i < firstDay; i++) {
      newCells.push(null);
    }

    // 날짜 채우기
    for (let date = 1; date <= lastDate; date++) {
      newCells.push(date);
    }

    setCells(newCells);
  }, [currentYear, currentMonth]);

  return (
    <div>
      <div className={styles.titleBox}>
        <button onClick={prevMonth} className={styles.otherMonthButton}>◀</button>
        <h1 className={styles.title}>{currentYear}년 {currentMonth + 1}월</h1>
        <button onClick={nextMonth} className={styles.otherMonthButton}>▶</button>
      </div>
      <div className={styles.calendar}>
        {daysOfWeek.map((day) => (
          <div key={day} className={styles.header}>{day}</div>
        ))}
        {cells.map((date, idx) => (
          date === null ? <div key={idx}></div> : 
          <div onClick = {currentMonth > new Date().getMonth() && currentYear >= new Date().getFullYear() ||
                           currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() && date >= today ? () => writeCalendar(currentYear, currentMonth, date) : undefined}
                          key={idx} className={currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() && date === today ? styles.today : 
                                                currentMonth <= new Date().getMonth() && currentYear <= new Date().getFullYear() && date < today ? `${styles.day} ${styles.past}` : styles.day}>
            {date ?? ""} 
          </div>
        ))}
      </div>
    </div>
  );
};

// 캘린더 컴포넌트
"use client";
import { useEffect, useState } from "react";
import styles from "../../style/calendar.module.css";

export default function Calendar () {
  const [today, setToday] = useState<number | null>(null);
  const [currentYear, setYear] = useState<number | null>(null);
  const [currentMonth, setMonth] = useState<number | null>(null);
  const [cells, setCells] = useState<(number | null)[]>([]);
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  

  // 이전 달로 이동
  const prevMonth = () => {
    if (currentYear === null || currentMonth === null) return;

    if (currentMonth === 0) {
      setYear(currentYear - 1);
      setMonth(11);
    } else {
      setMonth(currentMonth - 1);
    }
  };

  // 다음 달로 이동
  const nextMonth = () => {
    if (currentYear === null || currentMonth === null) return;

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

  // 선택한 날짜가 오늘 인지 확인
  const isToday = (yr: number, mo: number, dat: number | null) => {
    if (dat === null) return false;
    return yr === new Date().getFullYear() && mo === new Date().getMonth() && dat === new Date().getDate();
  };

  // 선택한 날짜가 오늘 이후인지 확인
  const isPast = (yr: number, mo: number, dat: number | null) => {
    if (dat === null) return false;
    return yr > new Date().getFullYear() ||
          (yr === new Date().getFullYear() && mo > new Date().getMonth()) || 
          (yr === new Date().getFullYear() && mo === new Date().getMonth() && dat > new Date().getDate());
  };

  useEffect(() => {
    const now = new Date();
    setToday(now.getDate());
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  }, []);

  useEffect(() => {
    if (currentYear === null || currentMonth === null) return;

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

  if (currentYear === null || currentMonth === null || today === null) {
  return <div className={styles.calendar} aria-busy="true" />;
}

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
          date === null ? <div key={idx}></div> : // 조건 : 선택한 달이 실제달보다 크거나 선택한 년도가 실제년도와 같거나 크면 -> onclick 활성화, 클릭 가능 style 적용
          <div onClick = {isPast(currentYear, currentMonth, date+1) ? () => writeCalendar(currentYear, currentMonth, date) : undefined}
                          key={idx} className={isToday(currentYear, currentMonth, date) ? styles.today : 
                                                isPast(currentYear, currentMonth, date) ? styles.day : `${styles.day} ${styles.past}`}>
            {date ?? ""} 
          </div>
        ))}
      </div>
    </div>
  );
};

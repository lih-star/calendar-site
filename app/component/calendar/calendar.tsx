// 캘린더 컴포넌트
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../style/calendar.module.css";

export default function Calendar () {
  const router = useRouter();
  type Today = { y: number; m: number; d: number };
  const [today, setToday] = useState<Today | null>(null);
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
  const writeCalendar = (yr: number, mo: number, dat: number) => {
    router.push(`/events/${yr}-${mo + 1}-${dat}`);
  };

  // 선택한 날짜가 오늘 인지 확인
  const isToday = (yr: number, mo: number, dat: number) => {
    if (today === null) return false;
    return yr === today.y && mo === today.m && dat === today.d;
  };

  // 선택한 날짜가 오늘 이후인지 확인
  const isTodayOrAfter = (yr: number, mo: number, dat: number) => {
    if (today === null) return false;
    return yr > today.y ||
          (yr === today.y && mo > today.m) || 
          (yr === today.y && mo === today.m && dat >= today.d);
  };

  useEffect(() => {
    const now = new Date();
    setToday({ y: now.getFullYear(), m: now.getMonth(), d: now.getDate() });
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
          date === null ? <div key={idx}></div> :
          <div onClick = {isTodayOrAfter(currentYear, currentMonth, date) ? () => writeCalendar(currentYear, currentMonth, date) : undefined}
                          key={idx} className={isToday(currentYear, currentMonth, date) ? styles.today : 
                                                isTodayOrAfter(currentYear, currentMonth, date) ? styles.day : `${styles.day} ${styles.past}`}>
            {date} 
          </div>
        ))}
      </div>
    </div>
  );
};

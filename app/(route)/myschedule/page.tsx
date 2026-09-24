// 내 스케쥴 페이지
"use client";

import styles from "../../style/myschedule.module.css"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '../../component/auth/supabaseClient';
import { getUser } from '../../component/auth/auth'

export default function Page() {
    const [user,setUser] = useState<any>(null);
    const [events,setEvents] = useState<any[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);
    const router = useRouter();

    // 내 일정 삭제
    async function deleteEvent(id: number) {
      const confirmed = window.confirm("정말 삭제하시겠습니까?");
      if (!confirmed) {
        return;
      }

      const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
      
      if (error) {
        console.error('삭제 오류:', error.message);
      } else {
        alert('삭제하였습니다.');
        router.push('/');
      }
    };

    // 작성페이지 입장시 기간이 지난 일정 삭제 후 내 일정 가져오기
  useEffect(() => {
    // 이전 날짜 데이터 삭제
    const deleteOldRows = async (email: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .lt('date', new Date().toISOString().split('T')[0]) // 오늘 날짜보다 이전
        .eq('user_email', email);

      if (error) {
        console.error('삭제 오류:', error)
      }
    }

    // 이벤트 데이터 가져오기
    const fetchEvents = async () => {
      const { data: data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

      if (error) {
        return <div>Error: {error.message}</div>;
      } 
      else {
        setEvents(data);
      }
    }

    // 사용자 정보 가져오기
    const fetchUser = async () => {
      const user = await getUser();
      setUser(user);
      deleteOldRows(user?.email || '');
    }
    fetchUser();
    fetchEvents();
  }, []);

  return (
    <div className={styles.scheduleBox}>
      <h1 className={styles.title}>내 일정</h1>
      <ul className={styles.list}>
        {events?.map((event) => {
          const isDescription = openId === event.id;
        return (
          user?.email === event.user_email && (
          <div key={event.id} className={styles.scheduleContainer}>
            <li key={event.id} className={styles.scheduleList} onClick={() => setOpenId(isDescription ? null : event.id)}>
              <div className={styles.scheduleTitleBox}>
                <h2>{event.title}</h2>
                <p>{event.date.slice(0,10)}</p>
              </div>
              <div className={`${styles.scheduleDescriptionBox} ${isDescription ? styles.show : ""}`}>
                <p className={`${styles.description} ${isDescription ? styles.show : ""}`}>{event.description}</p>
                <button className={styles.deleteButton} onClick={() => deleteEvent(event.id)}>삭제</button>
              </div>
            </li>
          </div>
          )
        )})}
      </ul>
    </div>
  );
}

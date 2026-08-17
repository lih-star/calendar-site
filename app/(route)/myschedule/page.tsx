"use client";

import styles from "../../style/myschedule.module.css"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '../../component/auth/supabaseClient';

export default function Page() {
    const [user,setUser] = useState<any>(null);
    const [events,setEvents] = useState<any[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);
    const router = useRouter();

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

  useEffect(() => {
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

    const fetchUser = async () => {
      const user = await supabase.auth.getUser();
      setUser(user);
    }
    fetchEvents();
    fetchUser();
  }, []);
  return (
    <div className={styles.scheduleBox}>
      <h1 className={styles.title}>내 일정</h1>
      <ul className={styles.list}>
        {events?.map((event) => {
          const isDescription = openId === event.id;
        return (
          user.data.user?.email === event.user_email && (
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

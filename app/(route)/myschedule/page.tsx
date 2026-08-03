"use client";

import styles from "../../style/myschedule.module.css"
import { useEffect, useState } from "react";
import { supabase } from '../../component/auth/supabaseClient';

export default function Page() {
    const [user,setUser] = useState<any>(null);
    const [events,setEvents] = useState<any[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);

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

  console.log(user);
  return (
    <div className={styles.scheduleBox}>
      <h1 className={styles.title}>내 일정</h1>
      <ul className={styles.list}>
        {events?.map((event) => {
          const isDescription = openId === event.id;
        return (
          user.data.user?.email === event.user_email && (
          <li key={event.id} className={styles.scheduleList} onClick={() => setOpenId(isDescription ? null : event.id)}>
            <div className={styles.scheduleTitleBox}>
              <h2>{event.title}</h2>
              <p>{event.date.slice(0,10)}</p>
            </div>
            <p className={`${styles.description} ${isDescription ? styles.show : ""}`}>{event.description}</p>
          </li>
          )
        )})}
      </ul>
    </div>
  );
}

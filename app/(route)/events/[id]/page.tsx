//일정 작성 페이지

"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../component/auth/supabaseClient";
import styles from "../../../style/events.module.css";
import { useEffect, useState } from "react";

// Zod 스키마 정의
const eventSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  description: z.string().optional(),
});

type EventForm = z.infer<typeof eventSchema>;

export default function Page() {
  const router = useRouter();
  const Params = useParams();
  if(!Params.id) return;
  const id = Params.id;
  const [year, month, day] = id.toString().split('-');
  const [user, setUser] = useState<any>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
  });

  // 로그인 상태 확인 후 일정 작성
  const onSubmit = async (data: EventForm) => {
    if(user?.error) {
        alert("로그인이 필요한 서비스입니다.");
        router.push("/");
        return;
    }
    const { title, description } = data;
    const user_email = user.data.user.email;

    const { error } = await supabase.from("events").insert([
      {
        title,
        description,
        date: id.toString(),
        user_email,
      },
    ]);

    if (error) {
      alert("저장 실패: " + error.message);
    } else {
      alert("일정이 저장되었습니다!");
      router.push("/"); // 저장 후 캘린더 페이지로 이동
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await supabase.auth.getUser();
      setUser(user);
    }
    fetchUser();
  }, []);
  return (
    <div className={styles.eventsBox}>
      <h1>{year}년 {month}월 {day}일 일정 작성</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formBox}>
        <div className={styles.formTitle}>
          <label>일정이름 : </label>
          <input {...register("title")} />
        </div>

        <div className={styles.formDescription}>
          <label>내용 : </label>
          <textarea {...register("description")} />
        </div>

        <button className={styles.formButton} type="submit">
          저장하기
        </button>
        {errors.title && (
            <p className={styles.errorMessage}>{errors.title.message}</p>)}
      </form>
    </div>
  )
}

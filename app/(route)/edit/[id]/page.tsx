// 일정 수정 페이지

"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../component/auth/supabaseClient";
import styles from "../../../style/edit.module.css";

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

    const [date, setDate] = useState("");
    const [userEmail, setUserEmail] = useState("");

      const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm<EventForm>({
        resolver: zodResolver(eventSchema),
      });

    // 일정 수정
      const onSubmit = async (data: EventForm) => {
        if(userEmail === "") {
            alert("잘못된 접근입니다.");
            router.push("/");
            return;
        }

        const { title, description } = data;
    
        const { error } = await supabase
        .from("events")
        .update([
          {
            title,
            description,
          },
        ])
        .eq('id', id);
    
        if (error) {
          alert("수정 실패: " + error.message);
        } else {
          alert("일정이 수정되었습니다!");
          router.push("/"); // 수정 후 캘린더 페이지로 이동
        }
      };

    const loadData = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id);

      if (error) {
        console.error('불러오기 오류:', error.message);
      } else {
        setDate(data[0].date.slice(0, 10));
        setUserEmail(data[0].user_email);
        reset({
          title: data[0].title,
          description: data[0].description,
        });
      }
    }

    useEffect(() => {
        loadData();
    }, []);

    const [year, month, day] = date.split('-');
  return (
    <div className={styles.editBox}>
      <h1>{year}년 {month}월 {day}일 일정 수정</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.editFormBox}>
        <div className={styles.editFormTitle}>
          <label>일정이름 : </label>
          <input{...register("title")} />
        </div>

        <div className={styles.editFormDescription}>
          <label>내용 : </label>
          <textarea{...register("description")} />
        </div>

        <button className={styles.editFormButton} type="submit">
          저장하기
        </button>
        {errors.title && (
            <p className={styles.editErrorMessage}>{errors.title.message}</p>)}
      </form>
    </div>
  )
}
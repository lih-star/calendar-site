// 회원가입 페이지

'use client'

import { useState } from 'react'
import { signUp } from '../../component/auth/auth'
import GithubButton from '../../component/loginout/githubButton'
import styles from '../../style/signInOut.module.css'


export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  // 회원가입 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signUp(email, password)
      alert('계정 인증메일을 발송했습니다.')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원가입</h1>
      <form className={styles.formBox} onSubmit={handleLogin}>
        <input
          className={styles.input}
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.button} type="submit">
          가입하기
        </button>
        <GithubButton />
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
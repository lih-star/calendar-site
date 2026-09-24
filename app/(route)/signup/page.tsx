// 로그인 페이지

'use client'
import { useRouter} from 'next/navigation'
import { useState } from 'react'
import { signIn } from '../../component/auth/auth'
import GithubButton from '../../component/loginout/githubButton'
import styles from '../../style/signInOut.module.css'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();

  // 로그인 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password);
      alert('로그인 성공!')
      router.push('/');
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>로그인</h1>
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
          로그인
        </button>
      </form>
      <GithubButton/>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
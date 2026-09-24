import { supabase } from './supabaseClient'

// 로그인
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) throw error
  return data
}

//회원가입
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

// 로그아웃
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// 현재 로그인한 사용자 정보 가져오기
export async function getSession() {
  const { data, error }  = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

// 현재 로그인 유저 가져오기
export async function getUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

// 인증 상태 변경 감지, 로그인시 내비게이션 바 업데이트용
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const { data: subscription } = supabase.auth.onAuthStateChange(callback)
  return subscription
}

// GitHub로 회원가입
export async function signInUpWithGitHub() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: 'http://localhost:3000/'
    }
  })

  if (error) console.error(error)
}

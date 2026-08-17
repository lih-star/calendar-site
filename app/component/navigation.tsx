
"use client";
import { useEffect, useState } from 'react'
import { onAuthStateChange, signOut } from "../component/auth/auth"
import Link from "next/link"
import "../style/global.css"

export default function Navigation() {
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
    const subscription = onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, []);
  return (
    <header>
      {/* 왼쪽 메뉴 */}
      <nav>
        <Link href="/">Home</Link>
      </nav>

      {/* 오른쪽 메뉴 */}
        {user ?  
            <nav>
              <Link href="/myschedule">My Schedule</Link>
              <Link href="/" onClick={signOut}>Sign Out</Link>
            </nav>
            :
            <nav>
                <Link href="/signup">Sign Up</Link>
                <Link href="/signin">Sign In</Link>
            </nav>
        }
    </header>
  );
}

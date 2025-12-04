'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/store'
import { setUser, clearUser } from '@/store/slices/authSlice'

export default function SessionSync() {
  const { data: session, status } = useSession()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // map session.user to our Redux user shape
      dispatch(
        setUser({
          _id: (session.user as any)?._id ?? undefined,
          email: session.user.email ?? undefined,
          fullName: (session.user as any)?.fullName ?? session.user.name ?? undefined,
          isVerified: (session.user as any)?.isVerified ?? undefined,
        })
      )
    } else if (status === 'unauthenticated') {
      dispatch(clearUser())
    }
  }, [status, session, dispatch])

  return null
}

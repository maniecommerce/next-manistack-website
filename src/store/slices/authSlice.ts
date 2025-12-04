// store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type User = {
  _id?: string
  email?: string
  fullName?: string
  isVerified?: boolean
}

type AuthState = {
  user: User | null
  status: 'idle' | 'loading' | 'authenticated'
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
      state.status = 'authenticated'
    },
    clearUser(state) {
      state.user = null
      state.status = 'idle'
    },
    setLoading(state) {
      state.status = 'loading'
    },
  },
})

export const { setUser, clearUser, setLoading } = authSlice.actions
export default authSlice.reducer

import { createSlice } from '@reduxjs/toolkit'
import { ACCESS_TOKEN } from '@shared/lib/constants/auth'
import { getStorageData } from '@shared/lib/storage'
import { jwtDecode } from 'jwt-decode'
const checkAuth = () => Boolean(getStorageData(ACCESS_TOKEN))

const getUserRole = () => {
  try {
    const token = getStorageData(ACCESS_TOKEN)
    if (!token) return null
    const decodedToken = jwtDecode(token)

    return decodedToken.role || null
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

const getUserData = () => {
  try {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4ZjQyMDk2NC1lZGJmLTQ0ZTYtYWMwYi0wOTZjNTliZGYyZGIiLCJyb2xlIjpbInRlYWNoZXIiXSwibGFzdE5hbWUiOiJNaW5oIiwiZmlyc3ROYW1lIjoiS2hhbmgiLCJlbWFpbCI6ImtoYW5oQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQzNDk2MjcyLCJleHAiOjE3NDM1ODI2NzJ9.Y-us3YobP1hhZbnLUzD5BG4dmEGKSCLGQnDdHkz48-E'
    if (!token) return null
    const decodedToken = jwtDecode(token)

    return decodedToken || null
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}
const initialState = {
  isAuth: checkAuth(),
  role: getUserRole(),
  user: getUserData()
}
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.isAuth = true
      state.user = getUserData()
    },
    logout(state) {
      state.isAuth = false
      state.role = null
      state.user = null
    },
    updateRole(state) {
      state.role = getUserRole()
    }
  }
})
const { reducer, actions } = authSlice
export const { logout, login } = actions
export default reducer

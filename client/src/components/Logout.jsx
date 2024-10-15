import React from 'react'
import { useAuth } from './AuthProvider'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const auth = useAuth()
    const navigate = useNavigate()
    
  return (
    <div>
      <h1>Logout</h1>
      <button onClick={() => {
        auth.logOut()
        navigate('/')
      }}>Log out</button>
    </div>
  )
}

export default Logout

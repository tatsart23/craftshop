import React from 'react'
import { useAuth } from './AuthProvider'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const auth = useAuth()
    const navigate = useNavigate()
    
  return (
    <div>
      <h1>Kirjaudu ulos</h1>
      <button className='logout-button' onClick={() => {
        auth.logOut()
        navigate('/')
      }}>Kirjaudu ulos</button>
    </div>
  )
}

export default Logout

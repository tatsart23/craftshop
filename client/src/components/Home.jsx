import React from 'react'
import { useAuth } from './AuthProvider'

const Home = () => {
  const auth = useAuth();
  return (
    <div>
      <h1>Home</h1>
      
    {auth.token ? (
      <>
        <p>Welcome {auth.user} </p>
        <button onClick={auth.logOut}>Log out</button>
      </>
    ) : (
      <p>Welcome</p>
    )}

      

      
    </div>
  )
}

export default Home

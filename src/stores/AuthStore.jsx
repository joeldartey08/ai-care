import {  createContext, useState } from "react";


export const AuthContent = createContext(null)



function AuthStore({children}) {
    const [user, setUser] = useState()
    const [isAuthenticated, setAuthenticated] = useState(false)
    
  return (
<AuthContent.Provider value={{user, setUser, isAuthenticated, setAuthenticated}}>
    {children}
</AuthContent.Provider>
    
   
  )
}

export default AuthStore
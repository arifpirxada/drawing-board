import { useMemo } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useEffect } from 'react';
import { authApi } from "../features/auth/auth";

const AuthContext = createContext()

export const AuthStateProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const initAuth = async () => {
            try {

                const userData = await authApi.authenticateUser();

                if (isMounted && userData && userData.id && userData.email && userData.name) {
                    setIsLoggedIn(true)
                    setUser(userData)
                }

            } catch (err) {
                console.log("Could not authenticate user")
                setLoading(false)

                authApi.logoutUser()
                if (isMounted) {
                    setUser(null);
                    setIsLoggedIn(false);
                }
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        initAuth();

        return () => { isMounted = false; };

    }, [])

    const contextValue = useMemo(() => ({
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser
    }), [isLoggedIn, user])

    return (
        <AuthContext.Provider value={ contextValue }>
            { children }
        </AuthContext.Provider>
    )

}

export default AuthContext
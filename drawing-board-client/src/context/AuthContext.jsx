import { useMemo } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useEffect } from 'react';
import { authApi } from "../features/auth/auth";
import AnimatedLogo from "../components/partials/AnimatedLogo";

const AuthContext = createContext()

export const AuthStateProvider = ({ children }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const initAuth = async () => {
            try {

                const userData = await authApi.authenticateUser();

                if (isMounted && userData?.id && userData?.email && userData?.name) {
                    setIsLoggedIn(true)
                    setUser(userData)
                }

            } catch (err) {
                console.log("Could not authenticate user")

                authApi.logoutUser()
                if (isMounted) {
                    setUser(null);
                    setIsLoggedIn(false);
                }
            } finally {
                if (isMounted) setIsLoading(false)
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

    if (isLoading) {
        return (
            <AnimatedLogo />
        );
    }

    return (
        <AuthContext.Provider value={ contextValue }>
            { children }
        </AuthContext.Provider>
    )

}

export default AuthContext
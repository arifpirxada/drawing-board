import { authApi } from "../features/auth/auth"
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Home = () => {

    const { isLoggedIn, setIsLoggedIn, setUser } = useContext(AuthContext);

    const navigate = useNavigate()

    const logout = () => {
        authApi.logoutUser()

        setUser(null)
        setIsLoggedIn(false)
        navigate('/login')
    }

    return (
        <div className="home-page text-white">
            <div className='p-4'>
                <nav>
                    <ul className="flex gap-4 justify-center">
                        { isLoggedIn && <li><Link to="/dashboard">Dashboard</Link></li> }
                        { isLoggedIn && <li onClick={ logout } className='cursor-pointer'>Logout</li> }
                    </ul>
                </nav>
            </div>
            <div className="my-8">
                <h1 className='text-center text-2xl text-white font-bold'>Welcome to Drawing Board</h1>
            </div>
        </div>
    )
}

export default Home
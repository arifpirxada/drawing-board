import { useNavigate, useLocation, Link } from "react-router-dom";
import Users from "./functionalify-components/Users";
import Chat from "./functionalify-components/Chat";
import UserChat from "./functionalify-components/UserChat";

function Functionality() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleParentClick = () => {
        navigate("/")
    };

    const handleChildClick = (event) => {
        event.stopPropagation();
    };

    return (
        <>
            <div id="default-modal" onClick={handleParentClick} className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div onClick={handleChildClick} className="relative p-4 w-full max-w-2xl max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">


                        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                            <li className="me-2">
                                <Link to="/view" aria-current="page" className={`inline-block p-4 ${location.pathname === '/view'  || location.pathname == '/view/user'? 'text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500' : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'}`}>Chat</Link>
                            </li>
                            <li className="me-2">
                                <Link to="/view/chat" className={`inline-block p-4 rounded-t-lg ${location.pathname === '/view' || location.pathname == '/view/user'? 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300' : 'text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500'}`}>Group</Link>
                            </li>
                            <button type="button" onClick={() => navigate("/")} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlnsXlink="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </ul>

                        {location.pathname === '/view' ? <Users /> : location.pathname === '/view/chat'? <Chat /> : <UserChat />}

                    </div>
                </div>
            </div>
        </>

    )
}

export default Functionality;
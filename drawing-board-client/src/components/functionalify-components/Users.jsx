import { useContext } from "react";
import SocketContext from "../../context/SocketContext";

function Users() {

    const { connectedUsers } = useContext(SocketContext);

    return (
        <>
            <div className="p-4 overflow-y-scroll no-scrollbar md:p-5 max-h-96">
                <ul className="my-3 space-y-3">
                    { connectedUsers.length > 0 && connectedUsers.map((user) => (
                        <li key={ user.userId }>
                            <p className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                <img src="/img/default-user.png" alt="" className="h-8" />
                                <span className="flex-1 ms-3 whitespace-nowrap">{ user.userEmail }</span>
                            </p>
                        </li>
                    )) }
                    { connectedUsers.length == 0 && <p className="text-center text-gray-500">No collaborators connected</p> }
                </ul>
            </div>


            <div className="p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">


                <form className="w-full">
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlnsXlink="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search" id="default-search" className="block w-full outline-none p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
                        <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                    </div>
                </form>


            </div>
        </>
    )
}

export default Users
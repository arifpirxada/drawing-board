import { createContext, useState } from "react";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {

    const [connectedUsers, setConnectedUsers] = useState([]);

    return (
        <SocketContext.Provider value={ { connectedUsers, setConnectedUsers } }>
            { children }
        </SocketContext.Provider>
    )
}

export default SocketContext;
export { SocketProvider };
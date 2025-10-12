import Controls from "../components/Controls"
import Editor from "../components/Editor"
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Options from "../components/Options";
import fileApi from "../features/files/fileApi";
import { useParams } from 'react-router-dom';
import { useState } from "react";
import { useRef } from "react";
import AnimatedLogo from "../components/partials/AnimatedLogo";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import useSocket from "../features/socketio/useSocket";
import SocketContext from "../context/SocketContext";
import { set } from "react-hook-form";
import socket from "../socket";



function FilePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id: fileId } = useParams();

    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useContext(AuthContext);
    const { setConnectedUsers } = useContext(SocketContext);

    const { emit, on, off } = useSocket();

    useEffect(() => {
        // for view modal
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'q') {
                if (location.pathname == "/view") {
                    navigate("/")
                } else {
                    navigate("/view")
                }
            } else if (event.ctrlKey && event.shiftKey && event.key == 'X') {
                if (location.pathname == "/view/chat") {
                    navigate("/")
                } else {
                    navigate("/view/chat")
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [location, navigate]);


    // Fetch file data

    const alertShown = useRef(false);

    useEffect(() => {

        const fetchFileData = async (fileId) => {
            setIsLoading(true);
            try {
                const res = await fileApi.getSingleFile(fileId)

                if (res?.success && res?.file) {
                    setFile(res.file);
                } else {
                    throw new Error('File not found or invalid response');
                }
            } catch (error) {
                console.error('Error fetching file data:', error);

                if (!alertShown.current) {
                    alert('Failed to fetch file data. Redirecting to Dashboard.');
                    alertShown.current = true;
                }

                navigate('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };


        fetchFileData(fileId);

    }, [fileId]);


    // Authenticate file access and connect to socket room

    useEffect(() => {

        if (!file || !user) return;

        const joinRoom = () => {
            emit('join_room', { room: file.id, userId: user.id, userEmail: user.email });
        }

        const handleUserJoined = ({ room, userId, userEmail }) => {
            setConnectedUsers((prev) => {
                if (prev.find(u => u.userId === userId)) {
                    return prev; // User already in the list
                }
                return [...prev, { userId, userEmail }];
            });
        };

        const handleCurrentUsers = ({ room, users }) => {
            setConnectedUsers(users);
        }

        const handleUserLeft = ({ room, userId }) => {
            setConnectedUsers((prev) => prev.filter(u => u.userId !== userId));
        }

        const authenticateFileAccess = () => {
            if (file) {
                if (file.access === 'public') {
                    // Public file, allow access
                    joinRoom();
                    return;
                } else if (file.access === 'private') {
                    // Private file, check if user is the owner or collaborator
                    if (user?.id && user.id === file.owner || file.collaborators.includes(user?.id)) {
                        // Add user to the socket room
                        joinRoom();

                        return;
                    } else {
                        // alert('You do not have access to this private file. Redirecting to Dashboard.');
                        navigate('/dashboard');
                    }
                } else {
                    // Unknown access type
                    // alert('Unknown file access type. Redirecting to Dashboard.');
                    navigate('/dashboard');
                }
            }
        }

        authenticateFileAccess();

        on('user_joined', handleUserJoined);
        on('current_users', handleCurrentUsers);
        on('user_left', handleUserLeft);

        return () => {
            off('user_joined', handleUserJoined);
            off('current_users', handleCurrentUsers);
            off('user_left', handleUserLeft);
        };
    }, [file])


    if (isLoading) {
        return (
            <AnimatedLogo />
        );
    }

    return (
        <>
            <Controls fileId={ file.id } userId={ user.id } />
            <Editor fileId={ file.id } userId={ user.id } />
            <Options />
        </>
    )
}

export default FilePage

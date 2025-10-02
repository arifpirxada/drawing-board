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



function FilePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id: fileId } = useParams();

    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useContext(AuthContext);

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


    // Authenticate file access

    useEffect(() => {
        const authenticateFileAccess = () => {
            if (file) {
                console.log("file: ", file)

                if (file.access === 'public') {
                    // Public file, allow access
                    return;
                } else if (file.access === 'private') {
                    // Private file, check if user is the owner or collaborator
                    if (user?.id && user.id === file.owner || file.collaborators.includes(user?.id)) {
                        return;
                    } else {
                        alert('You do not have access to this private file. Redirecting to Dashboard.');
                        navigate('/dashboard');
                    }
                } else {
                    // Unknown access type
                    alert('Unknown file access type. Redirecting to Dashboard.');
                    navigate('/dashboard');
                }
            }
        }

        authenticateFileAccess();
    }, [file])


    if (isLoading) {
        return (
            <AnimatedLogo />
        );
    }

    return (
        <>
            <Controls />
            <Editor />
            <Options />
        </>
    )
}

export default FilePage

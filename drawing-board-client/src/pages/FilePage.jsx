import Controls from "../components/Controls"
import Editor from "../components/Editor"
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Options from "../components/Options";


function FilePage() {
    const navigate = useNavigate();
    const location = useLocation();
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

    return (
        <>
            <Controls />
            <Editor />
            <Options />
        </>
    )
}

export default FilePage

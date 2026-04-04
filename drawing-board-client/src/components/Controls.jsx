import { useContext, useRef, useState } from "react"
import StateContext from "../context/StateContext"
import { useNavigate } from "react-router-dom";
import useSocket from "../features/socketio/useSocket";
import axios from "../lib/axios";
import UploadLoading from "./Filepage/UploadLoading";

/* ── Tooltip wrapper ── */
const Tip = ({ label, children }) => (
    <div className="tool-tip-wrap">
        {children}
        <span className="tool-tip">{label}</span>
    </div>
);

/* ── Single tool button ── */
const ToolBtn = ({ active, onClick, label, children }) => (
    <Tip label={label}>
        <button
            onClick={onClick}
            className={`tool-btn${active ? " tool-btn--active" : ""}`}
            aria-label={label}
            type="button"
        >
            {children}
        </button>
    </Tip>
);

function Controls({ fileId, userId }) {
    const navigate = useNavigate();

    const {
        mouse,
        isPanning, setIsPanning,
        setIsPen, isPen,
        setEraser, eraser,
        line, arrowLine, rectangle, triangle, circle,
        setLine, setArrowLine, setRectangle, setTriangle, setCircle,
        isMouse, setIsMouse,
        setShapes,
        setIsEditing,
        gridView, setGridView
    } = useContext(StateContext);

    const { emit } = useSocket();
    const eraserRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [collapsed, setCollapsed] = useState(true);

    const resetAllTools = () => {
        setIsPen(false); setIsPanning(false); setEraser(false);
        setLine(false); setArrowLine(false); setRectangle(false);
        setTriangle(false); setCircle(false); setIsMouse(false);
    };

    const changeControl = (cmd) => {
        resetAllTools();
        const map = {
            pen: () => setIsPen(true), panning: () => setIsPanning(true),
            eraser: () => setEraser(true), line: () => setLine(true),
            arrowLine: () => setArrowLine(true), rectangle: () => setRectangle(true),
            triangle: () => setTriangle(true), circle: () => setCircle(true),
            mouse: () => setIsMouse(true),
        };
        map[cmd]?.();
    };

    const addText = () => { resetAllTools(); setIsEditing(true); };

    const handleImages = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const id = `image-${userId}-${Date.now()}`;
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post(`/files/${fileId}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (!res.data?.url) { alert("Could not upload file. Please try later"); return; }
            const imageUrl = res.data.url;
            const imageName = res.data.secure_filename;
            const image = new Image();
            image.onload = () => setShapes(prev => [...prev, { type: "image", id, userId, image, url: imageUrl }]);
            image.src = imageUrl;
            emit('add_image', { room: fileId, userId, id, name: imageName });
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
            resetAllTools();
        }
    };

    /* Hide/show eraser icon when cursor enters/leaves panel */
    const handleMouseEnter = () => {
        if (eraser && eraserRef.current) eraserRef.current.classList.add('hidden');
    };
    const handleMouseLeave = () => {
        if (eraser && eraserRef.current) eraserRef.current.classList.remove('hidden');
    };

    /* Actual panel widths — tab offset must match */
    const PANEL_EXPANDED = 168;
    const PANEL_COLLAPSED = 52;
    const panelWidth = collapsed ? PANEL_COLLAPSED : PANEL_EXPANDED;

    return (
        <>

            <img
                ref={eraserRef}
                style={{
                    position: 'fixed',
                    left: mouse.x - 15,
                    top: mouse.y - 13,
                    zIndex: 9999,
                    pointerEvents: 'none',
                    width: '24px',
                }}
                className={!eraser ? 'hidden' : ''}
                src="/eraser-icon.svg"
                alt=""
                aria-hidden="true"
            />

            <button
                className="tool-panel__collapse-tab"
                style={{ left: `${12 + panelWidth}px` }}
                onClick={() => setCollapsed(p => !p)}
                aria-label={collapsed ? "Expand toolbar" : "Collapse toolbar"}
                type="button"
            >
                <svg
                    width="12" height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {collapsed
                        ? <polyline points="9 18 15 12 9 6" />
                        : <polyline points="15 18 9 12 15 6" />
                    }
                </svg>
            </button>

            {/* ── Main tool panel ── */}
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`tool-panel${collapsed ? " tool-panel--collapsed" : ""}`}
            >
                {/* Logo badge at top */}
                <div className="tool-panel__header">
                    <div className="tool-panel__logo">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                stroke="#cc55e8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>

                <div className="tool-divider" />

                {/* SELECT / PEN / PAN */}
                <div className="tool-group">
                    <ToolBtn active={isMouse} onClick={() => changeControl("mouse")} label="Select">
                        <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
                            <path d="M9 2.594L9 28.156l1.656-1.375 4.031-3.375 2.031 4.031.438.907.906-.47 3.094-1.593.875-.438-.438-.907-1.843-3.625 5.062-.625 2.031-.25-1.437-1.437L10.719 4.281z M11 7.438l11.563 11.53-4.5.532-1.406.187.656 1.282 2.063 4L17 25.657l-2.156-4.313-.594-1.125-.969.813L11 23.844z" />
                        </svg>
                        {!collapsed && <span className="tool-btn__label">Select</span>}
                    </ToolBtn>

                    <ToolBtn active={isPen} onClick={() => changeControl("pen")} label="Pen">
                        <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
                            <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7.8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3z" />
                        </svg>
                        {!collapsed && <span className="tool-btn__label">Pen</span>}
                    </ToolBtn>

                    <ToolBtn active={isPanning} onClick={() => changeControl("panning")} label="Pan">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 13v-7.5a1.5 1.5 0 0 1 3 0v6.5M11 5.5v-2a1.5 1.5 0 1 1 3 0v8.5M14 5.5a1.5 1.5 0 0 1 3 0v6.5M17 7.5a1.5 1.5 0 0 1 3 0v8.5a6 6 0 0 1-6 6h-2h.208a6 6 0 0 1-5.012-2.7 69.74 69.74 0 0 1-.196-.3c-.312-.479-1.407-2.388-3.286-5.728a1.5 1.5 0 0 1 .536-2.022 1.867 1.867 0 0 1 2.28.28l1.47 1.47" />
                        </svg>
                        {!collapsed && <span className="tool-btn__label">Pan</span>}
                    </ToolBtn>
                </div>

                <div className="tool-divider" />

                {/* ERASER */}
                <div className="tool-group">
                    <ToolBtn active={eraser} onClick={() => changeControl("eraser")} label="Eraser">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 20H7L3 16l10-10 7 7-2.5 2.5" /><path d="M6.0001 10.0001L4 12" />
                        </svg>
                        {!collapsed && <span className="tool-btn__label">Eraser</span>}
                    </ToolBtn>
                </div>

                <div className="tool-divider" />

                {/* SHAPES */}
                <div className="tool-group">
                    <ToolBtn active={arrowLine} onClick={() => changeControl("arrowLine")} label="Arrow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" /><line x1="15" y1="16" x2="19" y2="12" /><line x1="15" y1="8" x2="19" y2="12" />
                        </svg>
                        {!collapsed && <span className="tool-btn__label">Arrow</span>}
                    </ToolBtn>

                    <ToolBtn active={line} onClick={() => changeControl("line")} label="Line">
                        <svg width="16" height="16" viewBox="0 0 20 20"><line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        {!collapsed && <span className="tool-btn__label">Line</span>}
                    </ToolBtn>

                    <ToolBtn active={rectangle} onClick={() => changeControl("rectangle")} label="Rectangle">
                        <svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="1" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" rx="1" /></svg>
                        {!collapsed && <span className="tool-btn__label">Rectangle</span>}
                    </ToolBtn>

                    <ToolBtn active={triangle} onClick={() => changeControl("triangle")} label="Triangle">
                        <svg width="16" height="16" viewBox="0 0 16 16"><polygon points="8,1 15,15 1,15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                        {!collapsed && <span className="tool-btn__label">Triangle</span>}
                    </ToolBtn>

                    <ToolBtn active={circle} onClick={() => changeControl("circle")} label="Circle">
                        <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
                        {!collapsed && <span className="tool-btn__label">Circle</span>}
                    </ToolBtn>
                </div>

                <div className="tool-divider" />

                {/* INSERT */}
                <div className="tool-group">
                    <Tip label="Image">
                        <label htmlFor="drawing-image" className="tool-btn" aria-label="Upload image">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
                                <path d="M12.5 6.667h.01M4.91 2.625h10.18a2.284 2.284 0 0 1 2.285 2.284v10.182a2.284 2.284 0 0 1-2.284 2.284H4.909a2.284 2.284 0 0 1-2.284-2.284V4.909a2.284 2.284 0 0 1 2.284-2.284Z" />
                                <path d="m3.333 12.5 3.334-3.333c.773-.745 1.726-.745 2.5 0l4.166 4.166" />
                                <path d="m11.667 11.667.833-.834c.774-.744 1.726-.744 2.5 0l1.667 1.667" />
                            </svg>
                            {!collapsed && <span className="tool-btn__label">Image</span>}
                            <input type="file" onChange={handleImages} name="drawing-image" className="hidden" id="drawing-image" />
                        </label>
                    </Tip>

                    <ToolBtn onClick={addText} label="Text">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="20" x2="7" y2="20" /><line x1="14" y1="20" x2="21" y2="20" />
                            <line x1="6.9" y1="15" x2="13.8" y2="15" /><line x1="10.2" y1="6.3" x2="16" y2="20" />
                            <polyline points="5 20 11 4 13 4 20 20" />
                        </svg>
                        {!collapsed && <span className="tool-btn__label">Text</span>}
                    </ToolBtn>
                </div>

                <div className="tool-divider" />

                {/* VIEW */}
                <div className="tool-group">
                    <ToolBtn active={gridView} onClick={() => setGridView(p => !p)} label="Grid">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                        {!collapsed && <span className="tool-btn__label">Grid</span>}
                    </ToolBtn>

                    <ToolBtn onClick={() => navigate(`/files/${fileId}/collaborators`)} label="Collaborators">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        {!collapsed && <span className="tool-btn__label">Users</span>}
                    </ToolBtn>
                </div>

                {uploading && <UploadLoading />}
            </div>
        </>
    );
}

export default Controls;
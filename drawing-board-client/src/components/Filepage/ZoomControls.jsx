const ZoomControls = ({ stageRef, stageScale, setStageScale, setStagePos }) => {

    const zoomIn = () => {
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const newScale = Math.min(2.5, oldScale + 0.25);

        stage.scale({ x: newScale, y: newScale });
        setStageScale(newScale);
    };

    const zoomOut = () => {
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const newScale = Math.max(0.75, oldScale - 0.25);

        stage.scale({ x: newScale, y: newScale });
        setStageScale(newScale);
    };

    const resetZoom = () => {
        const stage = stageRef.current;
        stage.scale({ x: 1, y: 1 });
        stage.position({ x: 0, y: 0 });
        setStageScale(1);
        setStagePos({ x: 0, y: 0 });
    };

    return (
        <div className="zoom-bar">
            <button onClick={ zoomOut } className="zoom-btn" aria-label="Zoom out" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
                </svg>
            </button>
            <span className="zoom-scale">{ Math.round(stageScale * 100) }%</span>
            <button onClick={ zoomIn } className="zoom-btn" aria-label="Zoom in" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                </svg>
            </button>
            <div className="zoom-divider" />
            <button onClick={ resetZoom } className="zoom-btn zoom-btn--reset" aria-label="Reset zoom" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.2" />
                </svg>
            </button>
        </div>
    )
};

export default ZoomControls;
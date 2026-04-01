import { useContext, useEffect } from "react";
import StateContext from "../context/StateContext"

/* ── Stroke thickness option ── */
const StrokeSwatch = ({ width, active, onClick }) => (
    <button
        onClick={onClick}
        className={`stroke-swatch${active ? " stroke-swatch--active" : ""}`}
        aria-label={`Stroke width ${width}`}
        type="button"
    >
        <span style={{ height: `${Math.min(width, 5)}px` }} className="stroke-swatch__bar" />
    </button>
);

/* ── Color circle ── */
const ColorDot = ({ c, active, onClick, style = {} }) => (
    <button
        onClick={onClick}
        className={`color-dot${active ? " color-dot--active" : ""}`}
        style={{ background: c, ...style }}
        aria-label={`Color ${c}`}
        type="button"
    />
);



function Options() {
    const {
        setColor, isPen, isPanning, color,
        strokeColor, bgColor,
        setStrokeColor, setBgColor,
        setLineWidth, lineWidth,
        strokeWidth, setStrokeWidth,
        eraser, line, arrowLine, rectangle, triangle, circle,
        isMouse, isEditing,
        textFont, setTextFont,
        textFontSize, setTextFontSize,
    } = useContext(StateContext);

    const invisible = eraser || isMouse || isPanning;

    if (invisible) return null;

    return (
        <div className="options-bar">
            {/* ── Pen options ── */}
            {isPen && (
                <div className="options-group">
                    <span className="options-label">Color</span>
                    <div className="options-row">
                        <ColorDot c="#ffffff" active={color === "white"}  onClick={() => setColor("white")} />
                        <ColorDot c="#facc15" active={color === "yellow"} onClick={() => setColor("yellow")} />
                        <div className="color-picker-wrap">
                            <input type="color" value={color} id="color-option-pen"
                                className="color-picker-input"
                                onChange={e => setColor(e.target.value)} />
                            <label htmlFor="color-option-pen" className="color-dot color-dot--picker" title="Custom color">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                                    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                                    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                                    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.476-1.11-.29-.273-.471-.67-.471-1.102 0-.92.749-1.648 1.671-1.648h1.97c3.028 0 5.487-2.458 5.487-5.488C21.833 6.244 17.417 2 12 2z" />
                                </svg>
                            </label>
                        </div>
                    </div>
                    <div className="options-divider" />
                    <span className="options-label">Width</span>
                    <div className="options-row">
                        <StrokeSwatch width={2}  active={lineWidth === 2}  onClick={() => setLineWidth(2)}  />
                        <StrokeSwatch width={5}  active={lineWidth === 5}  onClick={() => setLineWidth(5)}  />
                        <StrokeSwatch width={10} active={lineWidth === 10} onClick={() => setLineWidth(10)} />
                    </div>
                </div>
            )}

            {/* ── Shape options ── */}
            {(line || arrowLine || rectangle || triangle || circle) && (
                <div className="options-group">
                    <span className="options-label">Stroke</span>
                    <div className="options-row">
                        <div className="color-picker-wrap">
                            <input type="color" value={strokeColor} id="color-option-stroke"
                                className="color-picker-input"
                                onChange={e => setStrokeColor(e.target.value)} />
                            <label htmlFor="color-option-stroke" className="color-dot color-dot--picker" title="Stroke color">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.476-1.11-.29-.273-.471-.67-.471-1.102 0-.92.749-1.648 1.671-1.648h1.97c3.028 0 5.487-2.458 5.487-5.488C21.833 6.244 17.417 2 12 2z" />
                                </svg>
                            </label>
                        </div>
                        {(!line && !arrowLine) && (
                            <>
                                <div className="options-divider options-divider--v" />
                                <span className="options-label">BG</span>
                                
                                <button type="button" 
                                    className={`color-dot${bgColor === "transparent" ? " color-dot--active" : ""}`}
                                    onClick={() => setBgColor("transparent")}
                                    title="No color"
                                    style={{ 
                                        background: "transparent", 
                                        display: "flex", 
                                        justifyContent: "center", 
                                        alignItems: "center" 
                                    }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round">
                                        <line x1="2" y1="22" x2="22" y2="2" />
                                    </svg>
                                </button>

                                <div className="color-picker-wrap">
                                    <input type="color" value={bgColor === "transparent" ? "#ffffff" : bgColor} id="color-option-background"
                                        className="color-picker-input"
                                        onChange={e => setBgColor(e.target.value)} />
                                    <label htmlFor="color-option-background" className="color-dot color-dot--picker color-dot--fill" title="Fill color">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                            <path d="M19 11l-8-8-8.5 8.5a5.5 5.5 0 0 0 7.78 7.78L19 11z" />
                                            <path d="M20 16.2A2.5 2.5 0 0 1 22 19a2.5 2.5 0 0 1-5 0c0-.83.4-1.58 1-2.05" />
                                        </svg>
                                    </label>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="options-divider" />
                    <span className="options-label">Width</span>
                    <div className="options-row">
                        <StrokeSwatch width={2}  active={strokeWidth === 2}  onClick={() => setStrokeWidth(2)}  />
                        <StrokeSwatch width={5}  active={strokeWidth === 5}  onClick={() => setStrokeWidth(5)}  />
                        <StrokeSwatch width={10} active={strokeWidth === 10} onClick={() => setStrokeWidth(10)} />
                    </div>
                </div>
            )}

            {/* ── Text options ── */}
            {isEditing && (
                <div className="options-group">
                    <span className="options-label">Color</span>
                    <div className="options-row">
                        <ColorDot c="#ffffff" active={color === "white"}  onClick={() => setColor("white")} />
                        <ColorDot c="#facc15" active={color === "yellow"} onClick={() => setColor("yellow")} />
                        <div className="color-picker-wrap">
                            <input type="color" value={color} id="color-option-text"
                                className="color-picker-input"
                                onChange={e => setColor(e.target.value)} />
                            <label htmlFor="color-option-text" className="color-dot color-dot--picker" title="Custom color">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.476-1.11-.29-.273-.471-.67-.471-1.102 0-.92.749-1.648 1.671-1.648h1.97c3.028 0 5.487-2.458 5.487-5.488C21.833 6.244 17.417 2 12 2z" />
                                </svg>
                            </label>
                        </div>
                    </div>
                    <div className="options-divider" />
                    <span className="options-label">Font</span>
                    <div className="options-row gap-2">
                        <div className="select-wrap">
                            <select onChange={e => setTextFont(e.target.value)} value={textFont}
                                id="select-font" className="options-select">
                                <option value="Handlee">Handlee</option>
                                <option value="Arial">Arial</option>
                                <option value="Verdana">Verdana</option>
                            </select>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>
                        <div className="select-wrap">
                            <select onChange={e => setTextFontSize(e.target.value)} value={textFontSize}
                                id="select-font-size" className="options-select">
                                <option value="12">12</option><option value="16">16</option>
                                <option value="24">24</option><option value="32">32</option>
                                <option value="48">48</option>
                            </select>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Options;
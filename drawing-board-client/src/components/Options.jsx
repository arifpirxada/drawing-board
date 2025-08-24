import { useContext, useEffect } from "react";
import StateContext from "../context/StateContext"

function Options() {

    const {
        setColor,
        isPen, isPanning,
        color,
        strokeColor,
        bgColor,
        setStrokeColor,
        setBgColor,
        setLineWidth,
        lineWidth,
        strokeWidth,
        setStrokeWidth,
        eraser,
        line,
        arrowLine,
        rectangle,
        triangle,
        circle,
        isMouse,
        isEditing,
        textFont, setTextFont,
        textFontSize, setTextFontSize,
    } = useContext(StateContext);

    const changeColor = (clr) => {
        setColor(clr)
    }

    const changeStrokeColor = (clr) => {
        setStrokeColor(clr)
    }

    const changeBgColor = (clr) => {
        setBgColor(clr)
    }

    const handleLineWidth = (width) => {
        setLineWidth(width)
    }

    const handleStrokeWidth = (width) => {
        setStrokeWidth(width)
    }


    return (
        <div className={ `${(eraser || isMouse || isPanning) && 'hidden'} controls-container z-[1000] h-fit left-[43%] top-4 rounded-2xl fixed transition-all p-3 flex justify-center items-center gap-4` }>

            { isPen && <div className="mouse-options flex">
                <div className="color flex justify-center gap-3 items-center">
                    <div onClick={ () => changeColor("white") } className={ `${color == 'white' && 'scale-125'} transform w-4 h-4 cursor-pointer rounded-full bg-white hover:scale-125 transition-all` }></div>
                    <div onClick={ () => changeColor("yellow") } className={ `${color == 'yellow' && 'scale-125'} transform w-4 h-4 cursor-pointer rounded-full bg-yellow-300 hover:scale-125 transition-all` }></div>
                    <div>
                        <input
                            type="color"
                            value={ color }
                            id="color-option-pen"
                            className="cursor-pointer invisible absolute rounded-full bg-[#65e222] outline-none"
                            onChange={ (e) => changeColor(e.target.value) }
                        />
                        <label htmlFor="color-option-pen">
                            <img src="/color-choose.png" className="w-6 hover:scale-110 cursor-pointer" alt="Choose color icon" />
                        </label>
                    </div>
                </div>
                <div className="gap-4 items-center cursor-pointer h-5 ml-4 flex">
                    <div onClick={ () => handleLineWidth(2) } className={ `${lineWidth == 2 && 'bg-[#5b5a6d]'} h-full flex items-center rounded-sm p-1 hover:bg-[#5b5a6d]` }>
                        <span className="h-1 w-6 rounded-full block bg-slate-200"></span>
                    </div>
                    <div onClick={ () => handleLineWidth(5) } className={ `${lineWidth == 5 && 'bg-[#5b5a6d]'} h-full flex items-center rounded-sm p-1 hover:bg-[#5b5a6d]` }>
                        <span className="h-1.5 w-6 rounded-full block bg-slate-200"></span>
                    </div>
                    <div onClick={ () => handleLineWidth(10) } className={ `${lineWidth == 10 && 'bg-[#5b5a6d]'} h-full flex items-center rounded-sm p-1 hover:bg-[#5b5a6d]` }>
                        <span className="h-2 w-6 rounded-full block bg-slate-200"></span>
                    </div>
                </div>
            </div> }

            { (line || arrowLine || rectangle || triangle || circle) && <div className="shape-options flex">
                <div className="color flex justify-center gap-3 items-center">
                    <div>
                        <input
                            type="color"
                            value={ strokeColor }
                            id="color-option-stroke"
                            className="cursor-pointer invisible absolute rounded-full bg-[#65e222] outline-none"
                            onChange={ (e) => changeStrokeColor(e.target.value) }
                        />
                        <label htmlFor="color-option-stroke">
                            <img src="/color-choose.png" className="w-6 cursor-pointer" alt="Choose color icon" />
                        </label>
                    </div>
                    { (!line && !arrowLine) && <div>
                        <input
                            type="color"
                            value={ bgColor }
                            id="color-option-background"
                            className="cursor-pointer invisible absolute rounded-full bg-[#e2b522ff] outline-none"
                            onChange={ (e) => changeBgColor(e.target.value) }
                        />
                        <label htmlFor="color-option-background">
                            <img src="/color-choose.png" className="w-6 cursor-pointer" alt="Choose color icon" />
                        </label>
                    </div> }
                </div>
                <div className="gap-4 items-center cursor-pointer h-5 ml-4 flex">
                    <div onClick={ () => handleStrokeWidth(2) } className={ `${strokeWidth == 2 && 'bg-[#5b5a6d]'} h-full flex items-center rounded-sm p-1 hover:bg-[#5b5a6d]` }>
                        <span className="h-1 w-6 rounded-full block bg-slate-200"></span>
                    </div>
                    <div onClick={ () => handleStrokeWidth(5) } className={ `${strokeWidth == 5 && 'bg-[#5b5a6d]'} h-full flex items-center rounded-sm p-1 hover:bg-[#5b5a6d]` }>
                        <span className="h-1.5 w-6 rounded-full block bg-slate-200"></span>
                    </div>
                    <div onClick={ () => handleStrokeWidth(10) } className={ `${strokeWidth == 10 && 'bg-[#5b5a6d]'} h-full flex items-center rounded-sm p-1 hover:bg-[#5b5a6d]` }>
                        <span className="h-2 w-6 rounded-full block bg-slate-200"></span>
                    </div>
                </div>
            </div> }

            { isEditing && <div className="text-options flex">
                <div className="color flex justify-center gap-3 items-center">
                    <div onClick={ () => changeColor("white") } className={ `${color == 'white' && 'scale-125'} transform w-4 h-4 cursor-pointer rounded-full bg-white hover:scale-125 transition-all` }></div>
                    <div onClick={ () => changeColor("yellow") } className={ `${color == 'yellow' && 'scale-125'} transform w-4 h-4 cursor-pointer rounded-full bg-yellow-300 hover:scale-125 transition-all` }></div>
                    <div>
                        <input
                            type="color"
                            value={ color }
                            id="color-option-text"
                            className="cursor-pointer invisible absolute rounded-full bg-[#65e222] outline-none"
                            onChange={ (e) => changeColor(e.target.value) }
                        />
                        <label htmlFor="color-option-text">
                            <img src="/color-choose.png" className="w-6 cursor-pointer" alt="Choose color icon" />
                        </label>
                    </div>
                </div>
                <div className="ml-4">
                    <img src="/text.svg" className="w-6 cursor-pointer" alt="Text icon" />
                </div>
                <div className="ml-4">
                    <select onChange={ (e) => setTextFont(e.target.value) } value={ textFont } name="select-font" id="select-font" className="cursor-pointer absolute opacity-0 w-5 h-5">
                        <option value="Handlee">Handlee</option>
                        <option value="Arial">Arial</option>
                        <option value="Verdana">Verdana</option>
                    </select>
                    <label htmlFor="select-font" className="cursor-pointer">
                        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" className="" fill="none" width="20" strokeWidth="2" stroke="#fff" strokeLinecap="round" strokeLinejoin="round"><g strokeWidth="1.5"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="4" y1="20" x2="7" y2="20"></line><line x1="14" y1="20" x2="21" y2="20"></line><line x1="6.9" y1="15" x2="13.8" y2="15"></line><line x1="10.2" y1="6.3" x2="16" y2="20"></line><polyline points="5 20 11 4 13 4 20 20"></polyline></g></svg>
                    </label>
                </div>
                <div className="ml-4">
                    <select onChange={ (e) => setTextFontSize(e.target.value) } value={ textFontSize } name="select-font-size" id="select-font-size" className="cursor-pointer absolute opacity-0 w-5 h-5">
                        <option value="12">12</option>
                        <option value="16">16</option>
                        <option value="24">24</option>
                        <option value="32">32</option>
                        <option value="48">48</option>
                    </select>
                    <label htmlFor="select-font-size" className="cursor-pointer">
                        <img src="/font-size.png" className="w-5 cursor-pointer" alt="Text icon" />
                    </label>
                </div>
            </div> }


        </div>
    )
}

export default Options;
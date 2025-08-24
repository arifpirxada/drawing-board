import { useContext, useRef, useState } from "react"
import StateContext from "../context/StateContext"
import { useNavigate } from "react-router-dom";

function Controls() {
    const navigate = useNavigate();

    const {
        mouse,
        isPanning, setIsPanning,
        setIsPen,
        isPen,
        setEraser,
        eraser,
        line,
        arrowLine,
        rectangle,
        triangle,
        circle,
        setLine,
        setArrowLine,
        setRectangle,
        setTriangle,
        setCircle,
        isMouse,
        setIsMouse,
        setImages,
        setIsEditing,
    } = useContext(StateContext);

    // Id
    const imageId = useRef(0);
    const eraserRef = useRef(null);

    const [controlWidth, setControlWidth] = useState("w-12")

    const toggleControls = () => {
        if (controlWidth == "w-12") {
            setControlWidth("w-44")
        } else {
            setControlWidth("w-12")
        }
    }

    const resetAllTools = () => {
        setIsPen(false);
        setIsPanning(false);
        setEraser(false);
        setLine(false);
        setArrowLine(false);
        setRectangle(false);
        setTriangle(false);
        setCircle(false);
        setIsMouse(false);
    };

    const changeControl = (cmd) => {
        resetAllTools();

        switch (cmd) {
            case "pen":
                setIsPen(true);
                break;
            case "panning":
                setIsPanning(true);
                break;
            case "eraser":
                setEraser(true);
                break;
            case "line":
                setLine(true);
                break;
            case "arrowLine":
                setArrowLine(true);
                break;
            case "rectangle":
                setRectangle(true);
                break;
            case "triangle":
                setTriangle(true);
                break;
            case "circle":
                setCircle(true);
                break;
            case "mouse":
                setIsMouse(true);
                break;
        }
    }

    const addText = () => {
        resetAllTools()
        setIsEditing(true)
    }

    const handleImages = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (event) {
                const image = new Image();

                image.onload = function () {
                    setImages((prevImages) => [...prevImages, {
                        image: image,
                        id: `image-${imageId.current++}`
                    }]);
                };
                image.src = event.target.result;
            };

            reader.readAsDataURL(file);
            resetAllTools()
        }
    }

    const handleMouseEnter = () => {
        if (eraser && eraserRef.current) {
            eraserRef.current.classList.add('hidden')
        }
    }

    const handleMouseLeave = () => {
        if (eraser && eraserRef.current) {
            eraserRef.current.classList.remove('hidden')
        }
    }

    return (
        <div onMouseEnter={ handleMouseEnter } onMouseLeave={ handleMouseLeave } className={ `controls-container z-[1000] h-fit left-4 top-4 rounded-2xl fixed ${controlWidth} transition-all p-3` }>
            <img ref={ eraserRef } style={ { left: mouse.x - 15, top: mouse.y - 13 } } className={ `${!eraser && 'hidden'} w-6 absolute` } src="/eraser-icon.svg" alt="Eraser icon" />
            <div onClick={ toggleControls } className="w-6 cursor-pointer h-7 m-auto float-right">
                <span className="h-1 rounded-[1px] mb-1 block bg-slate-200"></span>
                <span className="h-1 rounded-[1px] mb-1 block bg-slate-200"></span>
                <span className="h-1 rounded-[1px] mb-1 block bg-slate-200"></span>
            </div>
            <h2 className={ `text-white mb-3 ${controlWidth == "w-12" ? 'h-0' : ''} font-mono overflow-hidden transition-all select-none` }>Pens</h2>
            <div className={ `pens ${controlWidth == "w-12" ? 'mt-12' : ''} flex gap-3 justify-center flex-wrap` }>
                <svg onClick={ () => changeControl("mouse") } x="0px" y="0px" className="w-6 cursor-pointer" viewBox="0 0 32 32">
                    <path fill="#ffffff" className={ `hover:fill-orange-300 ${isMouse ? 'fill-orange-300' : ''}` } d="M 9 2.59375 L 9 28.15625 L 10.65625 26.78125 L 14.6875 23.40625 L 16.71875 27.4375 L 17.15625 28.34375 L 18.0625 27.875 L 21.15625 26.28125 L 22.03125 25.84375 L 21.59375 24.9375 L 19.75 21.3125 L 24.8125 20.6875 L 26.84375 20.4375 L 25.40625 19 L 10.71875 4.28125 Z M 11 7.4375 L 22.5625 18.96875 L 18.0625 19.5 L 16.65625 19.6875 L 17.3125 20.96875 L 19.375 24.96875 L 18.0625 25.65625 L 15.90625 21.34375 L 15.3125 20.21875 L 14.34375 21.03125 L 11 23.84375 Z"></path>
                </svg>
                <svg onClick={ () => changeControl("pen") } className={ `w-6 cursor-pointer` } viewBox="0 0 512 512"><path className={ `hover:fill-orange-300 ${isPen ? 'fill-orange-300' : ''}` } fill="#eeeadd" d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
                <svg onClick={ () => changeControl("panning") } className={ `w-6 cursor-pointer` } aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke={ `${isPanning ? '#fdba74' : '#fff'}` } strokeLinecap="round" strokeLinejoin="round"><g strokeWidth="1.25"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M8 13v-7.5a1.5 1.5 0 0 1 3 0v6.5"></path><path d="M11 5.5v-2a1.5 1.5 0 1 1 3 0v8.5"></path><path d="M14 5.5a1.5 1.5 0 0 1 3 0v6.5"></path><path d="M17 7.5a1.5 1.5 0 0 1 3 0v8.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47"></path></g></svg>
            </div>
            <hr className="border-gray-400 mt-6 mb-2" />
            <div className="size flex justify-center gap-3 items-center py-1 flex-wrap">
                <h2 className={ `text-white ${controlWidth == "w-12" ? 'h-0 hidden' : ''} font-mono overflow-hidden transition-all select-none` }>Eraser</h2>
                <img onClick={ () => changeControl("eraser") } className="w-6 cursor-pointer" src="/eraser-icon.svg" alt="Eraser icon" />
            </div>

            <hr className="border-gray-400 mt-2 mb-2" />
            <h2 className={ `text-white mb-3 ${controlWidth == "w-12" ? 'h-0' : ''} font-mono overflow-hidden transition-all select-none` }>Shapes</h2>
            <div className="shapes flex justify-center gap-3 items-center flex-wrap">

                <svg onClick={ () => changeControl("arrowLine") } aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" className="cursor-pointer hover:scale-110 transition-all" fill="none" width="20" height="20" strokeWidth="2" stroke="#fff" strokeLinecap="round" strokeLinejoin="round"><g className={ arrowLine ? 'stroke-orange-300' : '' } strokeWidth="1.5"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="5" y1="12" x2="19" y2="12"></line><line x1="15" y1="16" x2="19" y2="12"></line><line x1="15" y1="8" x2="19" y2="12"></line></g></svg>
                <svg onClick={ () => changeControl("line") } className="cursor-pointer hover:scale-110 transition-all" width="20" height="20">
                    <line x1="2" y1="2" x2="18" y2="18" stroke="white" className={ line ? 'stroke-orange-300' : '' } strokeWidth="1" />
                </svg>
                <svg onClick={ () => changeControl("rectangle") } className="cursor-pointer hover:scale-110 transition-all" width="16" height="15">
                    <rect width="15" height="15" fill="none" stroke="white" className={ rectangle ? 'stroke-orange-300' : '' } strokeWidth="1.5"> </rect>
                </svg>
                <svg onClick={ () => changeControl("triangle") } className="cursor-pointer hover:scale-110 transition-all" width="16" height="16" xmlnsXlink="http://www.w3.org/2000/svg">
                    <polygon points="0,0 15,15 0,15" fill="none" className={ triangle ? 'stroke-orange-300' : '' } stroke="white" />
                </svg>
                <svg onClick={ () => changeControl("circle") } className="cursor-pointer hover:scale-110 transition-all" width="16" height="16">
                    <circle cx="7.5" cy="7.5" r="7" stroke="white" strokeWidth="1" className={ circle ? 'stroke-orange-300' : '' } fill="none" />
                </svg>

            </div>
            <label htmlFor="drawing-image" className={ `text-white cursor-pointer gap-2 mt-4 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm ${controlWidth == "w-44" ? 'px-2 py-2 mr-1' : '-mx-[2px] p-1'} text-center inline-flex items-center` }>
                { controlWidth == "w-44" ? "Img" : "" }
                <svg aria-hidden="true" width="20" height="20" focusable="false" role="img" viewBox="0 0 20 20" className="" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round"><g strokeWidth="1.25"><path d="M12.5 6.667h.01"></path><path d="M4.91 2.625h10.18a2.284 2.284 0 0 1 2.285 2.284v10.182a2.284 2.284 0 0 1-2.284 2.284H4.909a2.284 2.284 0 0 1-2.284-2.284V4.909a2.284 2.284 0 0 1 2.284-2.284Z"></path><path d="m3.333 12.5 3.334-3.333c.773-.745 1.726-.745 2.5 0l4.166 4.166"></path><path d="m11.667 11.667.833-.834c.774-.744 1.726-.744 2.5 0l1.667 1.667"></path></g></svg>
                <input type="file" onChange={ handleImages } name="drawing-image" className="hidden" id="drawing-image" />
            </label>
            <button onClick={ addText } type="button" className={ `text-white mt-2 gap-2 hover:bg-blue-800 focus:outline-none font-medium rounded-sm text-sm text-center inline-flex items-center  ${controlWidth == "w-44" ? 'px-2 py-2 mr-1' : '-mx-[2px] pl-1'}` }>
                { controlWidth == "w-44" ? "Txt" : "" }
                <img src="/text.svg" className="w-6 cursor-pointer" alt="Text icon" />
            </button>
            <button onClick={ () => navigate("/view") } type="button" className={ `text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 rounded-sm text-sm ${controlWidth == "w-44" ? 'px-6 py-2 mt-2' : '-mx-[2px] p-2 mt-4'} inline-flex items-center` }>
                { controlWidth == "w-44" ? "View" : "" }
                <svg className={ `rtl:rotate-180 w-3.5 h-3.5 ${controlWidth == "w-44" ? 'ms-2' : ''}` } aria-hidden="true" xmlnsXlink="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
            </button>

        </div>
    )
}

export default Controls
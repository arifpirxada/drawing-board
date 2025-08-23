import { useContext, useState } from "react"
import StateContext from "../context/StateContext"
import { useNavigate } from "react-router-dom";

function Controls() {
    const navigate = useNavigate();

    const {
        mouse,
        setIsPen,
        setColor,
        isPen,
        color,
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
        texts,
        setTexts,
        setImages
    } = useContext(StateContext);

    const [controlWidth, setControlWidth] = useState("w-12")

    const toggleControls = () => {
        if (controlWidth == "w-12") {
            setControlWidth("w-44")
        } else {
            setControlWidth("w-12")
        }
    }

    const changeControl = (cmd) => {
        switch (cmd) {
            case "pen":
                setIsPen(true);
                setEraser(false);
                setLine(false);
                setArrowLine(false);
                setRectangle(false);
                setTriangle(false);
                setCircle(false)
                setIsMouse(false)
                break;
            case "eraser":
                setIsPen(false);
                setEraser(true);
                setLine(false);
                setArrowLine(false);
                setRectangle(false);
                setTriangle(false);
                setCircle(false)
                setIsMouse(false)
                break;
            case "line":
                setIsPen(false);
                setEraser(false);
                setLine(true);
                setArrowLine(false);
                setRectangle(false);
                setTriangle(false);
                setCircle(false)
                setIsMouse(false)
                break;
            case "arrowLine":
                setIsPen(false);
                setEraser(false);
                setLine(false);
                setArrowLine(true);
                setRectangle(false);
                setTriangle(false);
                setCircle(false)
                setIsMouse(false)
                break;
            case "rectangle":
                setIsPen(false);
                setEraser(false);
                setLine(false);
                setArrowLine(false);
                setRectangle(true);
                setTriangle(false);
                setCircle(false)
                setIsMouse(false)
                break;
            case "triangle":
                setIsPen(false);
                setEraser(false);
                setLine(false);
                setArrowLine(false);
                setRectangle(false);
                setTriangle(true);
                setCircle(false)
                setIsMouse(false)
                break;
            case "circle":
                setIsPen(false);
                setEraser(false);
                setLine(false);
                setArrowLine(false);
                setRectangle(false);
                setTriangle(false);
                setCircle(true)
                setIsMouse(false)
                break;
            case "mouse":
                setIsPen(false);
                setEraser(false);
                setLine(false);
                setArrowLine(false);
                setRectangle(false);
                setTriangle(false);
                setCircle(false)
                setIsMouse(true)
                break;
        }
    }
    const changeColor = (clr) => {
        setColor(clr);
    }

    const addText = () => {
        const txt = prompt("Enter your text");
        setTexts([...texts, { text: txt, color }])

        setIsPen(false);
        setEraser(false);
        setLine(false);
        setArrowLine(false);
        setRectangle(false);
        setTriangle(false);
        setCircle(false)
        setIsMouse(true)
    }

    const handleImages = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (event) {
                const image = new Image();
                image.src = event.target.result;

                setImages((prevImages) => [...prevImages, image])
            };

            reader.readAsDataURL(file);
            searrowLinetIsPen(false);
            setEraser(false);
            setLine(false);
            setArrowLine(false);
            setRectangle(false);
            setTriangle(false);
            setCircle(false)
            setIsMouse(true)
        }
    }

    return (
        <div className={ `controls-container z-[1000] h-fit left-4 top-4 rounded-2xl fixed ${controlWidth} transition-all p-3` }>
            { eraser && <svg style={ { left: mouse.x - 20, top: mouse.y - 18 } } className="absolute" width="20" height="20">
                <rect width="20" height="20" fill="white" stroke="white" strokeWidth="1"> </rect>
            </svg> }
            { eraser && <svg style={ { left: mouse.x - 15, top: mouse.y - 13 } } className="absolute" width="15" height="15">
                <rect width="15" height="15" fill="white" stroke="white" strokeWidth="1"> </rect>
            </svg> }
            <div onClick={ toggleControls } className="w-6 cursor-pointer h-7 m-auto float-right">
                <span className="h-1 rounded-[1px] mb-1 block bg-slate-200"></span>
                <span className="h-1 rounded-[1px] mb-1 block bg-slate-200"></span>
                <span className="h-1 rounded-[1px] mb-1 block bg-slate-200"></span>
            </div>
            <h2 className={ `text-white mb-3 ${controlWidth == "w-12" ? 'h-0' : ''} font-mono overflow-hidden transition-all select-none` }>Pens</h2>
            <div className="pens mt-12 flex gap-3 justify-center flex-wrap">
                <svg onClick={ () => changeControl("mouse") } x="0px" y="0px" className="w-6 cursor-pointer" viewBox="0 0 32 32">
                    <path fill="#ffffff" className={ `hover:fill-orange-300 ${isMouse ? 'fill-orange-300' : ''}` } d="M 9 2.59375 L 9 28.15625 L 10.65625 26.78125 L 14.6875 23.40625 L 16.71875 27.4375 L 17.15625 28.34375 L 18.0625 27.875 L 21.15625 26.28125 L 22.03125 25.84375 L 21.59375 24.9375 L 19.75 21.3125 L 24.8125 20.6875 L 26.84375 20.4375 L 25.40625 19 L 10.71875 4.28125 Z M 11 7.4375 L 22.5625 18.96875 L 18.0625 19.5 L 16.65625 19.6875 L 17.3125 20.96875 L 19.375 24.96875 L 18.0625 25.65625 L 15.90625 21.34375 L 15.3125 20.21875 L 14.34375 21.03125 L 11 23.84375 Z"></path>
                </svg>
                <svg onClick={ () => changeControl("pen") } className={ `w-6 cursor-pointer` } viewBox="0 0 512 512"><path className={ `hover:fill-orange-300 ${isPen ? 'fill-orange-300' : ''}` } fill="#eeeadd" d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
            </div>
            <hr className="border-gray-400 mt-6 mb-2" />
            <h2 className={ `text-white mb-3 ${controlWidth == "w-12" ? 'h-0' : ''} font-mono overflow-hidden transition-all select-none` }>Eraser</h2>
            <div className="size flex justify-center gap-3 items-center flex-wrap">
                <svg onClick={ () => changeControl("eraser") } className="cursor-pointer hover:scale-110 transition-all" width="20" height="20">
                    <rect width="15" height="15" fill="white" stroke="white" strokeWidth="1"> </rect>
                </svg>
            </div>

            <hr className="border-gray-400 mt-6 mb-2" />
            <h2 className={ `text-white mb-3 ${controlWidth == "w-12" ? 'h-0' : ''} font-mono overflow-hidden transition-all select-none` }>Shapes</h2>
            <div className="shapes flex justify-center gap-3 items-center flex-wrap">

                <svg onClick={ () => changeControl("arrowLine") } aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" className="cursor-pointer hover:scale-110 transition-all" fill="none" width="20" height="20" strokeWidth="2" stroke="#fff" strokeLinecap="round" strokeLinejoin="round"><g className={ arrowLine ? 'stroke-orange-300' : '' }  strokeWidth="1.5"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="5" y1="12" x2="19" y2="12"></line><line x1="15" y1="16" x2="19" y2="12"></line><line x1="15" y1="8" x2="19" y2="12"></line></g></svg>
                <svg onClick={ () => changeControl("line") } className="cursor-pointer hover:scale-110 transition-all" width="20" height="20">
                    <line x1="2" y1="2" x2="18" y2="18" stroke="white" className={ line ? 'stroke-orange-300' : '' } strokeWidth="1" />
                </svg>
                <svg onClick={ () => changeControl("rectangle") } className="cursor-pointer hover:scale-110 transition-all" width="16" height="15">
                    <rect width="15" height="15" fill="none" stroke="white" className={ rectangle ? 'stroke-orange-300' : '' } strokeWidth="1"> </rect>
                </svg>
                <svg onClick={ () => changeControl("triangle") } className="cursor-pointer hover:scale-110 transition-all" width="16" height="16" xmlnsXlink="http://www.w3.org/2000/svg">
                    <polygon points="0,0 15,15 0,15" fill="none" className={ triangle ? 'stroke-orange-300' : '' } stroke="white" />
                </svg>
                <svg onClick={ () => changeControl("circle") } className="cursor-pointer hover:scale-110 transition-all" width="16" height="16">
                    <circle cx="7.5" cy="7.5" r="7" stroke="white" strokeWidth="1" className={ circle ? 'stroke-orange-300' : '' } fill="none" />
                </svg>

            </div>
            { controlWidth == "w-44" ? <><label htmlFor="drawing-image" className={ `text-white cursor-pointer mt-8 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm ${controlWidth == "w-44" ? 'px-2 py-2 mr-1' : '-mx-[2px] p-2'} text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800` }>
                { controlWidth == "w-44" ? "Image" : "" }
                <svg className={ `rtl:rotate-180 w-3.5 h-3.5 ${controlWidth == "w-44" ? 'ms-2' : ''}` } aria-hidden="true" xmlnsXlink="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                </svg>
                <input type="file" onChange={ handleImages } name="drawing-image" className="hidden" id="drawing-image" />
            </label>
                <button onClick={ addText } type="button" className={ `text-white mt-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-sm text-sm ${controlWidth == "w-44" ? 'px-2 py-2 mr-1' : '-mx-[2px] p-2'} text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800` }>
                    { controlWidth == "w-44" ? "Text" : "" }
                    <svg className={ `rtl:rotate-180 w-3.5 h-3.5 ${controlWidth == "w-44" ? 'ms-2' : ''}` } aria-hidden="true" xmlnsXlink="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </button></> : "" }
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
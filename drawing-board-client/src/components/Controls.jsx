import { useContext, useState } from "react"
import StateContext from "../context/StateContext"
import { useNavigate } from "react-router-dom";

function Controls() {
    const navigate = useNavigate();

    const {
        setIsMarker,
        mouse,
        setIsPen,
        setIsPencil,
        setColor,
        isPen,
        isMarker,
        isPencil,
        color,
        setLineWidth,
        setEraserOne,
        setEraserTwo,
        eraserOne,
        eraserTwo,
        line,
        rectangle,
        triangle,
        circle,
        setLine,
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
                setIsMarker(false);
                setIsPencil(false);
                setLineWidth(5);
                setEraserOne(false);
                setEraserTwo(false);
                setLine(false);
                setRectangle(false);
                setTriangle(false);
                setCircle(false)
                setIsMouse(false)
                break;
            case "marker":
                setIsPen(false);
                setIsMarker(true);
                setIsPencil(false);
                setLineWidth(20);
                setEraserOne(false);
                setEraserTwo(false);
                setLine(false);
                setRectangle(false);
                setTriangle(false);
                setCircle(false)
                setIsMouse(false)
                break;
            case "pencil":
                setIsPen(false);
                setIsMarker(false);
                setIsPencil(true);
                setEraserOne(false);
                setEraserTwo(false);
                setLineWidth(1);
                setLine(false);
                setRectangle(false);
                setTriangle(false);
                setCircle(false)
                setIsMouse(false)
                break;
            case "eraserOne":
                setIsPen(false);
                setIsMarker(false);
                setIsPencil(false);
                setEraserOne(true);
                setEraserTwo(false);
                setLine(false);
                setRectangle(false);
                setTriangle(false);
                setCircle(false)
                setIsMouse(false)
                break;
            case "eraserTwo":
                setIsPen(false);
                setIsMarker(false);
                setIsPencil(false);
                setEraserOne(false);
                setEraserTwo(true);
                setLine(false);
                setRectangle(false);
                setTriangle(false);
                setCircle(false)
                setIsMouse(false)
                break;
            case "line":
                setIsPen(false);
                setIsMarker(false);
                setIsPencil(false);
                setEraserOne(false);
                setEraserTwo(false);
                setLine(true);
                setRectangle(false);
                setTriangle(false);
                setCircle(false)
                setIsMouse(false)
                break;
            case "rectangle":
                setIsPen(false);
                setIsMarker(false);
                setIsPencil(false);
                setEraserOne(false);
                setEraserTwo(false);
                setLine(false);
                setRectangle(true);
                setTriangle(false);
                setCircle(false)
                setIsMouse(false)
                break;
            case "triangle":
                setIsPen(false);
                setIsMarker(false);
                setIsPencil(false);
                setEraserOne(false);
                setEraserTwo(false);
                setLine(false);
                setRectangle(false);
                setTriangle(true);
                setCircle(false)
                setIsMouse(false)
                break;
            case "circle":
                setIsPen(false);
                setIsMarker(false);
                setIsPencil(false);
                setEraserOne(false);
                setEraserTwo(false);
                setLine(false);
                setRectangle(false);
                setTriangle(false);
                setCircle(true)
                setIsMouse(false)
                break;
            case "mouse":
                setIsPen(false);
                setIsMarker(false);
                setIsPencil(false);
                setEraserOne(false);
                setEraserTwo(false);
                setLine(false);
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
        setIsMarker(false);
        setIsPencil(false);
        setEraserOne(false);
        setEraserTwo(false);
        setLine(false);
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
            setIsPen(false);
            setIsMarker(false);
            setIsPencil(false);
            setEraserOne(false);
            setEraserTwo(false);
            setLine(false);
            setRectangle(false);
            setTriangle(false);
            setCircle(false)
            setIsMouse(true)
        }
    }

    return (
        <div className={ `controls-container z-[1000] h-fit left-4 top-4 rounded-2xl fixed ${controlWidth} transition-all p-3` }>
            { eraserOne && <svg style={ { left: mouse.x - 20, top: mouse.y - 18 } } className="absolute" width="20" height="20">
                <rect width="20" height="20" fill="white" stroke="white" strokeWidth="1"> </rect>
            </svg> }
            { eraserTwo && <svg style={ { left: mouse.x - 15, top: mouse.y - 13 } } className="absolute" width="15" height="15">
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
                <svg onClick={ () => changeControl("marker") } className={ `w-6 cursor-pointer` } viewBox="0 0 512 512"><path className={ `hover:fill-orange-300 ${isMarker ? 'fill-orange-300' : ''}` } fill="#eeeadd" d="M481 31C445.1-4.8 386.9-4.8 351 31l-15 15L322.9 33C294.8 4.9 249.2 4.9 221.1 33L135 119c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0L255 66.9c9.4-9.4 24.6-9.4 33.9 0L302.1 80 186.3 195.7 316.3 325.7 481 161c35.9-35.9 35.9-94.1 0-129.9zM293.7 348.3L163.7 218.3 99.5 282.5c-48 48-80.8 109.2-94.1 175.8l-5 25c-1.6 7.9 .9 16 6.6 21.7s13.8 8.1 21.7 6.6l25-5c66.6-13.3 127.8-46.1 175.8-94.1l64.2-64.2z" /></svg>
                <svg onClick={ () => changeControl("pencil") } className={ `w-6 cursor-pointer` } viewBox="0 0 512 512"><path className={ `hover:fill-orange-300 ${isPencil ? 'fill-orange-300' : ''}` } fill="#eeeadd" d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" /></svg>
            </div>
            <hr className="border-gray-400 mt-6 mb-2" />
            <h2 className={ `text-white mb-3 ${controlWidth == "w-12" ? 'h-0' : ''} font-mono overflow-hidden transition-all select-none` }>Eraser</h2>
            <div className="size flex justify-center gap-3 items-center flex-wrap">
                <svg onClick={ () => changeControl("eraserOne") } className="cursor-pointer hover:scale-110 transition-all" width="20" height="20">
                    <rect width="20" height="20" fill="white" stroke="white" strokeWidth="1"> </rect>
                </svg>
                <svg onClick={ () => changeControl("eraserTwo") } className="cursor-pointer hover:scale-110 transition-all" width="15" height="15">
                    <rect width="15" height="15" fill="white" stroke="white" strokeWidth="1"> </rect>
                </svg>
            </div>
            <hr className="border-gray-400 mt-6 mb-2" />
            <h2 className={ `text-white mb-3 ${controlWidth == "w-12" ? 'h-0' : ''} font-mono overflow-hidden transition-all select-none` }>Color</h2>
            <div className="color flex justify-center gap-3 items-center flex-wrap">
                <div onClick={ () => changeColor("white") } className={ `${color == 'white' ? 'w-5 h-5' : 'w-4 h-4'} cursor-pointer rounded-full bg-white hover:scale-110 transition-all` }></div>
                <div onClick={ () => changeColor("red") } className={ `${color == 'red' ? 'w-5 h-5' : 'w-4 h-4'} cursor-pointer rounded-full bg-red-500 hover:scale-110 transition-all` }></div>
                <div onClick={ () => changeColor("yellow") } className={ `${color == 'yellow' ? 'w-5 h-5' : 'w-4 h-4'} cursor-pointer rounded-full bg-yellow-300 hover:scale-110 transition-all` }></div>
                <div onClick={ () => changeColor("green") } className={ `${color == 'green' ? 'w-5 h-5' : 'w-4 h-4'} cursor-pointer rounded-full bg-green-500 hover:scale-110 transition-all` }></div>
            </div>
            { controlWidth == "w-44" && <div className="flex justify-center"><input
                type="color"
                value={ color }
                onChange={ (e) => setColor(e.target.value) }
                className="mt-4 cursor-pointer rounded-sm outline-none"
            /></div> }
            <hr className="border-gray-400 mt-6 mb-2" />
            <h2 className={ `text-white mb-3 ${controlWidth == "w-12" ? 'h-0' : ''} font-mono overflow-hidden transition-all select-none` }>Shapes</h2>
            <div className="shapes flex justify-center gap-3 items-center flex-wrap">

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
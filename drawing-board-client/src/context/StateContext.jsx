import { createContext, useEffect, useState } from 'react';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
    const [isMouse, setIsMouse] = useState(false);

    // Pen states
    const [isPen, setIsPen] = useState(true);
    const [isMarker, setIsMarker] = useState(false);
    const [isPencil, setIsPencil] = useState(false);

    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [isDrawing, setIsDrawing] = useState(false);
    
    const [lineWidth, setLineWidth] = useState(5);
    const [color, setColor] = useState("white");

    // Eraser
    const [eraserOne, setEraserOne] = useState(false);
    const [eraserTwo, setEraserTwo] = useState(false);

    // Shapes
    const [line, setLine] = useState(false);
    const [rectangle, setRectangle] = useState(false);
    const [triangle, setTriangle] = useState(false);
    const [circle, setCircle] = useState(false);

    // Text
    const [texts, setTexts] = useState([]);

    // Image
    const [images, setImages] = useState([]);

    return (
        <StateContext.Provider value={ {
            isPen,
            setIsPen,
            isMarker,
            setIsMarker,
            isPencil,
            setIsPencil,
            mouse,
            isDrawing,
            setMouse,
            setIsDrawing,
            lineWidth,
            setLineWidth,
            color,
            setColor,
            eraserOne,
            setEraserOne,
            eraserTwo,
            setEraserTwo,
            line,
            setLine,
            rectangle,
            setRectangle,
            triangle,
            setTriangle,
            circle,
            setCircle,
            isMouse,
            setIsMouse,
            texts,
            setTexts,
            images,
            setImages
        } }>
            { children }
        </StateContext.Provider>
    );
};

export default StateContext;
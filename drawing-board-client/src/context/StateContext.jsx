import { createContext, useEffect, useState } from 'react';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
    const [isMouse, setIsMouse] = useState(false);

    const [isDrawing, setIsDrawing] = useState(false);

    // ******** Controls *******
    // Pen states
    const [isPen, setIsPen] = useState(true);
    const [isPanning, setIsPanning] = useState(false);

    const [lineWidth, setLineWidth] = useState(5);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [color, setColor] = useState("white");
    const [strokeColor, setStrokeColor] = useState("white");
    const [bgColor, setBgColor] = useState("#ffffff00");

    // Eraser
    const [eraser, setEraser] = useState(false);

    // Shapes
    const [line, setLine] = useState(false);
    const [arrowLine, setArrowLine] = useState(false);
    const [rectangle, setRectangle] = useState(false);
    const [triangle, setTriangle] = useState(false);
    const [circle, setCircle] = useState(false);

    // Text
    const [textFont, setTextFont] = useState('Handlee')
    const [textFontSize, setTextFontSize] = useState(24)

    const [isEditing, setIsEditing] = useState(false);

    // Grid

    const [gridView, setGridView] = useState(() => {
        const localView = localStorage.getItem("gridView");
        return localView === "true";
    });

    useEffect(() => {
        localStorage.setItem("gridView", gridView);
    }, [gridView]);

    // ******* Shapes *********
    // const [texts, setTexts] = useState([]);
    // const [images, setImages] = useState([]);

    const [shapes, setShapes] = useState([]);

    return (
        <StateContext.Provider value={ {
            isPen, setIsPen,
            isPanning, setIsPanning,
            isDrawing, setIsDrawing,
            lineWidth, strokeWidth, setLineWidth, setStrokeWidth,
            color, strokeColor, bgColor, setColor, setStrokeColor, setBgColor,
            eraser, setEraser,
            line, setLine, arrowLine, setArrowLine,
            rectangle, setRectangle, triangle, setTriangle, circle, setCircle,
            isMouse, setIsMouse,
            textFont, setTextFont, textFontSize, setTextFontSize,
            gridView, setGridView,
            shapes, setShapes,
            isEditing, setIsEditing
        } }>
            { children }
        </StateContext.Provider>
    );
};

export default StateContext;
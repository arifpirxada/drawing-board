import { createContext, useState } from 'react';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
    const [isMouse, setIsMouse] = useState(false);

    // Pen states
    const [isPen, setIsPen] = useState(true);
    const [isPanning, setIsPanning] = useState(false);

    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [isDrawing, setIsDrawing] = useState(false);

    const [lineWidth, setLineWidth] = useState(5);
    const [strokeWidth, setStrokeWidth] = useState(5);
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
    const [texts, setTexts] = useState([]);
    const [textFont, setTextFont] = useState('Handlee')
    const [textFontSize, setTextFontSize] = useState(24)

    const [isEditing, setIsEditing] = useState(false);
    const [editingText, setEditingText] = useState('');

    // Image
    const [images, setImages] = useState([]);

    // Grid

    const [gridView, setGridView] = useState(false);

    return (
        <StateContext.Provider value={ {
            isPen,
            setIsPen,
            isPanning, setIsPanning,
            mouse,
            isDrawing,
            setMouse,
            setIsDrawing,
            lineWidth,
            strokeWidth,
            setLineWidth,
            setStrokeWidth,
            color,
            strokeColor,
            bgColor,
            setColor,
            setStrokeColor,
            setBgColor,
            eraser,
            setEraser,
            line,
            setLine,
            arrowLine,
            setArrowLine,
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
            setImages,
            textFont, setTextFont,
            textFontSize, setTextFontSize,
            isEditing, setIsEditing,
            editingText, setEditingText,
            gridView, setGridView
        } }>
            { children }
        </StateContext.Provider>
    );
};

export default StateContext;
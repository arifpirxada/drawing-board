// import React, { useState, useRef, useContext, useEffect } from 'react';
// import { Stage, Layer, Line, Rect, Circle, Text, Image, Transformer, Arrow } from 'react-konva';
// import StateContext from '../context/StateContext';

// function Editor() {
//     const [lines, setLines] = useState([]);
//     const [arrowLines, setArrowLines] = useState([]);
//     const [rectangles, setRectangles] = useState([]);
//     const [triangles, setTriangles] = useState([]);
//     const [circles, setCircles] = useState([]);
//     const stageRef = useRef(null);

//     const {
//         color,
//         lineWidth,
//         setMouse,
//         line, setLine,
//         arrowLine, setArrowLine,
//         isDrawing,
//         setIsDrawing,
//         isPen,
//         strokeWidth,
//         strokeColor,
//         bgColor,
//         rectangle,
//         isMouse, setIsMouse,
//         triangle,
//         circle,
//         texts,
//         images
//     } = useContext(StateContext);

//     const handleMouseDown = (e) => {
//         setIsDrawing(true);
//         const pos = e.target.getStage().getPointerPosition();
//         if (line || isPen) {
//             setLines([...lines, { points: [pos.x, pos.y], color, lineWidth }]);
//         } else if (rectangle) {
//             setRectangles([...rectangles, { x: pos.x, y: pos.y, width: 0, height: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
//         } else if (triangle) {
//             setTriangles([...triangles, { points: [pos.x, pos.y, pos.x, pos.y, pos.x, pos.y], fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
//         } else if (circle) {
//             setCircles([...circles, { x: pos.x, y: pos.y, radius: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
//         } else if (arrowLine) {
//             setArrowLines([...arrowLines, { points: [pos.x, pos.y, pos.x, pos.y], color, strokeWidth }]);
//         }

//         // Deselect shape
//         if (e.target === stageRef.current) {
//             setSelectedShape(null);
//         }
//     };

//     const handleMouseMove = (e) => {
//         const stage = e.target.getStage();
//         const point = stage.getPointerPosition();
//         setMouse({ x: point.x, y: point.y })

//         if (isDrawing) {
//             if (isPen) {
//                 const lastLine = lines[lines.length - 1];
//                 lastLine.points = lastLine.points.concat([point.x, point.y]);

//                 lines.splice(lines.length - 1, 1, lastLine);
//                 setLines([...lines]);
//             } else if (line) {
//                 const lastLine = lines[lines.length - 1];
//                 const updatedPoints = [lastLine.points[0], lastLine.points[1], point.x, point.y];

//                 const updatedLine = {
//                     ...lastLine,
//                     points: updatedPoints
//                 };

//                 const newLines = [...lines];
//                 newLines[newLines.length - 1] = updatedLine;

//                 setLines(newLines);
//             } else if (rectangle) {
//                 const startX = rectangles[rectangles.length - 1].x;
//                 const startY = rectangles[rectangles.length - 1].y;

//                 const width = point.x - startX;
//                 const height = point.y - startY;

//                 const lastRect = rectangles[rectangles.length - 1];
//                 const updatedRect = {
//                     ...lastRect,
//                     width,
//                     height
//                 };

//                 const newRects = [...rectangles];
//                 newRects[newRects.length - 1] = updatedRect;

//                 setRectangles(newRects);
//             } else if (triangle) {
//                 const startX = triangles[triangles.length - 1].points[0];
//                 const startY = triangles[triangles.length - 1].points[1];

//                 const x = point.x - startX;
//                 const y = point.y - startY;
//                 const lastTriangle = triangles[triangles.length - 1];
//                 const updatedTriangle = { ...lastTriangle, points: [...lastTriangle.points] };
//                 updatedTriangle.points[3] = updatedTriangle.points[1] + y;
//                 updatedTriangle.points[4] = updatedTriangle.points[0] + x;
//                 updatedTriangle.points[5] = updatedTriangle.points[1] + y;


//                 const newTriangles = [...triangles];
//                 newTriangles[newTriangles.length - 1] = updatedTriangle;

//                 setTriangles(newTriangles);
//             } else if (circle) {
//                 const startX = circles[circles.length - 1].x;
//                 const startY = circles[circles.length - 1].y;

//                 const dx = point.x - startX;
//                 const dy = point.y - startY;
//                 const newRadius = Math.sqrt(dx * dx + dy * dy); // Pythagorean theorem to calculate distance

//                 const lastCircle = circles[circles.length - 1];
//                 const updatedCircle = { ...lastCircle, radius: newRadius };

//                 const newCircles = [...circles];
//                 newCircles[newCircles.length - 1] = updatedCircle;

//                 setCircles(newCircles);

//             } else if (arrowLine) {
//                 const lastLine = arrowLines[arrowLines.length - 1];
//                 const updatedPoints = [lastLine.points[0], lastLine.points[1], point.x, point.y];

//                 const updatedLine = {
//                     ...lastLine,
//                     points: updatedPoints
//                 };

//                 const newLines = [...arrowLines];
//                 newLines[newLines.length - 1] = updatedLine;

//                 setArrowLines(newLines);
//             }
//         }
//     };

//     const handleMouseUp = () => {
//         if (line) {
//             setIsMouse(true)
//         }
//         setLine(false);
//         setIsDrawing(false)
//     };

//     const layerRef = useRef(null);

//     const clearPartOfCanvas = (x, y, width, height) => {
//         const layer = layerRef.current;
//         const ctx = layer.getContext();
//         ctx.globalCompositeOperation = 'destination-out';
//         ctx.fillStyle = '#000000';
//         ctx.fillRect(x, y, width, height);
//         ctx.globalCompositeOperation = 'source-over';
//         layer.batchDraw();
//     };
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             clearPartOfCanvas(330, 450, 200, 200);

//         }, 4000);
//         return () => clearTimeout(timer);
//     }, [])


//     const [selectedShape, setSelectedShape] = useState(null);
//     const transformerRef = useRef(null);

//     const handleSelect = (e) => {
//         const shape = e.target;
//         setSelectedShape(shape);
//     };

//     const handleDragStart = (e) => {
//         e.target.moveToTop();
//     };

//     useEffect(() => {
//         if (selectedShape && transformerRef.current) {
//             transformerRef.current.nodes([selectedShape]);
//             transformerRef.current.getLayer().batchDraw();
//         }
//     }, [selectedShape]);

//     const [image, setImage] = useState(null);

//     useEffect(() => {
//         // const loadImage = () => {
//         //     const img = new window.Image();
//         //     img.src = 'https://konvajs.org/assets/lion.png'; // Replace with your image URL
//         //     img.onload = () => {
//         //         setImage(img);
//         //     };
//         // };
//         // loadImage();
//     }, [images]);

//     return (
//         <div className="canvas-container overflow-x-hidden w-screen h-screen relative">

//             <Stage
//                 width={ window.innerWidth }
//                 height={ window.innerHeight }
//                 onMouseDown={ handleMouseDown }
//                 onMouseMove={ handleMouseMove }
//                 onMouseUp={ handleMouseUp }
//                 ref={ stageRef }
//             >
//                 <Layer ref={ layerRef }>
//                     { images.map((item, i) => (
//                         <Image
//                             key={ i }
//                             image={ item }
//                             x={ window.innerWidth / 2 }
//                             y={ window.innerHeight / 2 }
//                             width={ 300 }
//                             height={ 300 / (item.naturalWidth / item.naturalHeight) }
//                             draggable={ isMouse }
//                             onClick={ handleSelect }
//                             onTap={ handleSelect }
//                             onDragStart={ handleDragStart }
//                             onDragMove={ () => console.log("moving...") }
//                             onDragEnd={ () => console.log("eng") }
//                         />
//                     )) }
//                     { texts.map((item, i) => (
//                         <Text
//                             text={ item.text }
//                             x={ window.innerWidth / 2 }
//                             y={ window.innerHeight / 2 }
//                             fontSize={ 24 }
//                             fill={ item.color }
//                             draggable={ isMouse }
//                             onClick={ handleSelect }
//                             onTap={ handleSelect }
//                             onDragStart={ handleDragStart }
//                             onDragMove={ () => console.log("moving...") }
//                             onDragEnd={ () => console.log("eng") }
//                         />
//                     )) }
//                     { circles.map((item, i) => (
//                         <Circle
//                             key={ i }
//                             x={ item.x }
//                             y={ item.y }
//                             radius={ item.radius }
//                             fill={ item.fill }
//                             stroke={ item.stroke }
//                             strokeWidth={ item.strokeWidth }
//                             draggable={ isMouse }
//                             onClick={ handleSelect }
//                             onTap={ handleSelect }
//                             onDragStart={ handleDragStart }
//                             onDragMove={ () => console.log("moving...") }
//                             onDragEnd={ () => console.log("eng") }
//                         />
//                     )) }
//                     { triangles.map((item, i) => (
//                         <Line
//                             key={ i }
//                             points={ item.points }
//                             fill={ item.fill }
//                             stroke={ item.stroke }
//                             strokeWidth={ item.strokeWidth }
//                             closed={ true }
//                             draggable={ isMouse }
//                             onClick={ handleSelect }
//                             onTap={ handleSelect }
//                             onDragStart={ handleDragStart }
//                             onDragMove={ () => console.log("moving...") }
//                             onDragEnd={ () => console.log("eng") }
//                         />
//                     )) }
//                     { rectangles.map((rect, i) => (
//                         <Rect
//                             key={ i }
//                             x={ rect.x }
//                             y={ rect.y }
//                             width={ rect.width }
//                             height={ rect.height }
//                             fill={ rect.fill }
//                             stroke={ rect.stroke }
//                             strokeWidth={ rect.strokeWidth }
//                             draggable={ isMouse }
//                             onClick={ handleSelect }
//                             onTap={ handleSelect }
//                             onDragStart={ handleDragStart }
//                             onDragMove={ () => console.log("moving...") }
//                             onDragEnd={ () => console.log("eng") }
//                         />

//                     )) }
//                     { arrowLines.map((item, i) => (
//                         <Arrow
//                             key={ i }
//                             points={ item.points }
//                             pointerLength={ 20 }
//                             pointerWidth={ 20 }
//                             fill={ item.color }
//                             stroke={ item.color }
//                             strokeWidth={ item.lineWidth }
//                             draggable={ isMouse }
//                             onTap={ handleSelect }
//                             onClick={ handleSelect }
//                         />
//                     )) }
//                     { lines.map((line, i) => (
//                         <Line
//                             key={ i }
//                             points={ line.points }
//                             stroke={ line.color }
//                             strokeWidth={ line.lineWidth }
//                             tension={ 0.2 }
//                             lineCap="round"
//                             globalCompositeOperation="source-over"
//                             draggable={ isMouse }
//                             onClick={ handleSelect }
//                             onTap={ handleSelect }
//                             onDragStart={ handleDragStart }
//                             onDragMove={ () => console.log("moving...") }
//                             onDragEnd={ () => console.log("eng") }
//                         />
//                     )) }

//                     { selectedShape && (
//                         <Transformer
//                             ref={ transformerRef }
//                             boundBoxFunc={ (oldBox, newBox) => {
//                                 if (newBox.width < 20 || newBox.height < 20) {
//                                     return oldBox;
//                                 }
//                                 return newBox;
//                             } }
//                         />
//                     ) }
//                 </Layer>
//             </Stage>
//         </div>
//     );
// }

// export default Editor;

import { useState, useRef, useContext, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text, Image, Transformer, Arrow } from 'react-konva';
import StateContext from '../context/StateContext';

function Editor() {
    const [lines, setLines] = useState([]);
    const [arrowLines, setArrowLines] = useState([]);
    const [rectangles, setRectangles] = useState([]);
    const [triangles, setTriangles] = useState([]);
    const [circles, setCircles] = useState([]);
    const stageRef = useRef(null);

    // Multi selection

    const [selectedShapes, setSelectedShapes] = useState([]);
    const [selectionRect, setSelectionRect] = useState({
        visible: false,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    });
    const [isSelecting, setIsSelecting] = useState(false);
    const selectionRef = useRef(null);

    const {
        color,
        lineWidth,
        setMouse,
        line, setLine,
        arrowLine, setArrowLine,
        isDrawing,
        setIsDrawing,
        isPen,
        strokeWidth,
        strokeColor,
        bgColor,
        rectangle,
        isMouse, setIsMouse,
        triangle,
        circle,
        texts,
        images
    } = useContext(StateContext);

    const handleMouseDown = (e) => {

        if (isMouse && e.target === stageRef.current) {
            const pos = e.target.getStage().getPointerPosition();

            setSelectedShape(null);
            setSelectedShapes([]);

            setIsSelecting(true);
            setSelectionRect({
                visible: true,
                x1: pos.x,
                y1: pos.y,
                x2: pos.x,
                y2: pos.y
            });
            return;
        }

        setIsDrawing(true);
        const pos = e.target.getStage().getPointerPosition();
        if (isPen) {
            setLines([...lines, { points: [pos.x, pos.y], fill: color, strokeWidth: lineWidth }]);
        } else if (line) {
            setLines([...lines, { points: [pos.x, pos.y], fill: strokeColor, strokeWidth }]);
        } else if (rectangle) {
            setRectangles([...rectangles, { x: pos.x, y: pos.y, width: 0, height: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
        } else if (triangle) {
            setTriangles([...triangles, { points: [pos.x, pos.y, pos.x, pos.y, pos.x, pos.y], fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
        } else if (circle) {
            setCircles([...circles, { x: pos.x, y: pos.y, radius: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
        } else if (arrowLine) {
            setArrowLines([...arrowLines, { points: [pos.x, pos.y, pos.x, pos.y], fill: strokeColor, strokeWidth }]);
        }


    };

    const handleMouseMove = (e) => {
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        setMouse({ x: point.x, y: point.y });

        // Handle selection rectangle
        if (isSelecting) {
            setSelectionRect(prev => ({
                ...prev,
                x2: point.x,
                y2: point.y
            }));
            return;
        }

        if (isDrawing) {
            if (isPen) {
                const lastLine = lines[lines.length - 1];
                lastLine.points = lastLine.points.concat([point.x, point.y]);

                lines.splice(lines.length - 1, 1, lastLine);
                setLines([...lines]);
            } else if (line) {
                const lastLine = lines[lines.length - 1];
                const updatedPoints = [lastLine.points[0], lastLine.points[1], point.x, point.y];

                const updatedLine = {
                    ...lastLine,
                    points: updatedPoints
                };

                const newLines = [...lines];
                newLines[newLines.length - 1] = updatedLine;

                setLines(newLines);
            } else if (rectangle) {
                const startX = rectangles[rectangles.length - 1].x;
                const startY = rectangles[rectangles.length - 1].y;

                const width = point.x - startX;
                const height = point.y - startY;

                const lastRect = rectangles[rectangles.length - 1];
                const updatedRect = {
                    ...lastRect,
                    width,
                    height
                };

                const newRects = [...rectangles];
                newRects[newRects.length - 1] = updatedRect;

                setRectangles(newRects);
            } else if (triangle) {
                const startX = triangles[triangles.length - 1].points[0];
                const startY = triangles[triangles.length - 1].points[1];

                const x = point.x - startX;
                const y = point.y - startY;
                const lastTriangle = triangles[triangles.length - 1];
                const updatedTriangle = { ...lastTriangle, points: [...lastTriangle.points] };
                updatedTriangle.points[3] = updatedTriangle.points[1] + y;
                updatedTriangle.points[4] = updatedTriangle.points[0] + x;
                updatedTriangle.points[5] = updatedTriangle.points[1] + y;


                const newTriangles = [...triangles];
                newTriangles[newTriangles.length - 1] = updatedTriangle;

                setTriangles(newTriangles);
            } else if (circle) {
                const startX = circles[circles.length - 1].x;
                const startY = circles[circles.length - 1].y;

                const dx = point.x - startX;
                const dy = point.y - startY;
                const newRadius = Math.sqrt(dx * dx + dy * dy); // Pythagorean theorem to calculate distance

                const lastCircle = circles[circles.length - 1];
                const updatedCircle = { ...lastCircle, radius: newRadius };

                const newCircles = [...circles];
                newCircles[newCircles.length - 1] = updatedCircle;

                setCircles(newCircles);

            } else if (arrowLine) {
                const lastLine = arrowLines[arrowLines.length - 1];
                const updatedPoints = [lastLine.points[0], lastLine.points[1], point.x, point.y];

                const updatedLine = {
                    ...lastLine,
                    points: updatedPoints
                };

                const newLines = [...arrowLines];
                newLines[newLines.length - 1] = updatedLine;

                setArrowLines(newLines);
            }
        }
    };

    const handleMouseUp = () => {
        if (isSelecting) {
            setIsSelecting(false);

            // Calculate selection box
            const selBox = {
                x: Math.min(selectionRect.x1, selectionRect.x2),
                y: Math.min(selectionRect.y1, selectionRect.y2),
                width: Math.abs(selectionRect.x2 - selectionRect.x1),
                height: Math.abs(selectionRect.y2 - selectionRect.y1)
            };

            // Only select if the selection box has some size
            if (selBox.width > 5 && selBox.height > 5) {
                // Find intersecting shapes
                const selectedElements = [];
                const layer = stageRef.current.getLayers()[0];

                layer.children.forEach((shape) => {
                    const shapeBox = shape.getClientRect();
                    if (shape._id === selectionRef.current._id) {
                        return;
                    }
                    if (Konva.Util.haveIntersection(selBox, shapeBox)) {
                        selectedElements.push(shape);
                    }
                });

                setSelectedShapes(selectedElements);
            }

            // Hide selection rectangle
            setTimeout(() => {
                setSelectionRect(prev => ({ ...prev, visible: false }));
            }, 10);

            return;
        }

        setIsDrawing(false)
    };

    const layerRef = useRef(null);

    const clearPartOfCanvas = (x, y, width, height) => {
        const layer = layerRef.current;
        const ctx = layer.getContext();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, width, height);
        ctx.globalCompositeOperation = 'source-over';
        layer.batchDraw();
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            clearPartOfCanvas(330, 450, 200, 200);

        }, 4000);
        return () => clearTimeout(timer);
    }, [])


    const [selectedShape, setSelectedShape] = useState(null);
    const transformerRef = useRef(null);

    const handleSelect = (e) => {
        // if we are selecting with rect, do nothing
        const { x1, x2, y1, y2 } = selectionRect;
        const moved = x1 !== x2 || y1 !== y2;
        if (moved) {
            return;
        }

        const shape = e.target;
        setSelectedShape(shape);
        setSelectedShapes([]);
    };

    const handleDragStart = (e) => {
        e.target.moveToTop();
    };

    useEffect(() => {
        if (transformerRef.current) {
            if (selectedShapes.length > 0) {
                transformerRef.current.nodes(selectedShapes);
            } else if (selectedShape) {
                transformerRef.current.nodes([selectedShape]);
            } else {
                transformerRef.current.nodes([]);
            }
            transformerRef.current.getLayer().batchDraw();
        }
    }, [selectedShape, selectedShapes]);

    const [image, setImage] = useState(null);

    const handleDragMove = () => {}
    const handleDragEnd = () => {}

    return (
        <div className="canvas-container overflow-x-hidden w-screen h-screen relative">

            <Stage
                width={ window.innerWidth }
                height={ window.innerHeight }
                onMouseDown={ handleMouseDown }
                onMouseMove={ handleMouseMove }
                onMouseUp={ handleMouseUp }
                ref={ stageRef }
            >
                <Layer ref={ layerRef }>
                    { images.map((item, i) => (
                        <Image
                            key={ i }
                            className="selectable"
                            image={ item }
                            x={ window.innerWidth / 2 }
                            y={ window.innerHeight / 2 }
                            width={ 300 }
                            height={ 300 / (item.naturalWidth / item.naturalHeight) }
                            draggable={ isMouse }
                            onClick={ handleSelect }
                            onTap={ handleSelect }
                            onDragStart={ handleDragStart }
                            onDragMove={ handleDragMove }
                            onDragEnd={ handleDragEnd }
                        />
                    )) }
                    { texts.map((item, i) => (
                        <Text
                            text={ item.text }
                            className="selectable"
                            x={ window.innerWidth / 2 }
                            y={ window.innerHeight / 2 }
                            fontSize={ 24 }
                            fill={ item.color }
                            draggable={ isMouse }
                            onClick={ handleSelect }
                            onTap={ handleSelect }
                            onDragStart={ handleDragStart }
                            onDragMove={ handleDragMove }
                            onDragEnd={ handleDragEnd }
                        />
                    )) }
                    { circles.map((item, i) => (
                        <Circle
                            key={ i }
                            className="selectable"
                            x={ item.x }
                            y={ item.y }
                            radius={ item.radius }
                            fill={ item.fill }
                            stroke={ item.stroke }
                            strokeWidth={ item.strokeWidth }
                            draggable={ isMouse }
                            onClick={ handleSelect }
                            onTap={ handleSelect }
                            onDragStart={ handleDragStart }
                            onDragMove={ handleDragMove }
                            onDragEnd={ handleDragEnd }
                        />
                    )) }
                    { triangles.map((item, i) => (
                        <Line
                            key={ i }
                            className="selectable"
                            points={ item.points }
                            fill={ item.fill }
                            stroke={ item.stroke }
                            strokeWidth={ item.strokeWidth }
                            closed={ true }
                            draggable={ isMouse }
                            onClick={ handleSelect }
                            onTap={ handleSelect }
                            onDragStart={ handleDragStart }
                            onDragMove={ handleDragMove }
                            onDragEnd={ handleDragEnd }
                        />
                    )) }
                    { rectangles.map((rect, i) => (
                        <Rect
                            key={ i }
                            className="selectable"
                            x={ rect.x }
                            y={ rect.y }
                            width={ rect.width }
                            height={ rect.height }
                            fill={ rect.fill }
                            stroke={ rect.stroke }
                            strokeWidth={ rect.strokeWidth }
                            draggable={ isMouse }
                            onClick={ handleSelect }
                            onTap={ handleSelect }
                            onDragStart={ handleDragStart }
                            onDragMove={ handleDragMove }
                            onDragEnd={ handleDragEnd }
                        />

                    )) }
                    { arrowLines.map((item, i) => (
                        <Arrow
                            key={ i }
                            className="selectable"
                            points={ item.points }
                            pointerLength={ 20 }
                            pointerWidth={ 20 }
                            fill={ item.fill }
                            stroke={ item.fill }
                            strokeWidth={ item.strokeWidth }
                            draggable={ isMouse }
                            onTap={ handleSelect }
                            onClick={ handleSelect }
                            onDragMove={ handleDragMove }
                            onDragEnd={ handleDragEnd }
                        />
                    )) }
                    { lines.map((line, i) => (
                        <Line
                            key={ i }
                            className="selectable"
                            points={ line.points }
                            stroke={ line.fill }
                            strokeWidth={ line.strokeWidth }
                            tension={ 0.2 }
                            lineCap="round"
                            globalCompositeOperation="source-over"
                            draggable={ isMouse }
                            onClick={ handleSelect }
                            onTap={ handleSelect }
                            onDragStart={ handleDragStart }
                            onDragMove={ handleDragMove }
                            onDragEnd={ handleDragEnd } 
                        />
                    )) }

                    {/* Selection Rectangle */ }
                    { selectionRect.visible && (
                        <Rect
                            ref={ selectionRef }
                            x={ Math.min(selectionRect.x1, selectionRect.x2) }
                            y={ Math.min(selectionRect.y1, selectionRect.y2) }
                            width={ Math.abs(selectionRect.x2 - selectionRect.x1) }
                            height={ Math.abs(selectionRect.y2 - selectionRect.y1) }
                            fill="rgba(0, 123, 255, 0.1)"
                            stroke="rgba(0, 123, 255, 0.8)"
                            strokeWidth={ 1 }
                            dash={ [5, 5] }
                            listening={ false }
                        />
                    ) }

                    { (selectedShape || selectedShapes.length > 0) && (
                        <Transformer
                            ref={ transformerRef }
                            boundBoxFunc={ (oldBox, newBox) => {
                                if (newBox.width < 20 || newBox.height < 20) {
                                    return oldBox;
                                }
                                return newBox;
                            } }
                        />
                    ) }
                </Layer>
            </Stage>
        </div>
    );
}

export default Editor;
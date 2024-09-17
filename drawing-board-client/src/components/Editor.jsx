import React, { useState, useRef, useContext, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text, Image, Transformer } from 'react-konva';
import StateContext from '../context/StateContext';

function Editor() {
    const [lines, setLines] = useState([]);
    const [rectangles, setRectangles] = useState([]);
    const [triangles, setTriangles] = useState([]);
    const [circles, setCircles] = useState([]);
    const stageRef = useRef(null);

    const {
        color,
        lineWidth,
        setMouse,
        line, setLine,
        isDrawing,
        setIsDrawing,
        isPen, isMarker, isPencil,
        rectangle,
        isMouse, setIsMouse,
        triangle,
        circle
    } = useContext(StateContext);

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        const pos = e.target.getStage().getPointerPosition();
        if (line || isPen || isMarker || isPencil) {
            setLines([...lines, { points: [pos.x, pos.y], color, lineWidth }]);
        } else if (rectangle) {
            setRectangles([...rectangles, { x: pos.x, y: pos.y, width: 0, height: 0, color }]);
        } else if (triangle) {
            setTriangles([...triangles, { points: [pos.x, pos.y, pos.x, pos.y, pos.x, pos.y], color }]);
        } else if (circle) {
            setCircles([...circles, { x: pos.x, y: pos.y, radius: 0, color }]);
        }

        // Deselect shape
        if (e.target === stageRef.current) {
            setSelectedShape(null);
        }
    };

    const handleMouseMove = (e) => {
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        setMouse({ x: point.x, y: point.y })

        if (isDrawing) {
            if (isPen || isMarker || isPencil) {
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

            }
        }
    };

    const handleMouseUp = () => {
        if (line) {
            setIsMouse(true)
        }
        setLine(false);
        setIsDrawing(false)
    };

    const layerRef = useRef(null);

    // const clearPartOfCanvas = (x, y, width, height) => {
    //     const layer = layerRef.current;
    //     const ctx = layer.getContext();
    //     ctx.globalCompositeOperation = 'destination-out';
    //     ctx.fillStyle = '#000000';
    //     ctx.fillRect(x, y, width, height);
    //     ctx.globalCompositeOperation = 'source-over';
    //     layer.batchDraw();
    // };
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         clearPartOfCanvas(330, 450, 200, 200);

    //     }, 4000);
    //     return () => clearTimeout(timer);
    // }, [])


    const [selectedShape, setSelectedShape] = useState(null);
    const transformerRef = useRef(null);

    const handleSelect = (e) => {
        const shape = e.target;
        setSelectedShape(shape);
    };

    const handleDragStart = (e) => {
        e.target.moveToTop();
    };

    useEffect(() => {
        if (selectedShape && transformerRef.current) {
            transformerRef.current.nodes([selectedShape]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [selectedShape]);

    const [image, setImage] = useState(null);

    useEffect(() => {
        const loadImage = () => {
            const img = new window.Image();
            img.src = 'https://konvajs.org/assets/lion.png'; // Replace with your image URL
            img.onload = () => {
                setImage(img);
            };
        };
        loadImage();
    }, []);

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
                    { image && (
                        <Image
                            image={ image }
                            x={ 100 }
                            y={ 100 }
                            width={ 200 }
                            height={ 200 }
                            draggable
                        />
                    ) }
                    <Text
                        text={ "This is text" }
                        x={ 300 }
                        y={ 200 }
                        fontSize={ 24 }
                        fill="white"
                        draggable={ isMouse }
                        onClick={ handleSelect }
                        onTap={ handleSelect }
                        onDragStart={ handleDragStart }
                    // onDblClick={ handleTextDblClick } // Enable double-click editing
                    // ref={ textRef }
                    />
                    { circles.map((item, i) => (
                        <Circle
                            key={ i }
                            x={ item.x }
                            y={ item.y }
                            radius={ item.radius }
                            fill={ item.color }
                            draggable={ isMouse }
                            onClick={ handleSelect }
                            onTap={ handleSelect }
                            onDragStart={ handleDragStart }
                        />
                    )) }
                    { triangles.map((item, i) => (
                        <Line
                            key={ i }
                            points={ item.points }
                            fill={ item.color }
                            closed={ true }
                            draggable={ isMouse }
                            onClick={ handleSelect }
                            onTap={ handleSelect }
                            onDragStart={ handleDragStart }
                        />
                    )) }
                    { rectangles.map((rect, i) => (
                        <Rect
                            key={ i }
                            x={ rect.x }
                            y={ rect.y }
                            width={ rect.width }
                            height={ rect.height }
                            fill={ rect.color }
                            // stroke="black"
                            strokeWidth={ 2 }
                            draggable={ isMouse }
                            onClick={ handleSelect }
                            onTap={ handleSelect }
                            onDragStart={ handleDragStart }
                        />
                    )) }
                    { lines.map((line, i) => (
                        <Line
                            key={ i }
                            points={ line.points }
                            stroke={ line.color }
                            strokeWidth={ line.lineWidth }
                            tension={ 0.2 }
                            lineCap="round"
                            globalCompositeOperation="source-over"
                            draggable={ isMouse }
                            onClick={ handleSelect }
                            onTap={ handleSelect }
                            onDragStart={ handleDragStart }
                        />
                    )) }

                    { selectedShape && (
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
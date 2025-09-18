import { useState, useRef, useContext, useEffect, useMemo, useCallback } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text, Image, Transformer, Arrow } from 'react-konva';
import StateContext from '../context/StateContext';

const CELL_WIDTH = 100;
const CELL_HEIGHT = 100;

function throttle(func, delay) {
    let timeoutFlag = null;

    return (...args) => {
        if (timeoutFlag === null) {
            func(...args);
            timeoutFlag = setTimeout(() => {
                timeoutFlag = null;
            }, delay);
        }
    };
}


function Editor() {
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
    const [stageScale, setStageScale] = useState(1);

    const [lines, setLines] = useState([]);
    const [arrowLines, setArrowLines] = useState([]);
    const [rectangles, setRectangles] = useState([]);
    const [triangles, setTriangles] = useState([]);
    const [circles, setCircles] = useState([]);
    const [cursor, setCursor] = useState('cursor-crosshair')
    const stageRef = useRef(null);
    const textareaRef = useRef(null);

    // For id
    const textId = useRef(0);
    const penId = useRef(0);
    const lineId = useRef(0);
    const rectId = useRef(0);
    const triangleId = useRef(0);
    const circleId = useRef(0);
    const arrowId = useRef(0);

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
        line,
        arrowLine,
        isDrawing,
        setIsDrawing,
        isPen,
        strokeWidth,
        strokeColor,
        bgColor,
        rectangle,
        isMouse,
        triangle,
        circle,
        texts, setTexts,
        eraser,
        images, setImages,
        isEditing, setIsEditing,
        editingText, setEditingText,
        setIsMouse,
        textFont, textFontSize,
        isPanning,
        gridView
    } = useContext(StateContext);

    // Infinite canvas

    const gridComponents = useMemo(() => {

        // Calculate buffer based on zoom level
        const bufferMultiplier = Math.min(1.6, 1.2 / stageScale);
        const bufferWidth = window.innerWidth * bufferMultiplier;
        const bufferHeight = window.innerHeight * bufferMultiplier;

        // // Calculate visible area bounds
        const startX = Math.floor((-stagePos.x - bufferWidth) / CELL_WIDTH) * CELL_WIDTH;
        const endX = Math.floor((-stagePos.x + bufferWidth * 2) / CELL_WIDTH) * CELL_WIDTH;
        const startY = Math.floor((-stagePos.y - bufferHeight) / CELL_HEIGHT) * CELL_HEIGHT;
        const endY = Math.floor((-stagePos.y + bufferHeight * 2) / CELL_HEIGHT) * CELL_HEIGHT;

        // Generate only visible grid components
        const components = [];
        for (let x = startX; x < endX; x += CELL_WIDTH) {
            for (let y = startY; y < endY; y += CELL_HEIGHT) {
                components.push(
                    <Rect
                        key={ `${x}-${y}` }
                        x={ x }
                        y={ y }
                        width={ CELL_WIDTH }
                        height={ CELL_HEIGHT }
                        fill="#282828"
                        stroke="#a99c9c99"
                        strokeWidth={ gridView ? 1 : 0 }
                    />
                );
            }
        }
        return components;
    }, [gridView, stagePos.x, stagePos.y, stageScale])


    const zoomIn = () => {
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const newScale = Math.min(2.5, oldScale + 0.25);

        stage.scale({ x: newScale, y: newScale });
        setStageScale(newScale);
    };

    const zoomOut = () => {
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const newScale = Math.max(0.75, oldScale - 0.25);

        stage.scale({ x: newScale, y: newScale });
        setStageScale(newScale);
    };

    const resetZoom = () => {
        const stage = stageRef.current;
        stage.scale({ x: 1, y: 1 });
        stage.position({ x: 0, y: 0 });
        setStageScale(1);
        setStagePos({ x: 0, y: 0 });
    };


    // Eraser func

    const [isErasing, setIsErasing] = useState(false);

    const checkAndDeleteShape = (e) => {
        const target = e.target;
        if (!target) return;
        const stage = target.getStage();

        const pointerPosition = stage.getPointerPosition();

        // const shapes = stage.getAllIntersections(pointerPosition);
        const shape = stage.getIntersection(pointerPosition);

        if (!shape) return;

        const shapeId = shape.attrs.id;
        const shapeType = shape.attrs.shapeType;

        switch (shapeType) {
            case 'image':
                setImages(prev => prev.filter(image => image.id !== shapeId));
                break;
            case 'text':
                setTexts(prev => prev.filter(text => text.id !== shapeId));
                break;
            case 'circle':
                setCircles(prev => prev.filter(circle => circle.id !== shapeId));
                break;
            case 'triangle':
                setTriangles(prev => prev.filter(item => item.id !== shapeId));
                break;
            case 'rectangle':
                setRectangles(prev => prev.filter(rect => rect.id !== shapeId));
                break;
            case 'arrowline':
                setArrowLines(prev => prev.filter(arrow => arrow.id !== shapeId));
                break;
            case 'line':
                setLines(prev => prev.filter(line => line.id !== shapeId));
                break;
        }
    };

    const throttledCheckAndDelete = useMemo(
        () => throttle(checkAndDeleteShape, 16),
        []
    );

    const getWorldPosition = (stage) => {
        const pointer = stage.getPointerPosition();
        const stagePosition = stage.position();
        const scale = stage.scaleX();

        return {
            x: (pointer.x - stagePosition.x) / scale,
            y: (pointer.y - stagePosition.y) / scale
        };
    };

    const handleMouseDown = (e) => {
        const stage = e.target.getStage();
        const pos = getWorldPosition(stage);

        if (isEditing) {
            textareaRef.current.style.left = `${pos.x}px`
            textareaRef.current.style.top = `${pos.y}px`
            textareaRef.current.classList.remove('hidden')
            setTimeout(() => {
                textareaRef.current.focus()
            }, 10)
            setIsEditing(false)
        } else if (editingText !== '') {
            handleSaveText()
        }

        if (eraser) {
            setIsErasing(true);
            checkAndDeleteShape(e);
            return;
        }

        if (isMouse && e.target === stageRef.current) {
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
        if (isPen) {
            setLines([...lines, { id: `pen-${penId.current++}`, points: [pos.x, pos.y], fill: color, strokeWidth: lineWidth }]);
        } else if (line) {
            setLines([...lines, { id: `line-${lineId.current++}`, points: [pos.x, pos.y], fill: strokeColor, strokeWidth }]);
        } else if (rectangle) {
            setRectangles([...rectangles, { id: `rect-${rectId.current++}`, x: pos.x, y: pos.y, width: 0, height: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
        } else if (triangle) {
            setTriangles([...triangles, { id: `triangle-${triangleId.current++}`, points: [pos.x, pos.y, pos.x, pos.y, pos.x, pos.y], fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
        } else if (circle) {
            setCircles([...circles, { id: `circle-${circleId.current++}`, x: pos.x, y: pos.y, radius: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
        } else if (arrowLine) {
            setArrowLines([...arrowLines, { id: `arrow-${arrowId.current++}`, points: [pos.x, pos.y, pos.x, pos.y], fill: strokeColor, strokeWidth }]);
        }


    };

    const handleMouseMove = (e) => {
        // Handle Erasing
        const stage = e.target.getStage();
        const point = getWorldPosition(stage);
        const mousePoint = stage.getPointerPosition();

        setMouse({ x: mousePoint.x, y: mousePoint.y });

        if (eraser & isErasing) {
            throttledCheckAndDelete(e)
            return;
        }

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
        if (isErasing) {
            setIsErasing(false)
        }
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
                // const layer = stageRef.current.getLayers()[0];

                layerRef.current.children.forEach((shape) => {
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

        }

        setIsDrawing(false)
    };

    const layerRef = useRef(null);

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

    const handleDragMove = () => { }
    const handleDragEnd = () => { }

    const autoResizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    const handleTextChange = (e) => {
        setEditingText(e.target.value)
        autoResizeTextarea();
    }

    const handleSaveText = () => {
        if (editingText !== '') {
            const rect = textareaRef.current.getBoundingClientRect();
            setTexts([...texts, { id: `text-${textId.current++}`, text: editingText, color, font: textFont, fontSize: textFontSize, left: rect.left, top: rect.top }]);
        }
        textareaRef.current.classList.add("hidden")
        setEditingText('');
        setIsMouse(true);
        autoResizeTextarea();
    }

    useEffect(() => {
        if (eraser) {
            setCursor('cursor-none')
        } else if (isMouse) {
            setCursor('cursor-default')
        } else if (isEditing) {
            setCursor('cursor-text')
        } else if (isPanning) {
            setCursor('cursor-grab')
        } else {
            setCursor('cursor-crosshair')
        }
    }, [eraser, isMouse, isEditing, isPanning])


    return (
        <div className={ `${cursor} canvas-container overflow-x-hidden w-screen h-screen relative` }>
            <Stage
                ref={ stageRef }
                width={ window.innerWidth }
                height={ window.innerHeight }
                x={ stagePos.x }
                y={ stagePos.y }
                scaleX={ stageScale }
                scaleY={ stageScale }
                draggable={ isPanning }
                onDragEnd={ (e) => {
                    setStagePos(e.currentTarget.position());
                } }
                onMouseDown={ handleMouseDown }
                onMouseMove={ handleMouseMove }
                onMouseUp={ handleMouseUp }
            >
                <Layer
                    name='grid'
                    listening={ false }
                >
                    { gridComponents }
                </Layer>
                <Layer ref={ layerRef }>
                    { images.map((item, i) => {
                        const imageWidth = 300;
                        const imageHeight = item.image.naturalHeight
                            ? imageWidth * (item.image.naturalHeight / item.image.naturalWidth)
                            : 300;
                        return (
                            <Image
                                key={ item.id }
                                id={ item.id }
                                shapeType="image"
                                className="selectable"
                                image={ item.image }
                                x={ (window.innerWidth / 2) - (imageWidth / 2) }  // Center horizontally
                                y={ (window.innerHeight / 2) - (imageHeight / 2) }  // Center vertically
                                width={ imageWidth }
                                height={ imageHeight }
                                draggable={ isMouse }
                                onClick={ isMouse ? handleSelect : undefined }
                                onTap={ isMouse ? handleSelect : undefined }
                                onDragStart={ handleDragStart }
                                onDragMove={ handleDragMove }
                                onDragEnd={ handleDragEnd }
                            />
                        )
                    }) }
                    { texts.map((item, i) => (
                        <Text
                            key={ item.id }
                            id={ item.id }
                            shapeType="text"
                            text={ item.text }
                            className="selectable"
                            x={ item.left }
                            y={ item.top }
                            fontFamily={ item.font }
                            fontSize={ item.fontSize }
                            fill={ item.color }
                            draggable={ isMouse }
                            onClick={ isMouse ? handleSelect : undefined }
                            onTap={ isMouse ? handleSelect : undefined }
                            onDragStart={ handleDragStart }
                            onDragMove={ handleDragMove }
                            onDragEnd={ handleDragEnd }
                        />
                    )) }
                    { circles.map((item, i) => (
                        <Circle
                            key={ item.id }
                            id={ item.id }
                            shapeType="circle"
                            className="selectable"
                            x={ item.x }
                            y={ item.y }
                            radius={ item.radius }
                            fill={ item.fill }
                            stroke={ item.stroke }
                            strokeWidth={ item.strokeWidth }
                            draggable={ isMouse }
                            onClick={ isMouse ? handleSelect : undefined }
                            onTap={ isMouse ? handleSelect : undefined }
                            onDragStart={ handleDragStart }
                            onDragMove={ handleDragMove }
                            onDragEnd={ handleDragEnd }
                        />
                    )) }
                    { triangles.map((item, i) => (
                        <Line
                            key={ item.id }
                            id={ item.id }
                            shapeType="triangle"
                            className="selectable"
                            points={ item.points }
                            fill={ item.fill }
                            stroke={ item.stroke }
                            strokeWidth={ item.strokeWidth }
                            closed={ true }
                            draggable={ isMouse }
                            onClick={ isMouse ? handleSelect : undefined }
                            onTap={ isMouse ? handleSelect : undefined }
                            onDragStart={ handleDragStart }
                            onDragMove={ handleDragMove }
                            onDragEnd={ handleDragEnd }
                        />
                    )) }
                    { rectangles.map((rect, i) => (
                        <Rect
                            key={ rect.id }
                            id={ rect.id }
                            shapeType="rectangle"
                            className="selectable"
                            x={ rect.x }
                            y={ rect.y }
                            width={ rect.width }
                            height={ rect.height }
                            fill={ rect.fill }
                            stroke={ rect.stroke }
                            strokeWidth={ rect.strokeWidth }
                            draggable={ isMouse }
                            onClick={ isMouse ? handleSelect : undefined }
                            onTap={ isMouse ? handleSelect : undefined }
                            onDragStart={ handleDragStart }
                            onDragMove={ handleDragMove }
                            onDragEnd={ handleDragEnd }
                        />

                    )) }
                    { arrowLines.map((item, i) => (
                        <Arrow
                            key={ item.id }
                            id={ item.id }
                            shapeType="arrowline"
                            className="selectable"
                            points={ item.points }
                            pointerLength={ 20 }
                            pointerWidth={ 20 }
                            fill={ item.fill }
                            stroke={ item.fill }
                            strokeWidth={ item.strokeWidth }
                            draggable={ isMouse }
                            onTap={ isMouse ? handleSelect : undefined }
                            onClick={ isMouse ? handleSelect : undefined }
                            onDragMove={ handleDragMove }
                            onDragEnd={ handleDragEnd }
                        />
                    )) }
                    { lines.map((line, i) => (
                        <Line
                            key={ line.id }
                            id={ line.id }
                            shapeType="line"
                            className="selectable"
                            points={ line.points }
                            stroke={ line.fill }
                            strokeWidth={ line.strokeWidth }
                            tension={ 0.2 }
                            lineCap="round"
                            globalCompositeOperation="source-over"
                            draggable={ isMouse }
                            onClick={ isMouse ? handleSelect : undefined }
                            onTap={ isMouse ? handleSelect : undefined }
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
            <textarea
                ref={ textareaRef }
                className='hidden bg-transparent overflow-hidden resize-x absolute border border-white outline-none py-1 px-3 rounded-sm'
                value={ editingText }
                onChange={ handleTextChange }
                onBlur={ handleSaveText }
                style={ {
                    fontFamily: textFont,
                    fontSize: `${textFontSize}px`,
                    color: color,
                    zIndex: 1000,
                    height: 'auto',
                    minHeight: '44px',
                } }
                rows={ 1 }
            />
            {/* Zoom Controls */ }
            <div style={ {
                position: 'absolute',
                left: 20,
                bottom: 20,
                zIndex: 1000,
                display: 'flex',
                gap: '20px',
                color: "#fff"
            } }>
                <button onClick={ zoomIn }>Zoom In (+)</button>
                <button onClick={ zoomOut }>Zoom Out (-)</button>
                <button onClick={ resetZoom }>Reset</button>
                <div>Scale: { stageScale.toFixed(2) }x</div>
            </div>
        </div>
    );
}

export default Editor;
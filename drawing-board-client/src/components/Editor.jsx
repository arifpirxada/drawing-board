import { useState, useRef, useContext, useEffect, useMemo } from 'react';
import { Stage, Layer, Rect, Transformer } from 'react-konva';
import StateContext from '../context/StateContext';
import useSocket from '../features/socketio/useSocket';
import { ShapeRenderer } from './Filepage/ShapeRenderer';
import { throttle } from '../utils/throttle';
import { getWorldPosition } from '../utils/getWorldPosition';
import ZoomControls from './Filepage/ZoomControls';
import { useDrawing } from '../hooks/canvas/useDrawing';
import { useEraser } from '../hooks/canvas/useEraser';
import { useSelection } from '../hooks/canvas/useSelection';
import { useTextEditing } from '../hooks/canvas/useTextEditing';
import { useCanvasMouseHandlers } from '../hooks/canvas/useCanvasMouseHandlers';

const CELL_WIDTH = 100;
const CELL_HEIGHT = 100;

function Editor({ fileId, userId, fileData }) {
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
    const [stageScale, setStageScale] = useState(1);

    const [activeDrawings, setActiveDrawings] = useState(new Map());
    const activeDrawingsRef = useRef(activeDrawings);

    const [cursor, setCursor] = useState('cursor-crosshair')
    const stageRef = useRef(null);
    const textareaRef = useRef(null);
    const layerRef = useRef(null);

    const {
        isMouse, setIsMouse, setMouse, isPen, isPanning,
        isDrawing, setIsDrawing,
        lineWidth, strokeWidth, strokeColor,
        textFont, textFontSize,
        color, bgColor,
        line, arrowLine, rectangle, triangle, circle, eraser,
        // isEditing, setIsEditing, editingText, setEditingText,
        gridView,
        shapes, setShapes
    } = useContext(StateContext);

    const { emit, on, off } = useSocket();

    // .

    const { drawingHandlers } = useDrawing({ isPen, line, rectangle, rectangle, circle, arrowLine });
    const { eraserHandlers } = useEraser({ setShapes, fileId });
    const { selectionHandlers, transformerRef } = useSelection({ layerRef })
    const { textHandlers, isEditing } = useTextEditing({ setShapes, textareaRef });

    const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasMouseHandlers({
        stageRef,
        eraser, isMouse, isEditing, isPanning,
        drawingHandlers, eraserHandlers, selectionHandlers, textHandlers
    })

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
                        fill="#121212"
                        stroke="#1E1E1E"
                        strokeWidth={ gridView ? 1 : 0 }
                    />
                );
            }
        }
        return components;
    }, [gridView, stagePos.x, stagePos.y, stageScale])

    // Socket events

    useEffect(() => {
        activeDrawingsRef.current = activeDrawings;
    }, [activeDrawings]);

    useEffect(() => {

        const updateLine = (data) => {
            if (data.userId === userId) return;

            const targetShapeId = activeDrawingsRef.current.get(data.userId);

            if (targetShapeId === data.id) {
                setShapes(prevLines =>
                    prevLines.map(line =>
                        line.id === data.id
                            ? { ...line, points: line.points.concat([data.points.x, data.points.y]) }
                            : line
                    )
                );
            }
        }


        const updateStraightLine = (data) => {
            if (data.userId === userId) return;

            const targetShapeId = activeDrawingsRef.current.get(data.userId);
            if (targetShapeId !== data.id) return;

            setShapes(prevLines =>
                prevLines.map((line) => {
                    if (line.id === data.id) {
                        return { ...line, points: [line.points[0], line.points[1], data.points.x, data.points.y] }
                    } else {
                        return line;
                    }
                })
            )
        }

        const updateRectangle = (data) => {
            const targetShapeId = activeDrawingsRef.current.get(data.userId);
            if (targetShapeId !== data.id) return;

            setShapes((prevRects) =>
                prevRects.map((rect) => {
                    if (rect.id === data.id) {
                        const width = data.points.x - rect.x;
                        const height = data.points.y - rect.y;

                        return { ...rect, width, height }
                    } else {
                        return rect;
                    }
                })
            )
        }

        const updateTriangle = (data) => {
            const targetShapeId = activeDrawingsRef.current.get(data.userId);
            if (targetShapeId !== data.id) return;

            setShapes((prevTriangles) =>
                prevTriangles.map((triangle) => {
                    if (triangle.id === data.id) {
                        const startX = triangle.points[0];
                        const startY = triangle.points[1];

                        const x = data.points.x - startX;
                        const y = data.points.y - startY;

                        const updatedTriangle = { ...triangle, points: [...triangle.points] };

                        updatedTriangle.points[3] = updatedTriangle.points[1] + y;
                        updatedTriangle.points[4] = updatedTriangle.points[0] + x;
                        updatedTriangle.points[5] = updatedTriangle.points[1] + y;

                        return updatedTriangle;
                    } else {
                        return triangle;
                    }
                })
            )
        }

        const updateCircle = (data) => {
            if (data.userId === userId) return;

            const targetShapeId = activeDrawingsRef.current.get(data.userId);
            if (targetShapeId !== data.id) return;

            setShapes((prevCircles) =>
                prevCircles.map((circle) => {
                    if (circle.id === data.id) {
                        const dx = data.points.x - circle.x;
                        const dy = data.points.y - circle.y;

                        const newRadius = Math.sqrt(dx * dx + dy * dy);

                        return { ...circle, radius: newRadius }
                    } else {
                        return circle;
                    }
                })
            )
        }

        const updateArrowLine = (data) => {
            if (data.userId === userId) return;

            const targetShapeId = activeDrawingsRef.current.get(data.userId);
            if (targetShapeId !== data.id) return;

            setShapes((prevArrowLines) =>
                prevArrowLines.map((arrowLine) => {
                    if (arrowLine.id === data.id) {
                        return { ...arrowLine, points: [arrowLine.points[0], arrowLine.points[1], data.points.x, data.points.y] }
                    } else {
                        return arrowLine;
                    }
                })
            )
        }

        // Image

        const addImage = (data) => {
            const baseURL = import.meta.env.VITE_SERVER_URL
            if (!baseURL) return;

            const url = baseURL + "/uploads/" + data.name;

            const image = new Image();
            const imageData = {
                id: data.id,
                userId: data.userId,
                image,
                src: url
            };

            image.onload = function () {
                setShapes((prev) => [...prev, imageData]);
            };
            image.src = url;
        }

        // Other

        const drawingComplete = (data) => {
            if (data.userId !== userId) {
                // Remove from active drawings
                setActiveDrawings(prev => {
                    const updated = new Map(prev);
                    updated.delete(data.userId);
                    return updated;
                });
            }
        }

        const transformShape = (data) => {
            const stateMap = {
                'line': setLines,
                'rectangle': setRectangles,
                'triangle': setTriangles,
                'circle': setCircles,
                'arrowline': setArrowLines,
                'image': setImages,
                'text': setTexts
            };

            const setter = stateMap[data.shapeType];
            if (setter) {
                setter(prev => prev.map(shape =>
                    shape.id === data.id
                        ? { ...shape, scaleX: data.scaleX, scaleY: data.scaleY, rotation: data.rotation, x: data.x, y: data.y }
                        : shape
                ));
            }

        }

        const dragShape = (data) => {
            const stateMap = {
                'line': setLines,
                'rectangle': setRectangles,
                'triangle': setTriangles,
                'circle': setCircles,
                'arrowline': setArrowLines,
                'image': setImages,
                'text': setTexts
            };

            const setter = stateMap[data.shapeType];
            if (setter) {
                setter(prev => prev.map(shape =>
                    shape.id === data.id
                        ? { ...shape, x: data.x, y: data.y }
                        : shape
                ));
            }
        }

        const handleDraw = (data) => {
            if (data.userId === userId) return;
            setActiveDrawings(prev => new Map(prev).set(data.userId, data.id));

            if (data.type == "image") {
                addImage(data);
            } else {
                setShapes((prev) => [...prev, data]);
            }
        }

        const handleUpdate = (data) => {
            if (data.userId === userId) return;

            switch (data.type) {
                case "line":
                    updateLine(data);
                    break;
                case "straight_line":
                    updateStraightLine(data)
                    break;
                case "rectangle":
                    updateRectangle(data);
                    break;
                case "triangle":
                    updateTriangle(data);
                    break;
                case "circle":
                    updateCircle(data);
                    break;
                case "arrow_line":
                    updateArrowLine(data);

            }
        }

        const handleDelete = (data) => {
            if (data.userId === userId) return;

            setShapes((prev) =>
                prev.filter((item) => item.id != data.id)
            );
        }

        // Drawing events
        on('draw_shape', handleDraw);
        on('update_shape', handleUpdate);
        on('delete_shape', handleDelete);


        // Other
        on('drawing_complte', drawingComplete)
        on('transform_shape', transformShape);
        on('drag_shape', dragShape);

        return () => {
            off('drawing_complte', drawingComplete)
            off('transform_shape', transformShape);
            off('drag_shape', dragShape);

            off('drawing_complte', drawingComplete)
            off('transform_shape', transformShape);
            off('drag_shape', dragShape);
        };
    }, [on, off]);

    // Load File Data

    // useEffect(() => {
    //     setShapes([]);

    //     if (!fileData) return

    //     fileData.lines && setLines(fileData.lines)
    //     fileData.arrowLines && setArrowLines(fileData.arrowLines)
    //     fileData.rectangles && setRectangles(fileData.rectangles)
    //     fileData.triangles && setTriangles(fileData.triangles)
    //     fileData.circles && setCircles(fileData.circles)
    //     fileData.texts && setTexts(fileData.texts)

    //     if (fileData.images) {
    //         const baseURL = import.meta.env.VITE_SERVER_URL;
    //         if (baseURL) {
    //             fileData.images.forEach((img) => {
    //                 const image = new Image();
    //                 const imageUrl = baseURL + "/uploads/" + img.name;

    //                 image.onload = () => {
    //                     setImages((prev) => {
    //                         const alreadyExists = prev.some((p) => p.id === img.id);
    //                         if (alreadyExists) return prev;
    //                         return [...prev, { id: img.id, userId: img.userId, image, url: imageUrl, x: img.x, y: img.y, scaleX: img.scaleX, scaleY: img.scaleY, rotation: img.rotation }];
    //                     });
    //                 }

    //                 image.src = imageUrl;
    //             })
    //         }
    //     }

    // }, [fileData])


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
                onPointerDown={ handleMouseDown }
                onPointerMove={ handleMouseMove }
                onPointerUp={ handleMouseUp }
            >
                <Layer
                    name='grid'
                    listening={ false }
                >
                    { gridComponents }
                </Layer>
                <Layer ref={ layerRef }>
                    { shapes.map((shape) => (
                        ShapeRenderer(shape)
                    )) }
                </Layer>
                <Layer
                    name="transform"
                >
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
            <ZoomControls stageRef={ stageRef } setStageScale={ setStageScale } />
        </div>
    );
}

export default Editor;
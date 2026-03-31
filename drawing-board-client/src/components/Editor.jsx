import { useState, useRef, useContext, useEffect, useMemo } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text, Image as KonvaImage, Transformer, Arrow } from 'react-konva';
import StateContext from '../context/StateContext';
import useSocket from '../features/socketio/useSocket';

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


function Editor({ fileId, userId, fileData }) {
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
    const [stageScale, setStageScale] = useState(1);

    const [activeDrawings, setActiveDrawings] = useState(new Map());
    const activeDrawingsRef = useRef(activeDrawings);

    const [lines, setLines] = useState([]);
    const [arrowLines, setArrowLines] = useState([]);
    const [rectangles, setRectangles] = useState([]);
    const [triangles, setTriangles] = useState([]);
    const [circles, setCircles] = useState([]);
    const [cursor, setCursor] = useState('cursor-crosshair')
    const stageRef = useRef(null);
    const textareaRef = useRef(null);

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
        mouse,
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

    const { emit, on, off } = useSocket();

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
                emit('delete_image', { room: fileId, id: shapeId })
                break;
            case 'text':
                setTexts(prev => prev.filter(text => text.id !== shapeId));
                emit('delete_text', { room: fileId, id: shapeId })
                break;
            case 'circle':
                setCircles(prev => prev.filter(circle => circle.id !== shapeId));
                emit('delete_circle', { room: fileId, id: shapeId })
                break;
            case 'triangle':
                setTriangles(prev => prev.filter(item => item.id !== shapeId));
                emit('delete_triangle', { room: fileId, id: shapeId })
                break;
            case 'rectangle':
                setRectangles(prev => prev.filter(rect => rect.id !== shapeId));
                emit('delete_rectangle', { room: fileId, id: shapeId })
                break;
            case 'arrowline':
                setArrowLines(prev => prev.filter(arrow => arrow.id !== shapeId));
                emit('delete_arrow_line', { room: fileId, id: shapeId })
                break;
            case 'line':
                setLines(prev => prev.filter(line => line.id !== shapeId));
                emit('delete_line', { room: fileId, id: shapeId })
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
            const id = `pen-${userId}-${Date.now()}`
            setLines([...lines, { id, userId, points: [pos.x, pos.y], fill: color, strokeWidth: lineWidth }]);
            setActiveDrawings(prev => new Map(prev).set(userId, id));
            emit('draw_line', { room: fileId, id, userId, points: [pos.x, pos.y], fill: color, strokeWidth: lineWidth, scaleX: 1, scaleY: 1, rotation: 0 });
        } else if (line) {
            const id = `line-${userId}-${Date.now()}`
            setLines([...lines, { id, userId, points: [pos.x, pos.y], fill: strokeColor, strokeWidth }]);
            setActiveDrawings(prev => new Map(prev).set(userId, id));
            emit('draw_straight_line', { room: fileId, id, userId, points: [pos.x, pos.y], fill: color, strokeWidth })
        } else if (rectangle) {
            const id = `rect-${userId}-${Date.now()}`
            setRectangles([...rectangles, { id, userId, x: pos.x, y: pos.y, width: 0, height: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
            setActiveDrawings(prev => new Map(prev).set(userId, id));
            emit('draw_rectangle', { room: fileId, id, userId, x: pos.x, y: pos.y, width: 0, height: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth })
        } else if (triangle) {
            const id = `triangle-${userId}-${Date.now()}`
            setTriangles([...triangles, { id, userId, points: [pos.x, pos.y, pos.x, pos.y, pos.x, pos.y], fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
            setActiveDrawings(prev => new Map(prev).set(userId, id));
            emit('draw_triangle', { room: fileId, id, userId, points: [pos.x, pos.y, pos.x, pos.y, pos.x, pos.y], fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth })
        } else if (circle) {
            const id = `circle-${userId}-${Date.now()}`
            setCircles([...circles, { id, userId, x: pos.x, y: pos.y, radius: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
            setActiveDrawings(prev => new Map(prev).set(userId, id));
            emit('draw_circle', { room: fileId, id, userId, x: pos.x, y: pos.y, radius: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth })
        } else if (arrowLine) {
            const id = `arrow-${userId}-${Date.now()}`
            setArrowLines([...arrowLines, { id, userId, points: [pos.x, pos.y, pos.x, pos.y], fill: strokeColor, strokeWidth }]);
            setActiveDrawings(prev => new Map(prev).set(userId, id));
            emit('draw_arrow_line', { room: fileId, id, userId, points: [pos.x, pos.y, pos.x, pos.y], fill: strokeColor, strokeWidth })
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

            const myActiveShapeId = activeDrawings.get(userId);

            if (!myActiveShapeId) return;

            if (isPen) {
                setLines((prevLines) =>
                    prevLines.map((line) => {
                        if (line.id === myActiveShapeId) {
                            return { ...line, points: line.points.concat([point.x, point.y]) }
                        } else {
                            return line;
                        }
                    })
                )
                emit('update_line', {
                    room: fileId,
                    id: myActiveShapeId,
                    userId: userId,
                    points: point
                });
            } else if (line) {
                setLines((prevLines) =>
                    prevLines.map((line) => {
                        if (line.id === myActiveShapeId) {
                            return { ...line, points: [line.points[0], line.points[1], point.x, point.y] };
                        } else {
                            return line;
                        }
                    })
                )
                emit('update_straight_line', {
                    room: fileId,
                    id: myActiveShapeId,
                    userId: userId,
                    points: point
                })
            } else if (rectangle) {
                setRectangles((prevRects) =>
                    prevRects.map((rect) => {
                        if (rect.id === myActiveShapeId) {
                            const startX = rect.x;
                            const startY = rect.y;

                            const width = point.x - startX;
                            const height = point.y - startY;

                            return { ...rect, width, height }
                        } else {
                            return rect;
                        }
                    })
                )
                emit('update_rectangle', {
                    room: fileId,
                    id: myActiveShapeId,
                    userId: userId,
                    points: point
                })
            } else if (triangle) {
                setTriangles((prevTriangles) =>
                    prevTriangles.map((triangle) => {
                        if (triangle.id === myActiveShapeId) {
                            const startX = triangle.points[0]
                            const startY = triangle.points[1]

                            const x = point.x - startX;
                            const y = point.y - startY;

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
                emit('update_triangle', {
                    room: fileId,
                    id: myActiveShapeId,
                    userId: userId,
                    points: point
                })
            } else if (circle) {
                setCircles((prevCircles) =>
                    prevCircles.map((circle) => {
                        if (circle.id === myActiveShapeId) {
                            const startX = circle.x;
                            const startY = circle.y;

                            const dx = point.x - startX;
                            const dy = point.y - startY;

                            const newRadius = Math.sqrt(dx * dx + dy * dy); // Pythagorean theorem to calculate distance

                            return { ...circle, radius: newRadius }

                        } else {
                            return circle;
                        }
                    })
                )
                emit('update_circle', {
                    room: fileId,
                    id: myActiveShapeId,
                    userId: userId,
                    points: point
                })
            } else if (arrowLine) {
                setArrowLines((prevArrowLines) =>
                    prevArrowLines.map((arrowLine) => {
                        if (arrowLine.id === myActiveShapeId) {
                            return { ...arrowLine, points: [arrowLine.points[0], arrowLine.points[1], point.x, point.y] }
                        } else {
                            return arrowLine;
                        }
                    })
                )
                emit('update_arrow_line', {
                    room: fileId,
                    id: myActiveShapeId,
                    userId: userId,
                    points: point
                })
            }
        }
    };

    const handleMouseUp = () => {
        // Clear MY active drawing
        setActiveDrawings(prev => {
            const updated = new Map(prev);
            updated.delete(userId);
            return updated;
        });

        emit('drawing_complete', {
            room: fileId,
            userId: userId
        });

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

    // Load File Data

    useEffect(() => {
    if (!fileData) return

    fileData.lines && setLines(fileData.lines)
    fileData.arrowLines && setArrowLines(fileData.arrowLines) 
    fileData.rectangles && setRectangles(fileData.rectangles)
    fileData.triangles && setTriangles(fileData.triangles)  
    fileData.circles && setCircles(fileData.circles)
    fileData.texts && setTexts(fileData.texts)

    if (fileData.images) {
        const baseURL = import.meta.env.VITE_SERVER_URL;
        if (baseURL) {
            setImages([]);
            
            fileData.images.forEach((img) => {
                const image = new Image();
                const imageUrl = baseURL + "/uploads/" + img.name;

                image.onload = () => {
                    setImages((prev) => {
                        const alreadyExists = prev.some((p) => p.id === img.id);
                        if (alreadyExists) return prev;
                        return [...prev, { id: img.id, userId: img.userId, image, url: imageUrl, x: img.x, y: img.y, scaleX: img.scaleX, scaleY: img.scaleY, rotation: img.rotation }];
                    });
                }

                image.src = imageUrl;
            })
        }
    }

}, [fileData])
    
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
            const id = `text-${userId}-${Date.now()}`
            const rect = textareaRef.current.getBoundingClientRect();
            setTexts([...texts, { id, userId, text: editingText, color, font: textFont, fontSize: textFontSize, left: rect.left, top: rect.top }]);

            emit('add_text', { room: fileId, id, userId, text: editingText, color, font: textFont, fontSize: textFontSize, left: rect.left, top: rect.top })
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


    const handleDragMove = (e, shapeId, shapeType) => {
        const node = e.target;

        const x = node.x();
        const y = node.y(); 

        emit('drag_shape', { room: fileId, id: shapeId, shapeType, x, y })
    }

    const handleDragEnd = (e, shapeId, shapeType) => {
        const node = e.target;

        const x = node.x();
        const y = node.y();

        emit('drag_shape_end', { room: fileId, id: shapeId, shapeType, x, y })
    }


    const handleTransformEnd = (e, shapeId, shapeType) => {
        const node = e.target;

        const x = node.x();
        const y = node.y();
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        const rotation = node.rotation();

        emit('transform_shape', { room: fileId, id: shapeId, shapeType, scaleX, scaleY, rotation, x, y })
    }



    // Socket events

    useEffect(() => {
        activeDrawingsRef.current = activeDrawings;
    }, [activeDrawings]);

    useEffect(() => {

        // Pen Drawing Handlers
        const drawLine = (data) => {
            if (data.userId === userId) {
                return;
            }
            setLines(prevLines => [...prevLines, data]);
            setActiveDrawings(prev => new Map(prev).set(data.userId, data.id));
        }


        const updateLine = (data) => {
            if (data.userId === userId) return;

            const targetShapeId = activeDrawingsRef.current.get(data.userId);

            if (targetShapeId === data.id) {
                setLines(prevLines =>
                    prevLines.map(line =>
                        line.id === data.id
                            ? { ...line, points: line.points.concat([data.points.x, data.points.y]) }
                            : line
                    )
                );
            }
        }

        const deleteLine = (data) => {
            if (data.userId === userId) return;

            setLines((prevLines) =>
                prevLines.filter((line) => line.id !== data.id)
            )
        }

        // straight line

        const drawStraightLine = (data) => {
            if (data.userId === userId) return;

            setLines(prevLines => [...prevLines, data]);
            setActiveDrawings(prev => new Map(prev).set(data.userId, data.id))
        }

        const updateStraightLine = (data) => {
            if (data.userId === userId) return;

            const targetShapeId = activeDrawingsRef.current.get(data.userId);
            if (targetShapeId !== data.id) return;

            setLines(prevLines =>
                prevLines.map((line) => {
                    if (line.id === data.id) {
                        return { ...line, points: [line.points[0], line.points[1], data.points.x, data.points.y] }
                    } else {
                        return line;
                    }
                })
            )
        }

        // Rect angle

        const drawRectangle = (data) => {
            if (data.userId === userId) return;

            setRectangles((prev) => [...prev, data])
            setActiveDrawings(prev => new Map(prev).set(data.userId, data.id))
        }

        const updateRectangle = (data) => {
            if (data.userId === userId) return;

            const targetShapeId = activeDrawingsRef.current.get(data.userId);
            if (targetShapeId !== data.id) return;

            setRectangles((prevRects) =>
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

        const deleteRectangle = (data) => {
            if (data.userId === userId) return;

            setRectangles((prevRects) =>
                prevRects.filter((rect) => rect.id !== data.id)
            )
        }


        // Triangle

        const drawTriangle = (data) => {
            if (data.userId === userId) return;

            setTriangles((prev) => [...prev, data])
            setActiveDrawings(prev => new Map(prev).set(data.userId, data.id))
        }

        const updateTriangle = (data) => {
            if (data.userId === userId) return;

            const targetShapeId = activeDrawingsRef.current.get(data.userId);
            if (targetShapeId !== data.id) return;

            setTriangles((prevTriangles) =>
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

        const deleteTriangle = (data) => {
            if (data.userId === userId) return;

            setTriangles((prevTriangles) =>
                prevTriangles.filter((item) => item.id !== data.id)
            )
        }



        // Circle

        const drawCircle = (data) => {
            if (data.userId === userId) return;

            setCircles((prev) => [...prev, data])
            setActiveDrawings(prev => new Map(prev).set(data.userId, data.id))
        }

        const updateCircle = (data) => {
            if (data.userId === userId) return;

            const targetShapeId = activeDrawingsRef.current.get(data.userId);
            if (targetShapeId !== data.id) return;

            setCircles((prevCircles) =>
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

        const deleteCircle = (data) => {
            if (data.userId === userId) return;

            setCircles((prevCircles) =>
                prevCircles.filter((item) => item.id !== data.id)
            )
        }


        // Arrow line

        const drawArrowLine = (data) => {
            if (data.userId === userId) return;

            setArrowLines((prev) => [...prev, data])
            setActiveDrawings(prev => new Map(prev).set(data.userId, data.id))
        }

        const updateArrowLine = (data) => {
            if (data.userId === userId) return;

            const targetShapeId = activeDrawingsRef.current.get(data.userId);
            if (targetShapeId !== data.id) return;

            setArrowLines((prevArrowLines) =>
                prevArrowLines.map((arrowLine) => {
                    if (arrowLine.id === data.id) {
                        return { ...arrowLine, points: [arrowLine.points[0], arrowLine.points[1], data.points.x, data.points.y] }
                    } else {
                        return arrowLine;
                    }
                })
            )
        }

        const deleteArrowLine = (data) => {
            if (data.userId === userId) return;

            setArrowLines((prev) =>
                prev.filter((item) => item.id !== data.id)
            )
        }

        // Image

        const addImage = (data) => {
            if (data.userId === userId) return;

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
                setImages((prev) => [...prev, imageData]);
            };
            image.src = url;
        }

        const deleteImage = (data) => {
            if (data.userId === userId) return;

            setImages((prev) =>
                prev.filter((item) => item.id !== data.id)
            )
        }


        // Text

        const addText = (data) => {
            if (data.userId === userId) return

            setTexts((prevTexts) => [...prevTexts, data])
        }

        const deleteText = (data) => {
            if (data.userId === userId) return;

            setTexts((prev) =>
                prev.filter((item) => item.id !== data.id)
            )
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

        // Pen Drawing event listeners
        on('draw_line', drawLine);
        on('update_line', updateLine);
        on('delete_line', deleteLine)

        // Straight line listeners
        on('draw_straight_line', drawStraightLine)
        on('update_straight_line', updateStraightLine)

        // Rectangle

        on('draw_rectangle', drawRectangle)
        on('update_rectangle', updateRectangle)
        on('delete_rectangle', deleteRectangle)

        // Triangle

        on('draw_triangle', drawTriangle)
        on('update_triangle', updateTriangle)
        on('delete_triangle', deleteTriangle)

        // Circle

        on('draw_circle', drawCircle)
        on('update_circle', updateCircle)
        on('delete_circle', deleteCircle)

        // Arrow Line

        on('draw_arrow_line', drawArrowLine)
        on('update_arrow_line', updateArrowLine)
        on('delete_arrow_line', deleteArrowLine)


        // Add Image

        on('add_image', addImage)
        on('delete_image', deleteImage)

        // Add Text

        on('add_text', addText)
        on('delete_text', deleteText)


        // Other
        on('drawing_complte', drawingComplete)
        on('transform_shape', transformShape);
        on('drag_shape', dragShape);

        return () => {
            off('draw_line', drawLine);
            off('update_line', updateLine);
            off('delete_line', deleteLine)

            off('draw_straight_line', drawStraightLine)
            off('update_straight_line', updateStraightLine)
            off('draw_rectangle', drawRectangle)

            off('update_rectangle', updateRectangle)
            off('delete_rectangle', deleteRectangle)
            off('draw_triangle', drawTriangle)

            off('update_triangle', updateTriangle)
            off('delete_triangle', deleteTriangle)

            off('draw_circle', drawCircle)
            off('update_circle', updateCircle)
            off('delete_circle', deleteCircle)

            off('draw_arrow_line', drawArrowLine)
            off('update_arrow_line', updateArrowLine)
            off('add_image', addImage)
            off('delete_image', deleteImage)

            off('add_text', addText)
            off('delete_text', deleteText)

            off('drawing_complte', drawingComplete)
            off('transform_shape', transformShape);
            off('drag_shape', dragShape);
        };
    }, [on, off]);


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
                            <KonvaImage
                                key={ item.id }
                                id={ item.id }
                                shapeType="image"
                                className="selectable"
                                image={ item.image }
                                x={ item.x ? item.x : (window.innerWidth / 2) - (imageWidth / 2) }  // Center horizontally
                                y={ item.y ? item.y : (window.innerHeight / 2) - (imageHeight / 2) }  // Center vertically
                                width={ imageWidth }
                                height={ imageHeight }
                                scaleX={ item.scaleX }
                                scaleY={ item.scaleY }
                                rotation={ item.rotation }
                                draggable={ isMouse }
                                onClick={ isMouse ? handleSelect : undefined }
                                onTap={ isMouse ? handleSelect : undefined }
                                onDragStart={ handleDragStart }
                                onDragMove={ (e) => handleDragMove(e, item.id, 'image') }
                                onDragEnd={ (e) => handleDragEnd(e, item.id, 'image') }
                                onTransformEnd={ (e) => handleTransformEnd(e, item.id, 'image') }
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
                            x={ item.x ? item.x : item.left }
                            y={ item.y ? item.y : item.top }
                            scaleX={ item.scaleX }
                            scaleY={ item.scaleY }
                            rotation={ item.rotation }
                            fontFamily={ item.font }
                            fontSize={ item.fontSize }
                            fill={ item.color }
                            draggable={ isMouse }
                            onClick={ isMouse ? handleSelect : undefined }
                            onTap={ isMouse ? handleSelect : undefined }
                            onDragStart={ handleDragStart }
                            onDragMove={ (e) => handleDragMove(e, item.id, 'text') }
                            onDragEnd={ (e) => handleDragEnd(e, item.id, 'text') }
                            onTransformEnd={ (e) => handleTransformEnd(e, item.id, 'text') }
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
                            scaleX={ item.scaleX }
                            scaleY={ item.scaleY }
                            rotation={ item.rotation }
                            radius={ item.radius }
                            fill={ item.fill }
                            stroke={ item.stroke }
                            strokeWidth={ item.strokeWidth }
                            draggable={ isMouse }
                            onClick={ isMouse ? handleSelect : undefined }
                            onTap={ isMouse ? handleSelect : undefined }
                            onDragStart={ handleDragStart }
                            onDragMove={ (e) => handleDragMove(e, item.id, 'circle') }
                            onDragEnd={ (e) => handleDragEnd(e, item.id, 'circle') }
                            onTransformEnd={ (e) => handleTransformEnd(e, item.id, 'circle') }
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
                            x={ item.x }
                            y={ item.y }
                            scaleX={ item.scaleX }
                            scaleY={ item.scaleY }
                            rotation={ item.rotation }
                            closed={ true }
                            draggable={ isMouse }
                            onClick={ isMouse ? handleSelect : undefined }
                            onTap={ isMouse ? handleSelect : undefined }
                            onDragStart={ handleDragStart }
                            onDragMove={ (e) => handleDragMove(e, item.id, 'triangle') }
                            onDragEnd={ (e) => handleDragEnd(e, item.id, 'triangle') }
                            onTransformEnd={ (e) => handleTransformEnd(e, item.id, 'triangle') }
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
                            scaleX={ rect.scaleX }
                            scaleY={ rect.scaleY }
                            rotation={ rect.rotation }
                            draggable={ isMouse }
                            onClick={ isMouse ? handleSelect : undefined }
                            onTap={ isMouse ? handleSelect : undefined }
                            onDragStart={ handleDragStart }
                            onDragMove={ (e) => handleDragMove(e, rect.id, 'rectangle') }
                            onDragEnd={ (e) => handleDragEnd(e, rect.id, 'rectangle') }
                            onTransformEnd={ (e) => handleTransformEnd(e, rect.id, 'rectangle') }
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
                            x={ item.x }
                            y={ item.y }
                            scaleX={ item.scaleX }
                            scaleY={ item.scaleY }
                            rotation={ item.rotation }
                            draggable={ isMouse }
                            onTap={ isMouse ? handleSelect : undefined }
                            onClick={ isMouse ? handleSelect : undefined }
                            onDragMove={ (e) => handleDragMove(e, item.id, 'arrowline') }
                            onDragEnd={ (e) => handleDragEnd(e, item.id, 'arrowline') }
                            onTransformEnd={ (e) => handleTransformEnd(e, item.id, 'arrowline') }
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
                            scaleX={ line.scaleX }
                            scaleY={ line.scaleY }
                            rotation={ line.rotation }
                            x={ line.x }
                            y={ line.y }
                            tension={ 0.2 }
                            lineCap="round"
                            globalCompositeOperation="source-over"
                            draggable={ isMouse }
                            onClick={ isMouse ? handleSelect : undefined }
                            onTap={ isMouse ? handleSelect : undefined }
                            onDragStart={ handleDragStart }
                            onDragMove={ (e) => handleDragMove(e, line.id, 'line') }
                            onDragEnd={ (e) => handleDragEnd(e, line.id, 'line') }
                            onTransformEnd={ (e) => handleTransformEnd(e, line.id, 'line') }
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
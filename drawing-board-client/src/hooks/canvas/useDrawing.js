import { useState, useRef } from "react"
import { generateShapeId } from "../../utils/generateShapeId";

export const useDrawing = ({
    isPen, line, rectangle, triangle, circle, arrowLine,
    color, bgColor, strokeColor, lineWidth, strokeWidth,
    shapes, setShapes, fileId, userId, emit
}) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [activeDrawings, setActiveDrawings] = useState(new Map());
    const activeDrawingsRef = useRef(activeDrawings);

    const handleMouseDown = (pos) => {
        setIsDrawing(true);
        const id = generateShapeId(userId);
        setActiveDrawings(prev => new Map(prev).set(userId, id));


        if (isPen) {
            setShapes(prev => [...prev, { id, userId, type: 'line', points: [pos.x, pos.y], fill: color, strokeWidth: lineWidth }]);
            emit('draw_shape', { room: fileId, id, userId, type: 'line', points: [pos.x, pos.y], fill: color, strokeWidth: lineWidth, scaleX: 1, scaleY: 1, rotation: 0 });
        } else if (line) {
            setShapes(prev => [...prev, { id, userId, type: 'straight_line', points: [pos.x, pos.y], fill: strokeColor, strokeWidth }]);
            emit('draw_shape', { room: fileId, id, userId, type: 'straight_line', points: [pos.x, pos.y], fill: color, strokeWidth })
        } else if (rectangle) {
            setShapes(prev => [...prev, { id, userId, type: 'rectangle', x: pos.x, y: pos.y, width: 0, height: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
            emit('draw_shape', { room: fileId, id, userId, type: 'rectangle', x: pos.x, y: pos.y, width: 0, height: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth })
        } else if (triangle) {
            setShapes(prev => [...prev, { id, userId, type: 'triangle', points: [pos.x, pos.y, pos.x, pos.y, pos.x, pos.y], fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
            emit('draw_shape', { room: fileId, id, userId, type: 'triangle', points: [pos.x, pos.y, pos.x, pos.y, pos.x, pos.y], fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth })
        } else if (circle) {
            setShapes(prev => [...prev, { id, userId, type: 'circle', x: pos.x, y: pos.y, radius: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
            emit('draw_shape', { room: fileId, id, userId, type: 'circle', x: pos.x, y: pos.y, radius: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth })
        } else if (arrowLine) {
            setShapes(prev => [...prev, { id, userId, type: 'arrow_line', points: [pos.x, pos.y, pos.x, pos.y], fill: strokeColor, strokeWidth }]);
            emit('draw_shape', { room: fileId, id, userId, type: 'arrow_line', points: [pos.x, pos.y, pos.x, pos.y], fill: strokeColor, strokeWidth })
        }
    }

    const handleMouseMove = (point) => {
        if (!isDrawing) return;

        const activeShapeId = activeDrawings.get(userId);
        if (!activeShapeId) return;

        if (isPen) {
            setShapes((prevLines) =>
                prevLines.map((line) => {
                    if (line.id === activeShapeId) {
                        return { ...line, points: line.points.concat([point.x, point.y]) }
                    } else {
                        return line;
                    }
                })
            )
            emit('update_shape', {
                room: fileId,
                id: activeShapeId,
                userId: userId,
                points: point
            });
        } else if (line) {
            setShapes((prevLines) =>
                prevLines.map((line) => {
                    if (line.id === activeShapeId) {
                        return { ...line, points: [line.points[0], line.points[1], point.x, point.y] };
                    } else {
                        return line;
                    }
                })
            )
            emit('update_shape', {
                room: fileId,
                id: activeShapeId,
                userId: userId,
                points: point
            })
        } else if (rectangle) {
            setShapes((prevRects) =>
                prevRects.map((rect) => {
                    if (rect.id === activeShapeId) {
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
            emit('update_shape', {
                room: fileId,
                id: activeShapeId,
                userId: userId,
                points: point
            })
        } else if (triangle) {
            setShapes((prevTriangles) =>
                prevTriangles.map((triangle) => {
                    if (triangle.id === activeShapeId) {
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
            emit('update_shape', {
                room: fileId,
                id: activeShapeId,
                userId: userId,
                points: point
            })
        } else if (circle) {
            setShapes((prevCircles) =>
                prevCircles.map((circle) => {
                    if (circle.id === activeShapeId) {
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
            emit('update_shape', {
                room: fileId,
                id: activeShapeId,
                userId: userId,
                points: point
            })
        } else if (arrowLine) {
            setShapes((prevArrowLines) =>
                prevArrowLines.map((arrowLine) => {
                    if (arrowLine.id === activeShapeId) {
                        return { ...arrowLine, points: [arrowLine.points[0], arrowLine.points[1], point.x, point.y] }
                    } else {
                        return arrowLine;
                    }
                })
            )
            emit('update_shape', {
                room: fileId,
                id: activeShapeId,
                userId: userId,
                points: point
            })
        }
    }

    const handleMouseUp = () => {
        if (!isDrawing) return;

        const drawedShapeId = activeDrawings.get(userId);
        const shape = shapes.find((shape) => shape.id == drawedShapeId);

        emit('drawing_complete', {
            room: fileId,
            userId: userId,
            shape: shape
        });

        // Clear MY active drawing
        setActiveDrawings(prev => {
            const updated = new Map(prev);
            updated.delete(userId);
            return updated;
        });
        setIsDrawing(false);
    }

    const drawingHandlers = {
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp
    }

    return {
        drawingHandlers,
        setIsDrawing,
        activeDrawings, setActiveDrawings, activeDrawingsRef,
    }
}
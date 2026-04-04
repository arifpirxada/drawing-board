// export const useCanvasInteraction = ({

// }) => {

//     const handleMouseDown = (e) => {
//         const stage = e.target.getStage();
//         const pos = getWorldPosition(stage);

//         if (isEditing) {
//             textareaRef.current.style.left = `${pos.x}px`
//             textareaRef.current.style.top = `${pos.y}px`
//             textareaRef.current.classList.remove('hidden')
//             setTimeout(() => {
//                 textareaRef.current.focus()
//             }, 10)
//             setIsEditing(false)
//         } else if (editingText !== '') {
//             handleSaveText()
//         }

//         if (eraser) {
//             setIsErasing(true);
//             checkAndDeleteShape(e);
//             return;
//         }

//         if (isMouse && e.target === stageRef.current) {
//             setSelectedShape(null);
//             setSelectedShapes([]);

//             setIsSelecting(true);
//             setSelectionRect({
//                 visible: true,
//                 x1: pos.x,
//                 y1: pos.y,
//                 x2: pos.x,
//                 y2: pos.y
//             });
//             return;
//         }

//         setIsDrawing(true);
//         const id = `shape-${userId}-${Date.now()}`
//         setActiveDrawings(prev => new Map(prev).set(userId, id));

//         if (isPen) {
//             setShapes([...shapes, { id, userId, type: 'line', points: [pos.x, pos.y], fill: color, strokeWidth: lineWidth }]);
//             emit('draw_shape', { room: fileId, id, userId, type: 'line', points: [pos.x, pos.y], fill: color, strokeWidth: lineWidth, scaleX: 1, scaleY: 1, rotation: 0 });
//         } else if (line) {
//             setShapes([...shapes, { id, userId, type: 'straight_line', points: [pos.x, pos.y], fill: strokeColor, strokeWidth }]);
//             emit('draw_shape', { room: fileId, id, userId, type: 'straight_line', points: [pos.x, pos.y], fill: color, strokeWidth })
//         } else if (rectangle) {
//             setShapes([...shapes, { id, userId, type: 'rectangle', x: pos.x, y: pos.y, width: 0, height: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
//             emit('draw_shape', { room: fileId, id, userId, type: 'rectangle', x: pos.x, y: pos.y, width: 0, height: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth })
//         } else if (triangle) {
//             setShapes([...shapes, { id, userId, type: 'triangle', points: [pos.x, pos.y, pos.x, pos.y, pos.x, pos.y], fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
//             emit('draw_shape', { room: fileId, id, userId, type: 'triangle', points: [pos.x, pos.y, pos.x, pos.y, pos.x, pos.y], fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth })
//         } else if (circle) {
//             setShapes([...shapes, { id, userId, type: 'circle', x: pos.x, y: pos.y, radius: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth }]);
//             emit('draw_shape', { room: fileId, id, userId, type: 'circle', x: pos.x, y: pos.y, radius: 0, fill: bgColor, stroke: strokeColor, strokeWidth: strokeWidth })
//         } else if (arrowLine) {
//             setShapes([...shapes, { id, userId, type: 'arrow_line', points: [pos.x, pos.y, pos.x, pos.y], fill: strokeColor, strokeWidth }]);
//             emit('draw_shape', { room: fileId, id, userId, type: 'arrow_line', points: [pos.x, pos.y, pos.x, pos.y], fill: strokeColor, strokeWidth })
//         }
//     };

//     const handleMouseMove = (e) => {
//         // Handle Erasing
//         const stage = e.target.getStage();
//         const point = getWorldPosition(stage);
//         const mousePoint = stage.getPointerPosition();

//         setMouse({ x: mousePoint.x, y: mousePoint.y });

//         if (eraser & isErasing) {
//             throttledCheckAndDelete(e)
//             return;
//         }

//         // Handle selection rectangle
//         if (isSelecting) {
//             setSelectionRect(prev => ({
//                 ...prev,
//                 x2: point.x,
//                 y2: point.y
//             }));
//             return;
//         }

//         if (isDrawing) {

//             const myActiveShapeId = activeDrawings.get(userId);

//             if (!myActiveShapeId) return;

//             if (isPen) {
//                 setShapes((prevLines) =>
//                     prevLines.map((line) => {
//                         if (line.id === myActiveShapeId) {
//                             return { ...line, points: line.points.concat([point.x, point.y]) }
//                         } else {
//                             return line;
//                         }
//                     })
//                 )
//                 emit('update_shape', {
//                     room: fileId,
//                     id: myActiveShapeId,
//                     userId: userId,
//                     points: point
//                 });
//             } else if (line) {
//                 setShapes((prevLines) =>
//                     prevLines.map((line) => {
//                         if (line.id === myActiveShapeId) {
//                             return { ...line, points: [line.points[0], line.points[1], point.x, point.y] };
//                         } else {
//                             return line;
//                         }
//                     })
//                 )
//                 emit('update_shape', {
//                     room: fileId,
//                     id: myActiveShapeId,
//                     userId: userId,
//                     points: point
//                 })
//             } else if (rectangle) {
//                 setShapes((prevRects) =>
//                     prevRects.map((rect) => {
//                         if (rect.id === myActiveShapeId) {
//                             const startX = rect.x;
//                             const startY = rect.y;

//                             const width = point.x - startX;
//                             const height = point.y - startY;

//                             return { ...rect, width, height }
//                         } else {
//                             return rect;
//                         }
//                     })
//                 )
//                 emit('update_shape', {
//                     room: fileId,
//                     id: myActiveShapeId,
//                     userId: userId,
//                     points: point
//                 })
//             } else if (triangle) {
//                 setShapes((prevTriangles) =>
//                     prevTriangles.map((triangle) => {
//                         if (triangle.id === myActiveShapeId) {
//                             const startX = triangle.points[0]
//                             const startY = triangle.points[1]

//                             const x = point.x - startX;
//                             const y = point.y - startY;

//                             const updatedTriangle = { ...triangle, points: [...triangle.points] };

//                             updatedTriangle.points[3] = updatedTriangle.points[1] + y;
//                             updatedTriangle.points[4] = updatedTriangle.points[0] + x;
//                             updatedTriangle.points[5] = updatedTriangle.points[1] + y;

//                             return updatedTriangle;
//                         } else {
//                             return triangle;
//                         }
//                     })
//                 )
//                 emit('update_shape', {
//                     room: fileId,
//                     id: myActiveShapeId,
//                     userId: userId,
//                     points: point
//                 })
//             } else if (circle) {
//                 setShapes((prevCircles) =>
//                     prevCircles.map((circle) => {
//                         if (circle.id === myActiveShapeId) {
//                             const startX = circle.x;
//                             const startY = circle.y;

//                             const dx = point.x - startX;
//                             const dy = point.y - startY;

//                             const newRadius = Math.sqrt(dx * dx + dy * dy); // Pythagorean theorem to calculate distance

//                             return { ...circle, radius: newRadius }

//                         } else {
//                             return circle;
//                         }
//                     })
//                 )
//                 emit('update_shape', {
//                     room: fileId,
//                     id: myActiveShapeId,
//                     userId: userId,
//                     points: point
//                 })
//             } else if (arrowLine) {
//                 setShapes((prevArrowLines) =>
//                     prevArrowLines.map((arrowLine) => {
//                         if (arrowLine.id === myActiveShapeId) {
//                             return { ...arrowLine, points: [arrowLine.points[0], arrowLine.points[1], point.x, point.y] }
//                         } else {
//                             return arrowLine;
//                         }
//                     })
//                 )
//                 emit('update_shape', {
//                     room: fileId,
//                     id: myActiveShapeId,
//                     userId: userId,
//                     points: point
//                 })
//             }
//         }
//     };

//     const handleMouseUp = () => {
//         const drawedShapeId = activeDrawings.get(userId);
//         const shape = shapes.find((shape) => shape.id == drawedShapeId);

//         emit('drawing_complete', {
//             room: fileId,
//             userId: userId,
//             shape: shape
//         });

//         // Clear MY active drawing
//         setActiveDrawings(prev => {
//             const updated = new Map(prev);
//             updated.delete(userId);
//             return updated;
//         });

//         if (isErasing) {
//             setIsErasing(false)
//         }
//         if (isSelecting) {
//             setIsSelecting(false);

//             // Calculate selection box
//             const selBox = {
//                 x: Math.min(selectionRect.x1, selectionRect.x2),
//                 y: Math.min(selectionRect.y1, selectionRect.y2),
//                 width: Math.abs(selectionRect.x2 - selectionRect.x1),
//                 height: Math.abs(selectionRect.y2 - selectionRect.y1)
//             };

//             // Only select if the selection box has some size
//             if (selBox.width > 5 && selBox.height > 5) {
//                 // Find intersecting shapes
//                 const selectedElements = [];
//                 // const layer = stageRef.current.getLayers()[0];

//                 layerRef.current.children.forEach((shape) => {
//                     const shapeBox = shape.getClientRect();
//                     if (shape._id === selectionRef.current._id) {
//                         return;
//                     }
//                     if (Konva.Util.haveIntersection(selBox, shapeBox)) {
//                         selectedElements.push(shape);
//                     }
//                 });

//                 setSelectedShapes(selectedElements);
//             }

//             // Hide selection rectangle    
//             setTimeout(() => {
//                 setSelectionRect(prev => ({ ...prev, visible: false }));
//             }, 10);

//         }

//         setIsDrawing(false);
//     };

//     const handleSelect = (e) => {
//         // if we are selecting with rect, do nothing
//         const { x1, x2, y1, y2 } = selectionRect;
//         const moved = x1 !== x2 || y1 !== y2;
//         if (moved) {
//             return;
//         }

//         const shape = e.target;
//         setSelectedShape(shape);
//         setSelectedShapes([]);
//     };

//     const handleDragStart = (e) => {
//         e.target.moveToTop();
//     };

//     const handleDragMove = (e, shapeId, shapeType) => {
//         const node = e.target;

//         const x = node.x();
//         const y = node.y();

//         emit('drag_shape', { room: fileId, id: shapeId, shapeType, x, y })
//     }

//     const handleDragEnd = (e, shapeId, shapeType) => {
//         const node = e.target;

//         const x = node.x();
//         const y = node.y();

//         emit('drag_shape_end', { room: fileId, id: shapeId, shapeType, x, y })
//     }


//     const handleTransformEnd = (e, shapeId, shapeType) => {
//         const node = e.target;

//         const x = node.x();
//         const y = node.y();
//         const scaleX = node.scaleX();
//         const scaleY = node.scaleY();
//         const rotation = node.rotation();

//         emit('transform_shape', { room: fileId, id: shapeId, shapeType, scaleX, scaleY, rotation, x, y })
//     }

//     return {
//         handleMouseDown, handleMouseMove, handleMouseUp,
//         throttledCheckAndDelete,
//         handleSelect, handleDragStart
//     }
// }
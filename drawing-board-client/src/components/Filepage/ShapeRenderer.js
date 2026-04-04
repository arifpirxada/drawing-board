import { Line, Rect, Circle, Text, Image as KonvaImage, Arrow } from 'react-konva';
import { useDrag } from '../../hooks/canvas/useDrag';
import { useSelection } from '../../hooks/canvas/useSelection';

export const ShapeRenderer = ({ shape }) => {

    const { handleDragStart, handleDragMove, handleDragEnd } = useDrag();
    const { handleSelect } = useSelection();

    switch (shape.type) {
        case "image":
            const imageWidth = 300;
            const imageHeight = shape.image.naturalHeight
                ? imageWidth * (shape.image.naturalHeight / shape.image.naturalWidth)
                : 300;
            <KonvaImage
                key={ shape.id }
                id={ shape.id }
                shapeType="image"
                className="selectable"
                image={ shape.image }
                x={ shape.x ? shape.x : (window.innerWidth / 2) - (imageWidth / 2) }  // Center horizontally
                y={ shape.y ? shape.y : (window.innerHeight / 2) - (imageHeight / 2) }  // Center vertically
                width={ imageWidth }
                height={ imageHeight }
                scaleX={ shape.scaleX }
                scaleY={ shape.scaleY }
                rotation={ shape.rotation }
                draggable={ isMouse }
                onClick={ isMouse ? handleSelect : undefined }
                onTap={ isMouse ? handleSelect : undefined }
                onDragStart={ handleDragStart }
                onDragMove={ (e) => handleDragMove(e, shape.id, 'image') }
                onDragEnd={ (e) => handleDragEnd(e, shape.id, 'image') }
                onTransformEnd={ (e) => handleTransformEnd(e, shape.id, 'image') }
            />
        case "text":
            <Text
                key={ shape.id }
                id={ shape.id }
                shapeType="text"
                text={ shape.text }
                className="selectable"
                x={ shape.x ? shape.x : shape.left }
                y={ shape.y ? shape.y : shape.top }
                scaleX={ shape.scaleX }
                scaleY={ shape.scaleY }
                rotation={ shape.rotation }
                fontFamily={ shape.font }
                fontSize={ shape.fontSize }
                fill={ shape.color }
                draggable={ isMouse }
                onClick={ isMouse ? handleSelect : undefined }
                onTap={ isMouse ? handleSelect : undefined }
                onDragStart={ handleDragStart }
                onDragMove={ (e) => handleDragMove(e, shape.id, 'text') }
                onDragEnd={ (e) => handleDragEnd(e, shape.id, 'text') }
                onTransformEnd={ (e) => handleTransformEnd(e, shape.id, 'text') }
            />
        case "circle":
            <Circle
                key={ shape.id }
                id={ shape.id }
                shapeType="circle"
                className="selectable"
                x={ shape.x }
                y={ shape.y }
                scaleX={ shape.scaleX }
                scaleY={ shape.scaleY }
                rotation={ shape.rotation }
                radius={ shape.radius }
                fill={ shape.fill }
                stroke={ shape.stroke }
                strokeWidth={ shape.strokeWidth }
                draggable={ isMouse }
                onClick={ isMouse ? handleSelect : undefined }
                onTap={ isMouse ? handleSelect : undefined }
                onDragStart={ handleDragStart }
                onDragMove={ (e) => handleDragMove(e, shape.id, 'circle') }
                onDragEnd={ (e) => handleDragEnd(e, shape.id, 'circle') }
                onTransformEnd={ (e) => handleTransformEnd(e, shape.id, 'circle') }
            />
        case "triangle":
            <Line
                key={ shape.id }
                id={ shape.id }
                shapeType="triangle"
                className="selectable"
                points={ shape.points }
                fill={ shape.fill }
                stroke={ shape.stroke }
                strokeWidth={ shape.strokeWidth }
                x={ shape.x }
                y={ shape.y }
                scaleX={ shape.scaleX }
                scaleY={ shape.scaleY }
                rotation={ shape.rotation }
                closed={ true }
                draggable={ isMouse }
                onClick={ isMouse ? handleSelect : undefined }
                onTap={ isMouse ? handleSelect : undefined }
                onDragStart={ handleDragStart }
                onDragMove={ (e) => handleDragMove(e, shape.id, 'triangle') }
                onDragEnd={ (e) => handleDragEnd(e, shape.id, 'triangle') }
                onTransformEnd={ (e) => handleTransformEnd(e, shape.id, 'triangle') }
            />
        case "rectangle":
            <Rect
                key={ shape.id }
                id={ shape.id }
                shapeType="rectangle"
                className="selectable"
                x={ shape.x }
                y={ shape.y }
                width={ shape.width }
                height={ shape.height }
                fill={ shape.fill }
                stroke={ shape.stroke }
                strokeWidth={ shape.strokeWidth }
                scaleX={ shape.scaleX }
                scaleY={ shape.scaleY }
                rotation={ shape.rotation }
                draggable={ isMouse }
                onClick={ isMouse ? handleSelect : undefined }
                onTap={ isMouse ? handleSelect : undefined }
                onDragStart={ handleDragStart }
                onDragMove={ (e) => handleDragMove(e, shape.id, 'rectangle') }
                onDragEnd={ (e) => handleDragEnd(e, shape.id, 'rectangle') }
                onTransformEnd={ (e) => handleTransformEnd(e, shape.id, 'rectangle') }
            />
        case "arrow_line":
            <Arrow
                key={ shape.id }
                id={ shape.id }
                hitStrokeWidth={ 20 }
                shapeType="arrowline"
                className="selectable"
                points={ shape.points }
                pointerLength={ 20 }
                pointerWidth={ 20 }
                fill={ shape.fill }
                stroke={ shape.fill }
                strokeWidth={ shape.strokeWidth }
                x={ shape.x }
                y={ shape.y }
                scaleX={ shape.scaleX }
                scaleY={ shape.scaleY }
                rotation={ shape.rotation }
                draggable={ isMouse }
                onTap={ isMouse ? handleSelect : undefined }
                onClick={ isMouse ? handleSelect : undefined }
                onDragMove={ (e) => handleDragMove(e, shape.id, 'arrowline') }
                onDragEnd={ (e) => handleDragEnd(e, shape.id, 'arrowline') }
                onTransformEnd={ (e) => handleTransformEnd(e, shape.id, 'arrowline') }
            />
        case "line":
            <Line
                key={ shape.id }
                id={ shape.id }
                hitStrokeWidth={ 20 }
                shapeType="line"
                className="selectable"
                points={ shape.points }
                stroke={ shape.fill }
                strokeWidth={ shape.strokeWidth }
                scaleX={ shape.scaleX }
                scaleY={ shape.scaleY }
                rotation={ shape.rotation }
                x={ shape.x }
                y={ shape.y }
                tension={ 0.2 }
                lineCap="round"
                globalCompositeOperation="source-over"
                draggable={ isMouse }
                onClick={ isMouse ? handleSelect : undefined }
                onTap={ isMouse ? handleSelect : undefined }
                onDragStart={ handleDragStart }
                onDragMove={ (e) => handleDragMove(e, shape.id, 'line') }
                onDragEnd={ (e) => handleDragEnd(e, shape.id, 'line') }
                onTransformEnd={ (e) => handleTransformEnd(e, shape.id, 'line') }
            />
        default:
            return null;
    }
};
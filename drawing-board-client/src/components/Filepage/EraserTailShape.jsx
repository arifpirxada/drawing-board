import { Line } from 'react-konva';

const EraserTailShape = ({ eraserTailShape }) => {
    if (!eraserTailShape) return null;

    return (
        <Line
            key={ "eraser" }
            points={ eraserTailShape.points }
            stroke={ "rgba(255,255,255,0.1)" }
            strokeWidth={ 8 }
            lineCap="round"
            lineJoin="round"
            tension={ 0.5 }
        />
    )
}

export default EraserTailShape;
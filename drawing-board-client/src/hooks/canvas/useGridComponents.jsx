import { useMemo } from "react";
import { Rect } from "react-konva";

const CELL_WIDTH = 70;
const CELL_HEIGHT = 70;

export function useGridComponents({ stagePos, stageScale, gridView }) {
    return useMemo(() => {
        const bufferMultiplier = Math.min(1.6, 1.2 / stageScale);
        const bufferWidth = window.innerWidth * bufferMultiplier;
        const bufferHeight = window.innerHeight * bufferMultiplier;

        const startX = Math.floor((-stagePos.x - bufferWidth) / CELL_WIDTH) * CELL_WIDTH;
        const endX = Math.floor((-stagePos.x + bufferWidth * 2) / CELL_WIDTH) * CELL_WIDTH;
        const startY = Math.floor((-stagePos.y - bufferHeight) / CELL_HEIGHT) * CELL_HEIGHT;
        const endY = Math.floor((-stagePos.y + bufferHeight * 2) / CELL_HEIGHT) * CELL_HEIGHT;

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
    }, [gridView, stagePos.x, stagePos.y, stageScale]);
}
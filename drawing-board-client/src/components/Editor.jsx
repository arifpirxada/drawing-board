import { useContext, useEffect, useRef, useState } from "react";
import StateContext from "../context/StateContext";

function Editor() {
    const canvas = useRef(null);
    const { isPen,
        mouse,
        isDrawing,
        setMouse,
        setIsDrawing,
        lineWidth,
        isMarker,
        isPencil,
        color,
        eraserOne,
        eraserTwo,
        line,
        rectangle,
        triangle,
        circle
    } = useContext(StateContext);
    const [startPoint, setStartPoint] = useState(null);

    useEffect(() => {
        const canvasElement = canvas.current;
        const ctx = canvasElement.getContext("2d");

        const draw = () => {
            if (!isDrawing) return;

            if (isPen || isMarker || isPencil) {
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
                ctx.moveTo(mouse.x, mouse.y);
            } else if (eraserOne) {
                ctx.clearRect(mouse.x - 20, mouse.y - 18, 20, 20);
            } else if (eraserTwo) {
                ctx.clearRect(mouse.x - 15, mouse.y - 13, 20, 20);
            } else if (line && startPoint) {
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
        draw()
    }, [isDrawing, isPen, mouse]);

    useEffect(() => {
        const ctx = canvas.current.getContext("2d");
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.rect(500, 200, 500, 100);
        ctx.stroke();
    }, [color, lineWidth])

    useEffect(() => {
        const canvasElement = canvas.current;
        const ctx = canvasElement.getContext("2d");

        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;

        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const handleMouseMove = (event) => {
            const rect = canvasElement.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            setMouse({ x, y });
        };

        const handleMouseDown = (event) => {
            const rect = canvasElement.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            setStartPoint({ x, y });
            setIsDrawing(true);
            ctx.beginPath();
        };

        const handleMouseUp = () => {
            setIsDrawing(false);
            ctx.beginPath();
        };

        canvasElement.addEventListener("mousemove", handleMouseMove);
        canvasElement.addEventListener("mousedown", handleMouseDown);
        canvasElement.addEventListener("mouseup", handleMouseUp);

        return () => {
            canvasElement.removeEventListener("mousemove", handleMouseMove);
            canvasElement.removeEventListener("mousedown", handleMouseDown);
            canvasElement.removeEventListener("mouseup", handleMouseUp);
        };
    }, [])

    return (
        <div className="canvas-container w-screen h-screen">
            <canvas ref={ canvas } className="w-full h-full"></canvas>
        </div>
    );
}

export default Editor;
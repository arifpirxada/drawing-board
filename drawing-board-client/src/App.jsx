import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StateProvider } from './context/StateContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Functionality from './components/Functionality';
import Dashboard from './components/dashboard/Dashboard';

function App() {

  return (
    <StateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/view" element={<><Home /><Functionality /></>} />
          <Route path="/view/chat" element={<><Home /><Functionality /></>} />
          <Route path="/view/user" element={<><Home /><Functionality /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </StateProvider>
  )
}

export default App

// Comment Left for Infinite canvas reference
// import React, { useState, useRef } from 'react';
// import { Stage, Layer, Rect } from 'react-konva';


// const CELL_WIDTH = 100;
// const CELL_HEIGHT = 100;

// const InfiniteCanvas = () => {
//   const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

//   const [stageScale, setStageScale] = useState(1);
//   const stageRef = useRef();

//   // Calculate buffer based on zoom level
//   const bufferMultiplier = Math.max(2, 4 / stageScale);
//   const bufferWidth = window.innerWidth * bufferMultiplier;
//   const bufferHeight = window.innerHeight * bufferMultiplier;

//   // Calculate visible area bounds
//   const startX = Math.floor((-stagePos.x - bufferWidth) / CELL_WIDTH) * CELL_WIDTH;
//   const endX = Math.floor((-stagePos.x + bufferWidth * 2) / CELL_WIDTH) * CELL_WIDTH;
//   const startY = Math.floor((-stagePos.y - bufferHeight) / CELL_HEIGHT) * CELL_HEIGHT;
//   const endY = Math.floor((-stagePos.y + bufferHeight * 2) / CELL_HEIGHT) * CELL_HEIGHT;

//   // Generate only visible grid components
//   const gridComponents = [];
//   for (let x = startX; x < endX; x += CELL_WIDTH) {
//     for (let y = startY; y < endY; y += CELL_HEIGHT) {
//       gridComponents.push(
//         <Rect
//           key={ `${x}-${y}` }
//           x={ x }
//           y={ y }
//           width={ CELL_WIDTH }
//           height={ CELL_HEIGHT }
//           fill="#282828"
//           stroke="#a99c9c99"
//           strokeWidth={ 1 }
//         />
//       );
//     }
//   }

//   const zoomIn = () => {
//     const stage = stageRef.current;
//     const oldScale = stage.scaleX();
//     const newScale = Math.min(2.5, oldScale + 0.25);

//     stage.scale({ x: newScale, y: newScale });
//     setStageScale(newScale);
//   };

//   const zoomOut = () => {
//     const stage = stageRef.current;
//     const oldScale = stage.scaleX();
//     const newScale = Math.max(0.75, oldScale - 0.25);

//     stage.scale({ x: newScale, y: newScale });
//     setStageScale(newScale);
//   };

//   const resetZoom = () => {
//     const stage = stageRef.current;
//     stage.scale({ x: 1, y: 1 });
//     stage.position({ x: 0, y: 0 });
//     setStageScale(1);
//     setStagePos({ x: 0, y: 0 });
//   };

//   return (
//     <>
//       {/* Zoom Controls */ }
//       <div style={ {
//         position: 'absolute',
//         left: 20,
//         bottom: 20,
//         zIndex: 1000,
//         display: 'flex',
//         gap: '20px',
//         color: "#fff"
//       } }>
//         <button onClick={ zoomIn }>Zoom In (+)</button>
//         <button onClick={ zoomOut }>Zoom Out (-)</button>
//         <button onClick={ resetZoom }>Reset</button>
//         <div>Scale: { stageScale.toFixed(2) }x</div>
//       </div>
//       <Stage
//         ref={ stageRef }
//         width={ window.innerWidth }
//         height={ window.innerHeight }
//         x={ stagePos.x }
//         y={ stagePos.y }
//         scaleX={ stageScale }
//         scaleY={ stageScale }
//         draggable
//         onDragEnd={ (e) => {
//           setStagePos(e.currentTarget.position());
//         } }
//       >
//         <Layer>
//           { gridComponents }
//         </Layer>
//         <Layer>
//           {/* Add elements here */}
//         </Layer>
//       </Stage>
//     </>

//   );
// };

// export default InfiniteCanvas;
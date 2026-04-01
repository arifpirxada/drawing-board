const AnimatedLogo = () => {
    return (
        <div className="canvas-loader">
            <div className="canvas-loader__inner">
                {/* Animated corner brackets */}
                <div className="canvas-loader__bracket canvas-loader__bracket--tl" />
                <div className="canvas-loader__bracket canvas-loader__bracket--tr" />
                <div className="canvas-loader__bracket canvas-loader__bracket--bl" />
                <div className="canvas-loader__bracket canvas-loader__bracket--br" />

                {/* Logo */}
                <div className="canvas-loader__logo">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                            stroke="#cc55e8"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* Status line */}
                <div className="canvas-loader__text">
                    <span className="canvas-loader__dot" />
                    Initialising canvas
                </div>

                {/* Progress bar */}
                <div className="canvas-loader__bar-track">
                    <div className="canvas-loader__bar" />
                </div>
            </div>
        </div>
    );
};

export default AnimatedLogo;

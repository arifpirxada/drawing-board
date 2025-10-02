import logo from '../../assets/images/logo.svg';

const AnimatedLogo = () => {

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen bg-[#282828]">
            <div className="flex flex-col items-center gap-5">
                <img
                    className={ `rounded w-24 h-24 animate-pulse transition-transform duration-300 ease-in-out` }
                    src={ logo }
                    alt="Logo"
                />

                <div className="text-cyan-400 font-medium text-lg tracking-wider animate-fade-pulse sm:text-xl">
                    Loading...
                </div>
            </div>
        </div>
    );
};

export default AnimatedLogo;

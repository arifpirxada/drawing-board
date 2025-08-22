

function Options() {


    return (
        <div className={ `controls-container z-[1000] h-fit left-[43%] top-4 rounded-2xl fixed transition-all p-3 flex justify-center items-center gap-4` }>
            <div className="w-6 cursor-pointer h-5 m-auto float-left">
                <span className="h-1 rounded-[1px] mb-1 block bg-slate-200"></span>
                <span className="h-1 rounded-[1px] mb-1 block bg-slate-200"></span>
                <span className="h-1 rounded-[1px] block bg-slate-200"></span>
            </div>

            <div className="mouse-options hidden -flex">
                <div className="color flex justify-center gap-3 items-center">
                    <div className={ `w-4 h-4 cursor-pointer rounded-full bg-white hover:scale-110 transition-all` }></div>
                    <div className={ `w-4 h-4 cursor-pointer rounded-full bg-yellow-300 hover:scale-110 transition-all` }></div>
                    <input
                        type="color"
                        value="#65e222"
                        className="cursor-pointer rounded-full w-4 h-4 bg-[#65e222] outline-none"
                    />
                </div>
                <div className="gap-4 items-center cursor-pointer h-5 ml-4 flex">
                    <div className="active h-full flex items-center rounded-sm p-1 hover:bg-[#5b5a6d] bg-[#5b5a6d]">
                        <span className="h-1 w-6 rounded-full block bg-slate-200"></span>
                    </div>
                    <div className="active h-full flex items-center rounded-sm p-1 hover:bg-[#5b5a6d] bg-[#5b5a6d]">
                        <span className="h-1.5 w-6 rounded-full block bg-slate-200"></span>
                    </div>
                    <div className="h-full flex items-center rounded-sm p-1 hover:bg-[#5b5a6d]">
                        <span className="h-2 w-6 rounded-full block bg-slate-200"></span>
                    </div>
                </div>
            </div>

            <div className="shape-options hidden -flex">
                <div className="color flex justify-center gap-3 items-center">
                    <div>
                        <input
                            type="color"
                            value="#65e222"
                            id="color-option-stroke"
                            className="cursor-pointer invisible absolute rounded-full bg-[#65e222] outline-none"
                        />
                        <label htmlFor="color-option-stroke">
                            <img src="/color-choose.png" className="w-6 cursor-pointer" alt="Choose color icon" />
                        </label>
                    </div>
                    <div>
                        <input
                            type="color"
                            value="#e2b522ff"
                            id="color-option-background"
                            className="cursor-pointer invisible absolute rounded-full bg-[#e2b522ff] outline-none"
                        />
                        <label htmlFor="color-option-background">
                            <img src="/color-choose.png" className="w-6 cursor-pointer" alt="Choose color icon" />
                        </label>
                    </div>
                </div>
                <div className="gap-4 items-center cursor-pointer h-5 ml-4 flex">
                    <div className="active h-full flex items-center rounded-sm p-1 hover:bg-[#5b5a6d] bg-[#5b5a6d]">
                        <span className="h-1 w-6 rounded-full block bg-slate-200"></span>
                    </div>
                    <div className="h-full flex items-center rounded-sm p-1 hover:bg-[#5b5a6d]">
                        <span className="h-1.5 w-6 rounded-full block bg-slate-200"></span>
                    </div>
                    <div className="h-full flex items-center rounded-sm p-1 hover:bg-[#5b5a6d]">
                        <span className="h-2 w-6 rounded-full block bg-slate-200"></span>
                    </div>
                </div>
            </div>

            <div className="shape-options flex">
                <div className="color flex justify-center gap-3 items-center">
                    <div>
                        <input
                            type="color"
                            value="#65e222"
                            id="color-option-stroke"
                            className="cursor-pointer invisible absolute rounded-full bg-[#65e222] outline-none"
                        />
                        <label htmlFor="color-option-stroke">
                            <img src="/color-choose.png" className="w-6 cursor-pointer" alt="Choose color icon" />
                        </label>
                    </div>
                </div>
                <div className="ml-4">
                    <img src="/text.svg" className="w-6 cursor-pointer" alt="Text icon" />
                </div>
                <div className="ml-4">
                    <select name="select-font" id="select-font" className="cursor-pointer absolute opacity-0 w-5 h-5">
                        <option value="Arial">Arial</option>
                        <option value="Arial">Open Sans</option>
                        <option value="Arial">Figtree</option>
                    </select>
                    <label htmlFor="select-font" className="cursor-pointer">
                        <svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 24 24" class="" fill="none" width="20" strokeWidth="2" stroke="#fff" strokeLinecap="round" stroke-linejoin="round"><g stroke-width="1.5"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="4" y1="20" x2="7" y2="20"></line><line x1="14" y1="20" x2="21" y2="20"></line><line x1="6.9" y1="15" x2="13.8" y2="15"></line><line x1="10.2" y1="6.3" x2="16" y2="20"></line><polyline points="5 20 11 4 13 4 20 20"></polyline></g></svg>
                    </label>
                </div>
                <div className="ml-4">
                    <select name="select-font-size" id="select-font-size" className="cursor-pointer absolute opacity-0 w-5 h-5">
                        <option value="12">12</option>
                        <option value="16">16</option>
                        <option value="20">20</option>
                        <option value="24">24</option>
                        <option value="32">32</option>
                    </select>
                    <label htmlFor="select-font-size" className="cursor-pointer">
                        <img src="/font-size.png" className="w-5 cursor-pointer" alt="Text icon" />
                    </label>
                </div>
            </div>


        </div>
    )
}

export default Options;
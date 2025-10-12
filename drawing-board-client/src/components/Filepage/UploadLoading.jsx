
function UploadLoading() {
    return (
        <>
            <div className="flex bg-[#02020282] overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative p-4 w-full max-w-2xl h-36 animate-pulse max-h-full">
                    <div className="relative bg-white rounded-lg h-full flex justify-center items-center text-xl shadow dark:bg-gray-700">
                        Uploading...
                    </div>
                </div>
            </div>
        </>

    )
}

export default UploadLoading;
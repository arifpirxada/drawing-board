import { useForm } from "react-hook-form"

const EditFileModal = ({ setEditFileModalOpen }) => {

    const closeFileModal = (e) => {
        if (e.target === e.currentTarget) {
            setEditFileModalOpen(false);
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm()

    const updateFile = () => {
        try {

        } catch (err) {
            console.log("Could not update file")
        }
    }

    const accessValue = watch('access')



    return (
        <div onClick={ closeFileModal } id="authentication-modal" tabIndex="-1" aria-hidden="true" className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Update File
                        </h3>
                        <button onClick={ closeFileModal } type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5">
                        <form onSubmit={ handleSubmit(updateFile) } className="space-y-4" action="#">
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">File Name</label>
                                <input type="text" { ...register("name", { required: true }) } id="name" className="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Name" required />
                            </div>


                            <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Access</label>
                            <select
                                id="countries"
                                defaultValue="private"
                                { ...register("access", { required: true }) }
                                className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                            </select>

                            { accessValue == 'private' && <div className="relative">
                                <label htmlFor="searchUser" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Add Collaborators</label>
                                <input type="text" { ...register("searchUser", { required: true }) } id="searchUser" className="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Search by Email" required />

                                <div className="dark:hidden inline-block users w-full mt-3 absolute z-10 max-h-60 overflow-scroll no-scrollbar px-3 py-2 text-sm font-medium text-white bg-[#2c2e33] rounded-lg shadow-xs tooltip">
                                    <ul>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                        <li className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">test@gmail.com</li>
                                    </ul>
                                </div>

                                <div className="added-users hidden flex-wrap mt-4">
                                    <ul className="flex flex-wrap justify-center gap-2">
                                        <li className="py-1 px-2 rounded-sm bg-gray-800 flex justify-center items-center">
                                            <p>test@gmail.com</p>
                                            <span className="ms-2 hover:text-red-300 -mb-0.5 cursor-pointer  font-bold">
                                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path></svg>
                                            </span>
                                        </li>
                                        <li className="py-1 px-2 rounded-sm bg-gray-800 flex justify-center items-center">
                                            <p>test@gmail.com</p>
                                            <span className="ms-2 hover:text-red-300 -mb-0.5 cursor-pointer  font-bold">
                                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path></svg>
                                            </span>
                                        </li>
                                        <li className="py-1 px-2 rounded-sm bg-gray-800 flex justify-center items-center">
                                            <p>test@gmail.com</p>
                                            <span className="ms-2 hover:text-red-300 -mb-0.5 cursor-pointer  font-bold">
                                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path></svg>
                                            </span>
                                        </li>
                                        <li className="py-1 px-2 rounded-sm bg-gray-800 flex justify-center items-center">
                                            <p>test@gmail.com</p>
                                            <span className="ms-2 hover:text-red-300 -mb-0.5 cursor-pointer  font-bold">
                                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path></svg>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div> }



                            <div className="pt-3">
                                <button type="submit" className="w-full text-white bg-[#1a1821] hover:bg-[#1d1b25] focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default EditFileModal
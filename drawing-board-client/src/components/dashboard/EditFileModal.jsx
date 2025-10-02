import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { authApi } from "../../features/auth/auth";
import AuthContext from "../../context/AuthContext";
import { useContext } from "react";
import fileApi from "../../features/files/fileApi";

const EditFileModal = ({ setEditFileModalOpen, editFile, setEditFile, setFiles }) => {

    const { user } = useContext(AuthContext);

    const [searchedUsers, setSearchedUsers] = useState([])
    const [editingFile, setEditingFile] = useState(false)
    const [collaborators, setCollaborators] = useState([]);

    const closeFileModal = (e) => {
        if (e.target === e.currentTarget) {
            setEditFileModalOpen(false);
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm({
        defaultValues: {
            name: editFile ? editFile.name : "",
            access: editFile ? editFile.access : "private"
        }
    })

    const updateFile = async (data) => {
        try {
            setEditingFile(true)
            const updateFileData = {
                name: data.name,
                access: data.access,
                collaborators: data.access === 'private' ? collaborators.map((user) => user.id) : []
            }

            const res = await fileApi.updateFile(editFile.id, updateFileData)

            if (res?.success && res?.file) {
                setEditFileModalOpen(false)
                setEditFile(null)
                setFiles((prev) => prev.map((f) => (f.id === res.file.id ? res.file : f)))
            } else {
                throw new Error("No valid response while updating file")
            }

            setEditingFile(false)

        } catch (err) {
            console.log("Could not update file", err)
        }
    }

    const useDebounce = (value, delay) => {
        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => {
                clearTimeout(handler);
            };
        }, [value, delay]);

        return debouncedValue;
    };

    const accessValue = watch('access');
    const searchUserValue = watch('searchUser')
    const debouncedSearchValue = useDebounce(searchUserValue, 400);


    const searchUsers = async (query) => {
        if (!query || query.trim() === '') {
            setSearchedUsers([]);
            return;
        }
        try {
            const response = await authApi.searchUsers(query);
            setSearchedUsers(response.data);
        } catch (err) {
            console.log("Could not search users")
        }
    }

    useEffect(() => {
        searchUsers(debouncedSearchValue);
    }, [debouncedSearchValue])

    const addCollaborator = (user) => {
        setCollaborators((prev) => [...prev, user]);
        setValue('searchUser', '');
        setSearchedUsers([]);
    }

    const removeCollaborator = (user) => {
        setCollaborators((prev) => prev.filter((u) => u.id !== user.id));
    }

    useEffect(() => {
        // Get the current file collaborator details not only id

        const getCollaborators = async () => {
            try {
                const res = await authApi.getUsersByIdArr(editFile.collaborators);

                if (res?.success && res?.data) {
                    setCollaborators(res.data);
                }
            } catch (error) {
                console.error("Error fetching collaborators:", error);
            }
        }

        getCollaborators();
    }, [editFile])


    if (!editFile) {
        setEditFileModalOpen(false);
        return null;
    };

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


                            <label htmlFor="access" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Access</label>
                            <select
                                id="access"
                                { ...register("access", { required: true }) }
                                className="bg-gray-50 border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                            </select>

                            { accessValue == 'private' && <div className="relative">
                                <label htmlFor="searchUser" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Add Collaborators</label>
                                <input type="text" { ...register("searchUser") } id="searchUser" className="bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Search by Email" />

                                { searchedUsers.length > 0 && <div className="inline-block users w-full mt-3 absolute z-10 max-h-60 overflow-scroll no-scrollbar px-3 py-2 text-sm font-medium text-white bg-[#2c2e33] rounded-lg shadow-xs tooltip">
                                    <ul>
                                        { searchedUsers.map((searchedUser) => {
                                            // Only show user if not already added and not the current user
                                            const isCollaborator = collaborators.find((collab) => collab.id === searchedUser.id);
                                            if (searchedUser.id === user.id || isCollaborator) return null;
                                            return <li key={ searchedUser.id } onClick={ () => addCollaborator(searchedUser) } className="py-1 px-2 rounded-sm hover:bg-slate-700 cursor-pointer">{ searchedUser.email }</li>
                                        }) }
                                    </ul>
                                </div> }

                                { collaborators.length > 0 && <div className="added-users flex-wrap mt-4">
                                    <ul className="flex flex-wrap justify-center gap-2">
                                        { collaborators.map((user) => (
                                            <li key={ user.id } className="py-1 px-2 rounded-sm bg-gray-800 flex justify-center items-center">
                                                <p>{ user.email }</p>
                                                <span onClick={ () => removeCollaborator(user) } className="ms-2 hover:text-red-300 -mb-0.5 cursor-pointer  font-bold">
                                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path></svg>
                                                </span>
                                            </li>
                                        )) }
                                    </ul>
                                </div> }
                            </div> }



                            <div className="pt-3">
                                <button type="submit" className="w-full text-white bg-[#1a1821] hover:bg-[#1d1b25] focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                    { editingFile ? 'Updating...' : 'Update File' }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default EditFileModal
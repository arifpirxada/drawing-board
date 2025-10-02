import { useEffect } from "react"
import { useState } from "react"
import fileApi from "../../features/files/fileApi"
import CreateFileModal from "./CreateFileModal"
import EditFileModal from "./EditFileModal"
import { Link } from "react-router-dom"

const DashboardFiles = () => {

    const [files, setFiles] = useState([])
    const [createFileModalOpen, setCreateFileModalOpen] = useState(false)
    const [editFileModalOpen, setEditFileModalOpen] = useState(false)
    const [editFile, setEditFile] = useState(null)

    useEffect(() => {
        const getFiles = async () => {
            try {
                const fileData = await fileApi.getFiles()

                if (fileData?.success == true && fileData?.data) {
                    setFiles(fileData.data)
                } else {
                    throw new Error("No valid response while getting file data")
                }

            } catch (err) {
                console.log("Could not get files")
            }
        }

        getFiles()
    }, [])

    const handleEditFile = (e, file) => {
        e.preventDefault();
        e.stopPropagation();
        setEditFileModalOpen(true)
        setEditFile(file)
    }

    return (
        <>
            { createFileModalOpen && <CreateFileModal setCreateFileModalOpen={ setCreateFileModalOpen } setFiles={ setFiles } /> }
            { editFileModalOpen && <EditFileModal setEditFileModalOpen={ setEditFileModalOpen } editFile={ editFile } setEditFile={ setEditFile } setFiles={ setFiles } /> }
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
                    <div className="flex items-center overflow-hidden justify-center h-40 md:h-56 lg:h-80 mb-4 rounded bg-gray-50 dark:bg-gray-800">
                        <img src="dashboard-img.webp" alt="" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-4">
                        <div onClick={ () => setCreateFileModalOpen(true) } className="flex cursor-pointer p-2 items-center justify-center h-28 rounded bg-[#16161b]">
                            <p className="text-white mr-4 font-[Manrope] font-bold text-center mt-1">New File</p>
                            <p className="text-2xl text-gray-400 dark:text-gray-500">
                                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                                </svg>
                            </p>
                        </div>

                        { files.map((file) => (
                            <Link to={ `/files/${file.id}` } key={ file.id } className="flex cursor-pointer p-2 relative items-center justify-center h-28 rounded bg-[#16161b] hover:bg-[#1e1e25] transition-colors">
                                <p className="text-white mr-4 font-[Manrope] font-bold text-center mt-1">{ file.name.length > 20 ? file.name.slice(0, 20) + '...' : file.name }</p>
                                <p className="absolute left-3 top-3 leading-none capitalize bg-gray-700 p-1 rounded font-bold">{ file.access }</p>
                                <div onClick={ (e) => handleEditFile(e, file) } className="absolute right-3 top-3 transition-transform capitalize hover:scale-110">
                                    <img width={ 23 } src="img/edit.png" alt="edit icon" />
                                </div>
                            </Link>
                        )) }

                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardFiles
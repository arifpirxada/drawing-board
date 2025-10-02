import axios from "../../lib/axios";

const fileApi = {
    getFiles: async () => {
        const res = await axios.get("/files")
        return res.data
    },

    getSingleFile: async (fileId) => {
        const res = await axios.get(`/files/${fileId}`)
        return res.data
    },

    createFile: async (fileData) => {
        const res = await axios.post('/files', fileData)
        return res.data
    },

    updateFile: async (fileId, fileData) => {
        const res = await axios.patch(`/files/${fileId}`, fileData)
        return res.data
    }
}

export default fileApi
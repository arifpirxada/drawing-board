import axios from "../../lib/axios";

const fileApi = {
    getFiles: async () => {
        const res = await axios.get("/files")
        return res.data
    },
}

export default fileApi
import axios from "axios";

const Api = {
    analyseDelineationFile: (data) => axios.post("http://localhost:8081/api/v1/delineation", data)
}

export default Api
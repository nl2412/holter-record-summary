import axios from "axios";

const apiBaseUrl = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/v1`;

const methods = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};

const request = (method, endpoint, data) => {
  return methods[method](`${apiBaseUrl}/${endpoint}`, data);
};

const Api = {
  analyseDelineationFile: (data) => request("post", "/delineation", data),
};

export default Api;

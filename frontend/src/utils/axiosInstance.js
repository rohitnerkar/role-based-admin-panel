import axios from "axios";

// const axiosInstance = axios.create({ baseURL: "http://localhost:5000/api" });

const axiosInstance = axios.create({ baseURL: "https://role-based-admin-panel.onrender.com/api" });


axiosInstance.interceptors.request.use((req) => {
  const stringifyBlogData = window.localStorage.getItem("userData");

  if (stringifyBlogData && stringifyBlogData !== "undefined") {
    try {
      const userData = JSON.parse(stringifyBlogData);
      const token = userData.token;

      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
    }
  }

  return req;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const event = new CustomEvent("tokenExpired");
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

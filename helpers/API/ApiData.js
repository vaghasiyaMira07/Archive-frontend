import axios from "axios";
import { ENDPOINTS } from "../../config/API/api-prod";
// import { useState, useCallback,useMemo, useEffect } from "react";

// import Loader from "../../components/Loader/Loader"
// import Auth from "../Auth";
import * as authUtil from "./../../utils/auth.util";

// Create axios instance with default config
const api = axios.create({
  baseURL: ENDPOINTS.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

// API helper functions
export const ApiGet = async (endpoint, params = {}) => {
  try {
    const response = await api.get(endpoint, { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const ApiPost = async (endpoint, data = {}) => {
  try {
    const response = await api.post(endpoint, data);
    return response;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export const ApiPut = async (endpoint, data = {}) => {
  try {
    const response = await api.put(endpoint, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const ApiDelete = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response;
  } catch (error) {
    throw error;
  }
};

export const ApiUpload = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(ENDPOINTS.UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const ApiPostNoAuth = (type, userData) => {
  // const [loading] = useAxiosLoader();
  console.log("In api post without auth", ENDPOINTS);
  console.log(ENDPOINTS.API_URL);
  return (
    // loading ? Loader()  :

    new Promise((resolve, reject) => {
      api
        .post(
          ENDPOINTS.API_URL + type,
          userData,
          getHttpOptions({ isAuth: false })
        )
        .then((responseJson) => {
          console.log("call no auth api");
          resolve(responseJson);
        })
        .catch((error) => {
          if (
            error &&
            error.hasOwnProperty("response") &&
            error.response &&
            error.response.hasOwnProperty("data") &&
            error.response.data &&
            error.response.data.hasOwnProperty("error") &&
            error.response.data.error
          ) {
            reject(error.response.data.error);
          } else {
            reject(error);
          }
        });
    })
  );
};

export const ApiPutNoAuth = (type, userData) => {
  console.log("In api put without auth", ENDPOINTS);
  console.log(ENDPOINTS.API_URL);
  // debugger
  return new Promise((resolve, reject) => {
    api
      .put(
        ENDPOINTS.API_URL + type,
        userData,
        getHttpOptions({ isAuth: false })
      )
      .then((responseJson) => {
        console.log("call no auth api");
        resolve(responseJson);
      })
      .catch((error) => {
        if (
          error &&
          error.hasOwnProperty("response") &&
          error.response &&
          error.response.hasOwnProperty("data") &&
          error.response.data &&
          error.response.data.hasOwnProperty("error") &&
          error.response.data.error
        ) {
          reject(error.response.data.error);
        } else {
          reject(error);
        }
      });
  });
};

export const ApiGetNoAuth = (type) => {
  return new Promise((resolve, reject) => {
    api
      .get(ENDPOINTS.API_URL + type, getHttpOptions({ isAuth: false }))
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        if (
          error &&
          error.hasOwnProperty("response") &&
          error.response &&
          error.response.hasOwnProperty("data") &&
          error.response.data &&
          error.response.data.hasOwnProperty("error") &&
          error.response.data.error
        ) {
          reject(error.response.data.error);
        } else {
          reject(error);
        }
      });
  });
};

export const Api = (type, methodtype, userData) => {
  return new Promise((resolve, reject) => {
    userData = userData || {};
    api({
      url: ENDPOINTS.API_URL + type,
      headers: getHttpOptions(),
      data: userData,
      type: methodtype,
    })
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        if (
          error &&
          error.hasOwnProperty("response") &&
          error.response &&
          error.response.hasOwnProperty("data") &&
          error.response.data &&
          error.response.data.hasOwnProperty("error") &&
          error.response.data.error
        ) {
          reject(error.response.data.error);
        } else {
          reject(error);
        }
      });
  });
};

export const ApiDownload = (type, userData) => {
  let method = userData && Object.keys(userData).length > 0 ? "POST" : "GET";
  return new Promise((resolve, reject) => {
    api({
      url: ENDPOINTS.API_URL + type,
      method,
      headers: getHttpOptions().headers,
      responseType: "blob",
      data: userData,
    })
      .then((res) => resolve(new Blob([res.data])))
      .catch((error) => {
        if (
          error &&
          error.hasOwnProperty("response") &&
          error.response &&
          error.response.hasOwnProperty("data") &&
          error.response.data &&
          error.response.data.hasOwnProperty("error") &&
          error.response.data.error
        ) {
          reject(error.response.data.error);
        } else {
          reject(error);
        }
      });
  });
};

export const ApiGetBuffer = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      mode: "no-cors",
    })
      .then((response) => {
        if (response.ok) {
          console.log(response.headers.get("content-type"));
          console.log(response);
          return response.buffer();
        } else {
          resolve(null);
        }
      })
      .then((buffer) => {
        resolve(buffer);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

// export const Logout = () => {
//     return ApiPost("/accounts/logout", {});
// };

export const getHttpOptions = (options = {}) => {
  let headers = {};
  if (options.hasOwnProperty("isAuth") && options.isAuth) {
    // headers["Authorization"] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZ21haWwuY29tIiwiX2lkIjoiNjA3OTc3Y2M0NjZhOWExN2JjYmQ1OWE1IiwiaWF0IjoxNjE4NTczMjYwLCJleHAiOjE2NTAxMDkyNjB9.6Y-mHv-vUD85dQfTa1WcXzrcin1yIvNCmfm715K-bug'
    if (authUtil.getToken()) {
      headers["x-auth-token"] = authUtil.getToken();
    }
    // else if (authUtil.getAdminToken()) {
    //     headers["Authorization"] = authUtil.getAdminToken();
    // }
  }

  if (options.hasOwnProperty("api_key") && options.api_key) {
    headers["api_key"] = "6QSy49rUTH";
  }
  if (options.hasOwnProperty("isJsonRequest") && options.isJsonRequest) {
    headers["Content-Type"] = "application/json";
  }

  if (options.hasOwnProperty("AdditionalParams") && options.AdditionalParams) {
    headers = { ...headers, ...options.AdditionalParams };
  }

  return { headers };
};

export default {
  ApiGet,
  ApiPost,
  ApiPut,
  ApiDelete,
  ApiUpload,
};

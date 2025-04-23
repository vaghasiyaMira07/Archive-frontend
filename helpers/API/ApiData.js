import axios from "axios";
import { ENDPOINTS } from "../../config/API/api-prod";
// import { useState, useCallback,useMemo, useEffect } from "react";

// import Loader from "../../components/Loader/Loader"
// import Auth from "../Auth";
import * as authUtil from "./../../utils/auth.util";

// Create axios instance with default config
const api = axios.create({
  baseURL: "https://archive-backend-phi.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
  // Add timeout and retry logic
  timeout: 10000, // 10 seconds
  retries: 3,
  retryDelay: 1000,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Remove quotes if token is stored with them
        const cleanToken = token.replace(/^"|"$/g, "");
        config.headers.Authorization = `Bearer ${cleanToken}`;
      }
      // Log the request for debugging
      console.log(`${config.method?.toUpperCase()} Request to:`, config.url);
      return config;
    } catch (error) {
      console.error("Request interceptor error:", error);
      return config;
    }
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  async (error) => {
    console.error("API Error:", error.response || error);

    // Get the original request config
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      window.location.href = "/signin";
    } else if (error.response?.status === 404) {
      // Log detailed information for 404 errors
      console.error("Resource not found:", {
        url: originalRequest.url,
        method: originalRequest.method,
        headers: originalRequest.headers,
      });
    }

    // Implement retry logic for failed requests
    if (originalRequest._retry !== true && originalRequest.retries > 0) {
      originalRequest._retry = true;
      originalRequest.retries -= 1;

      try {
        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, originalRequest.retryDelay)
        );
        return await api(originalRequest);
      } catch (retryError) {
        return Promise.reject(retryError);
      }
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
    console.error(`GET ${endpoint} failed:`, error.response || error);
    throw error;
  }
};

export const ApiPost = async (endpoint, data = {}) => {
  try {
    const response = await api.post(endpoint, data);
    return response;
  } catch (error) {
    console.error(`POST ${endpoint} failed:`, error.response || error);
    throw error;
  }
};

export const ApiPut = async (endpoint, data = {}) => {
  try {
    const response = await api.put(endpoint, data);
    return response;
  } catch (error) {
    console.error(`PUT ${endpoint} failed:`, error.response || error);
    throw error;
  }
};

export const ApiDelete = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response;
  } catch (error) {
    console.error(`DELETE ${endpoint} failed:`, error.response || error);
    throw error;
  }
};

// Specialized functions for project and user endpoints
export const getProjectUsers = async () => {
  try {
    const response = await ApiGet("/project/selectuser");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch project users:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await ApiGet("/user/find-all");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all users:", error);
    throw error;
  }
};

export const ApiUpload = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("File upload failed:", error.response || error);
    throw error;
  }
};

// No auth API calls
export const ApiPostNoAuth = async (endpoint, data = {}) => {
  try {
    const response = await api.post(endpoint, data);
    return response;
  } catch (error) {
    console.error(
      `POST ${endpoint} (no auth) failed:`,
      error.response || error
    );
    throw error;
  }
};

export const ApiGetNoAuth = async (endpoint, params = {}) => {
  try {
    const response = await api.get(endpoint, { params });
    return response;
  } catch (error) {
    console.error(`GET ${endpoint} (no auth) failed:`, error.response || error);
    throw error;
  }
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
  ApiPostNoAuth,
  ApiGetNoAuth,
  getProjectUsers,
  getAllUsers,
};

// const protocol = "https";
// const host = "api.dailystatus.rejoicehub.com/api/v1";

// Production API Configuration
const host = "archive-backend-phi.vercel.app";

export const API_URL = `https://${host}`;

// API Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: `${API_URL}/user/login`,
  REGISTER: `${API_URL}/user/register`,
  FORGOT_PASSWORD: `${API_URL}/user/forgot-password`,
  RESET_PASSWORD: `${API_URL}/user/reset-password`,

  // User
  USER_PROFILE: `${API_URL}/user/profile`,
  UPDATE_PROFILE: `${API_URL}/user/update-profile`,
  CHANGE_PASSWORD: `${API_URL}/user/change-password`,
  GET_ALL_USERS: `${API_URL}/user/find-all`,

  // Projects
  PROJECTS: `${API_URL}/projects`,
  PROJECT_DETAILS: (id) => `${API_URL}/projects/${id}`,
  PROJECT_USERS: `${API_URL}/project/selectuser`,

  // Reports
  DAILY_STATUS: `${API_URL}/report/daily-status`,
  ADD_STATUS: `${API_URL}/report/add-status`,
  DELETE_STATUS: (reportId, type, taskId) =>
    `${API_URL}/report/delete/${reportId}/${type}/${taskId}`,

  // Notifications
  NOTIFICATIONS: `${API_URL}/notification/get-notification`,
  UPDATE_NOTIFICATION: `${API_URL}/notification/update-notification-status`,

  // Uploads
  UPLOAD: `${API_URL}/upload`,
};

export default ENDPOINTS;

// const protocol = "https";
// const host = "api.dailystatus.rejoicehub.com/api/v1";

// Development API Configuration
const host = "archive-backend-phi.vercel.app/api/v1";

//const host = "api.7cmg.rejoicehub.com/api";

const port = "";
const trailUrl = "";

const hostUrl = `${protocol}://${host}${port ? ":" + port : ""}/`;
const endpoint = `${protocol}://${host}${port ? ":" + port : ""}${trailUrl}`;

export const API_URL = `https://${host}`;

// API Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/register`,
  FORGOT_PASSWORD: `${API_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_URL}/auth/reset-password`,

  // User
  USER_PROFILE: `${API_URL}/user/profile`,
  UPDATE_PROFILE: `${API_URL}/user/update-profile`,
  CHANGE_PASSWORD: `${API_URL}/user/change-password`,

  // Projects
  PROJECTS: `${API_URL}/projects`,
  PROJECT_DETAILS: (id) => `${API_URL}/projects/${id}`,

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

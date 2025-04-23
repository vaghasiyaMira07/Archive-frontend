import API_DEV from "./api-dev";
import API_LOCAL from "./api-local";
// import API_PROD from "./api-prod";
const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
const port = typeof window !== 'undefined' ? window.location.port : '';
let isLocalApi = port >= 3000;

export const API =
  hostname === "localhost" && isLocalApi
    ? API_LOCAL
    : hostname === "localhost"
    ? API_DEV
    : API_LOCAL;

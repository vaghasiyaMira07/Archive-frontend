// const protocol = "https";
// const host = "api.dailystatus.rejoicehub.com/api/v1";

const protocol = "http"; 
const host = "localhost:8000/api/v1";

// const host = "192.168.29.50:5500/api";
// const protocol = "http";

//const host = "api.7cmg.rejoicehub.com/api";
// const host = "localhost:5500/api";

const port = "";
const trailUrl = "";

const hostUrl = `${protocol}://${host}${port ? ":" + port : ""}`;
const endpoint = `${protocol}://${host}${port ? ":" + port : ""}${trailUrl}`;

export default {
    protocol: protocol,
    host: host,
    port: port,
    apiUrl: trailUrl,
    endpoint: endpoint,
    hostUrl: hostUrl,
};
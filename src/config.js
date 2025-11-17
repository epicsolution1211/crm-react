export const getAPIUrl = () => {
  const apiUrl = localStorage.getItem("server_url");
  return apiUrl?.replace(/\/api\/?$/, '') ?? 'https://api.octolit.com/'
};

export const getDynamicBaseUrl = () => {
  const storedServerUrl = localStorage.getItem("server_url");
  return storedServerUrl || 'https://api.octolit.com/api';
};

export const getDynamicMiniChatServerUrl = () => {
  const storedServerUrl = localStorage.getItem("mini_chat_server_url");
  return storedServerUrl || '';
};

export const gtmConfig = {
  containerId: process.env.REACT_APP_GTM_CONTAINER_ID
};

export const mapboxConfig = {
  apiKey: process.env.REACT_APP_MAPBOX_API_KEY
};

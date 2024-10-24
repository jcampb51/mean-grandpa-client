const API_URL = "http://localhost:8000";

const checkError = (res) => {
  if (!res.ok) {
    throw Error(res.status);
  }
  return res;
};

const checkErrorJson = async (res) => {
  const data = await res.json().catch((err) => {
    console.error("Failed to parse JSON:", err);
    return {};
  });

  if (!res.ok) {
    const errorMessage = data.message || `Error: ${res.status}`;
    throw new Error(errorMessage);
  }

  return data;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Token ${token}` } : {};
};

export const fetchWithResponse = async (resource, options = {}) => {
  try {
    const response = await fetch(`${API_URL}/${resource}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });
    return await checkErrorJson(response);
  } catch (error) {
    if (error.message === "401") {
      window.location.href = "/login";
    }
    throw error;
  }
};

export const fetchWithoutResponse = (resource, options = {}) =>
  fetch(`${API_URL}/${resource}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })
    .then(checkError)
    .catch((err) => {
      if (err.message === "401") {
        window.location.href = "/login";
      }
      throw err;
    });

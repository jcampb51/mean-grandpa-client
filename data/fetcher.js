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
    return {}; // Return empty object if parsing fails
  });

  if (!res.ok) {
    console.error("Error Response:", data);

    // Extract the error messages for specific fields, like 'price'
    const errorMessage = data.price
      ? data.price.join(" ")
      : data.message || `Error: ${res.status}`;
    throw new Error(errorMessage);
  }

  return data;
};

const catchError = (err) => {
  if (err.message === "401") {
    window.location.href = "/login";
  }
  if (err.message === "404") {
    throw Error(err.message);
  }
};

export const fetchWithResponse = async (resource, options) => {
  try {
    const response = await fetch(`${API_URL}/${resource}`, options);
    return await checkErrorJson(response);
  } catch (error) {
    if (error.message === "401") {
      window.location.href = "/login";
    }
    throw error; // Re-throw the error for the component to handle
  }
};

export const fetchWithoutResponse = (resource, options) =>
  fetch(`${API_URL}/${resource}`, options).then(checkError).catch(catchError);

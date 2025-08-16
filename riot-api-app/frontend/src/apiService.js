const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
      ...options
    });
    
    if (!response.ok) {
      throw new Error(await response.text());
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'API call failed');
  }
};

export const authAPI = {
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  })
};

export const accountAPI = {
  searchByRiotId: (gameName, tagLine, region) => {
    const params = new URLSearchParams({ gameName, tagLine, region });
    return apiCall(`/account/by-riot-id?${params.toString()}`);
  }
};

export { apiCall }; 
const API_URL = '/api';

function authorizationHeader() {
  const credentials = sessionStorage.getItem('apiAuthorization');
  return credentials ? { Authorization: `Basic ${credentials}` } : {};
}

export function guardarCredenciales(correo, password) {
  const bytes = new TextEncoder().encode(`${correo}:${password}`);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  sessionStorage.setItem('apiAuthorization', btoa(binary));
}

export async function apiRequest(path, options = {}) {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...authorizationHeader(),
    ...options.headers,
  };
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (response.status === 204) {
    return null;
  }

  const responseText = await response.text();
  let data;
  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.mensaje || `Error HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

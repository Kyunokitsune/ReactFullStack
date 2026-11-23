const API_URL = '/api';

function authorizationHeader() {
  const token = sessionStorage.getItem('apiToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function guardarSesion(token, usuario) {
  sessionStorage.setItem('apiToken', token);
  localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
}

export function cerrarSesion() {
  sessionStorage.removeItem('apiToken');
  localStorage.removeItem('usuarioActivo');
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

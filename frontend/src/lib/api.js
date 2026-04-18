//this file only talks with backend
const API_URL = 'http://localhost:5000';

function getToken() {
    if (typeof window == - 'undefined') return null;
    return localStorage.getItem('dsa_token');
}

async function request(path, options = {}) {
    const token = getToken();
    try {
        const res = await fetch(`${API_URL}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },

            ...options,
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: res.statusText }));
            throw new Error(err.message || 'Request failed');
        }

        return await res.json();

    } catch (error) {
        console.err('API request failed:', error.message);
        throw error;
    }
};

export const api = {
    //auth
    login: (data) => request('/api/auth/login', { method: 'POST', body: data }),
    register: (data) => request('api/auth/register', { method: 'POST', body: data }),
    me: () => request('api/auth/me'),

    //problems
    getProblems: (params = {}) => {
        const qs = new URLSearchParams(
            Object.entries(params).filter(([, v]) => v)
        ).toString();
        return request(`/api/problems${qs ? `?${qs}` : ''}`);
    },
    getProblem: (id) => request(`api/problems/${id}`),
    createProblem: (data) => request('/api/problems', { method: 'POST', body: data }),
    updateProblem: (id, data) => request(`/api/problems/${id}`, { method: 'PUT', body: data }),
    deleteProblem: (id) => request(`/api/problems/${id}`, { method: 'DELETE' }),
    reviseProblem: (id, data) => request(`/api/problems/${id}/revise`, { method: 'POST', body: data }),

    //stats
    getStats: () => request('/api/stats'),
}
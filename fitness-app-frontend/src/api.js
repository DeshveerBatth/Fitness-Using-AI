import axios from "axios";

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Request interceptor with debugging
api.interceptors.request.use(
    config => {
        console.log('🚀 API Request:', {
            url: config.url,
            method: config.method,
            baseURL: config.baseURL,
            fullURL: `${config.baseURL}${config.url}`,
            headers: config.headers,
            data: config.data
        });

        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        
        console.log('📝 Auth info:', {
            userId: userId ? 'Present' : 'Missing',
            token: token ? `Present (${token.substring(0, 20)}...)` : 'Missing'
        });

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        if (userId) {
            config.headers['X-User-ID'] = userId;
        }

        return config;
    },
    error => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor with debugging
api.interceptors.response.use(
    response => {
        console.log('✅ API Response:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    error => {
        console.error('❌ API Error:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                baseURL: error.config?.baseURL
            }
        });

        // Check for specific error types
        if (error.code === 'ECONNREFUSED') {
            console.error('🔥 Server connection refused - Is your backend running?');
        }
        if (error.code === 'NETWORK_ERROR') {
            console.error('🔥 Network error - Check your internet connection');
        }
        if (error.response?.status === 401) {
            console.error('🔥 Unauthorized - Check your token');
        }
        if (error.response?.status === 403) {
            console.error('🔥 Forbidden - Check your permissions');
        }

        return Promise.reject(error);
    }
);

export const getActivity = () => {
    console.log('📋 Getting activities...');
    return api.get('/activities');
};

export const addActivity = (activity) => {
    console.log('➕ Adding activity:', activity);
    return api.post('/activities', activity);
};

export const getActivityDetail = async (id) => {
    console.log('🔍 Getting activity detail for ID:', id);
    
    try {
        // Get basic activity details
        const activityResponse = await api.get(`/activities/${id}`);
        
        // Try to get recommendations (optional)
        let recommendationData = {};
        try {
            const recommendationResponse = await api.get(`/recommendations/activity/${id}`);
            recommendationData = recommendationResponse.data;
        } catch (recError) {
            console.warn('⚠️ Could not fetch recommendations:', recError);
            // Don't fail the whole request if recommendations fail
        }
        
        // Combine the data
        return {
            ...activityResponse,
            data: {
                ...activityResponse.data,
                ...recommendationData
            }
        };
    } catch (error) {
        console.error('❌ Error fetching activity detail:', error);
        throw error;
    }
};


// Helper function to test API connectivity
export const testConnection = async () => {
    try {
        console.log('🔧 Testing API connection...');
        const response = await api.get('/health'); // Assuming you have a health endpoint
        console.log('✅ API connection successful');
        return true;
    } catch (error) {
        console.error('❌ API connection failed:', error.message);
        return false;
    }
};
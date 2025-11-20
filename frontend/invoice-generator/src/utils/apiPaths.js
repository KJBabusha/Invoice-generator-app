export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
    AUTH:{
        REGISTER: "/api/auth/register", //sign up
        LOGIN: "/api/auth/login", // Authenticate user & return token
        GET_PROFILE: "/api/auth/me", // Get logged in user details
        UPDATE_PROFILE: "/api/auth/me", // Update  profile details (PUT)
    },
    INVOICES:{
        CREATE: "/api/invoices", // Create new invoice (POST)
        GET_ALL: "/api/invoices", // Get all invoices for logged-in user (GET)
        GET_INVOICE_BY_ID: (id) => `/api/invoices/${id}`, // Get invoice by ID (GET)
        UPDATE_INVOICE: (id) => `/api/invoices/${id}`, // Update invoice by ID (PUT)
        DELETE_INVOICE: (id) => `/api/invoices/${id}`, // Delete invoice by ID (DELETE)
    },
    AI:{
        PARSE_INVOICE_TEXT: "/api/ai/parse-text", // Parse invoice text to structured data (POST)
        GENERATE_REMINDER: "/api/ai/generate-reminder", // Generate reminder email for an invoice (GET)
        GET_DASHBOARD_SUMMARY: "/api/ai/dashboard-summary", // Get dashboard summary (GET)
    }
};
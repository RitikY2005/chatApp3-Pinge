export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AUTH_ROUTES = `api/v1/users`;
export const REGISTER_ROUTE = `${BACKEND_URL}/${AUTH_ROUTES}/register`;
export const LOGIN_ROUTE = `${BACKEND_URL}/${AUTH_ROUTES}/login`;
export const LOGOUT_ROUTE = `${BACKEND_URL}/${AUTH_ROUTES}/logout`;
export const UPLOAD_AVATAR_ROUTE = `${BACKEND_URL}/${AUTH_ROUTES}/upload-avatar`;
export const UPDATE_PROFILE_ROUTE = `${BACKEND_URL}/${AUTH_ROUTES}/update-profile`;

export const CONTACT_ROUTES = `api/v1/contacts`;
export const ALL_CONTACTS_ROUTES = `${BACKEND_URL}/${CONTACT_ROUTES}/all-contacts`;

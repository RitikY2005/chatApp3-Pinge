export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const NODE_ENV = import.meta.env.VITE_NODE_ENV;
export const AUTH_ROUTES = `api/v1/users`;
export const REGISTER_ROUTE = `${BACKEND_URL}/${AUTH_ROUTES}/register`;
export const LOGIN_ROUTE = `${BACKEND_URL}/${AUTH_ROUTES}/login`;
export const LOGOUT_ROUTE = `${BACKEND_URL}/${AUTH_ROUTES}/logout`;
export const UPLOAD_AVATAR_ROUTE = `${BACKEND_URL}/${AUTH_ROUTES}/upload-avatar`;
export const UPDATE_PROFILE_ROUTE = `${BACKEND_URL}/${AUTH_ROUTES}/update-profile`;

export const CONTACT_ROUTES = `api/v1/contacts`;
export const ALL_CONTACTS_ROUTES = `${BACKEND_URL}/${CONTACT_ROUTES}/all-contacts`;
export const MY_CONTACTS_ROUTE = `${BACKEND_URL}/${CONTACT_ROUTES}/my-contacts`;
export const ALL_USERS_CHANNEL_ROUTE = `${BACKEND_URL}/${CONTACT_ROUTES}/all-users`;

export const MESSAGES_ROUTES = `api/v1/messages`;
export const SEND_FILE_ROUTE = `${BACKEND_URL}/${MESSAGES_ROUTES}/upload-file`;
export const CHAT_HISTORY_ROUTE = `${BACKEND_URL}/${MESSAGES_ROUTES}/dm-chat-history`;

export const CHANNELS_ROUTES = `api/v1/channels`;
export const CREATE_CHANNEL_ROUTE = `${BACKEND_URL}/${CHANNELS_ROUTES}/create-channel`;
export const MY_CHANNELS_ROUTE = `${BACKEND_URL}/${CHANNELS_ROUTES}/my-channels`;
export const CHANNEL_HISTORY_ROUTE = `${BACKEND_URL}/${CHANNELS_ROUTES}/channel-chat-history`;

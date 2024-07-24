/**
 * Current semester
 */
const SEMESTER = import.meta.env.VITE_SEMESTER;

/**
 * Nus mods base api for fetching mod info
 */
const NUS_MODS_BASE_API = import.meta.env.VITE_NUS_MODS_BASE_API;

/**
 * Base api endpoint for server requests
 */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export { SEMESTER, NUS_MODS_BASE_API, BACKEND_URL };

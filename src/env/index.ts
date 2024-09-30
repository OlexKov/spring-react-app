const SERVER_HOST: string = import.meta.env.VITE_APP_SERVER_HOST;
const CATEGORIES_API_URL: string = import.meta.env.VITE_APP_CATEGORIES_API_URL;
const PRODUCTS_API_URL: string = import.meta.env.VITE_APP_PRODUCTS_API_URL;
const IMAGES_FOLDER: string = import.meta.env.VITE_APP_IMAGES_FOLDER;
const INVOICE_API_URL: string = import.meta.env.VITE_APP_INVOICE_API_URL;
const FILES_FOLDER: string = import.meta.env.VITE_APP_FILES_FOLDER;
const ACCESS_KEY: string = import.meta.env.VITE_APP_ACCESS_KEY;
const ACCOUNT_API_URL: string = import.meta.env.VITE_APP_ACCOUNTS_API_URL;
const FAVORITES_KEY: string = import.meta.env.VITE_APP_FAVORITES_KEY;
const APP_MODE: string = import.meta.env.VITE_APP_APP_MODE;
const CART_KEY: string = import.meta.env.VITE_APP_CART;
const CLIENT_ID: string = import.meta.env.VITE_APP_CLIENT_ID;
const RECAPTCHA_SITE_KEY: string = import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY;
const APP_ENV = {
    SERVER_HOST,
    CATEGORIES_API_URL,
    IMAGES_FOLDER,
    INVOICE_API_URL,
    FILES_FOLDER,
    PRODUCTS_API_URL,
    ACCESS_KEY,
    ACCOUNT_API_URL,
    FAVORITES_KEY,
    APP_MODE,
    CART_KEY,
    CLIENT_ID,
    RECAPTCHA_SITE_KEY
};

export { APP_ENV }
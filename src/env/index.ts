const SERVER_HOST: string = import.meta.env.VITE_APP_SERVER_HOST;
const CATEGORIES_API_URL: string = import.meta.env.VITE_APP_CATEGORIES_API_URL;
const PRODUCTS_API_URL: string = import.meta.env.VITE_APP_PRODUCTS_API_URL;
const IMAGES_FOLDER: string = import.meta.env.VITE_APP_IMAGES_FOLDER;
const INVOICE_API_URL: string = import.meta.env.VITE_APP_INVOICE_API_URL;
const FILES_FOLDER: string = import.meta.env.VITE_APP_FILES_FOLDER;

const APP_ENV = {
    SERVER_HOST,
    CATEGORIES_API_URL,
    IMAGES_FOLDER,
    INVOICE_API_URL,
    FILES_FOLDER,
    PRODUCTS_API_URL
};

export {APP_ENV}
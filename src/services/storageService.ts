import { APP_ENV } from "../env";

const accessKey = APP_ENV.ACCESS_KEY;
const isSessionStorage = () => sessionStorage.getItem(accessKey) !== null;

export const storageService = {
    saveTokens: (accessToken: string) => {
        if (isSessionStorage()) {
            sessionStorage.setItem(accessKey, accessToken);
            localStorage.removeItem(accessKey);
        }
        else {
            localStorage.setItem(accessKey, accessToken);
            sessionStorage.removeItem(accessKey);
        }
    },

    getAccessToken: () => sessionStorage.getItem(accessKey) || localStorage.getItem(accessKey),

    setTemporalyTokens: (accessToken: string) => sessionStorage.setItem(accessKey, accessToken),

    removeTokens: () => {
        localStorage.removeItem(accessKey);
        sessionStorage.removeItem(accessKey);
    }
}
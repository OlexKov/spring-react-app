import { APP_ENV } from "../env";

const accessKey = APP_ENV.ACCESS_KEY;
const favouritesKey = APP_ENV.FAVORITES_KEY;
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
    },

    //-------------------------------------------------------------------------------------

    isLocalFavorites: (): boolean => localStorage.getItem(favouritesKey) ? true : false,

    getLocalFavorites: (): number[] => {
        const fav = localStorage.getItem(favouritesKey);
        return fav ? JSON.parse(fav) : []
    },

    setLocalFavorites: (favorites: number[]) => localStorage.setItem(favouritesKey, JSON.stringify(favorites)),

    toggleFavorites: (favorite: number) => {
        let favs: number[] = storageService.getLocalFavorites() || [];
        if (favs.includes(favorite)) {
            storageService.setLocalFavorites(favs.filter(x => x !== favorite));
            return
        }
        else {
            favs.push(favorite)
        }
        storageService.setLocalFavorites(favs);
        // localStorage.removeItem(favouritesKey)
    },
}
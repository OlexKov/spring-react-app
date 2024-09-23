import { APP_ENV } from "../env";

const accessKey = APP_ENV.ACCESS_KEY;
const favouritesKey = APP_ENV.FAVORITES_KEY;

export const storageService = {
    saveToken: async (accessToken: string,session:boolean ) => {
        if (session) {
            sessionStorage.setItem(accessKey, accessToken);
            localStorage.removeItem(accessKey);
        }
        else {
            localStorage.setItem(accessKey, accessToken);
            sessionStorage.removeItem(accessKey);
        }
      
    },

    getAccessToken: () => sessionStorage.getItem(accessKey) || localStorage.getItem(accessKey),

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

    toggleFavorites: (favorite: number) => {
        let favs: number[] = storageService.getLocalFavorites() || [];
        if (favs.includes(favorite)) {
            favs = favs.filter(x => x !== favorite);
        }
        else {
            favs.push(favorite)
        }
        localStorage.setItem(favouritesKey, JSON.stringify(favs))
    },
    clearFavorites:() => localStorage.removeItem(favouritesKey)
}
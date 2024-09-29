import { jwtDecode } from "jwt-decode";
import { IUser } from "../models/IUser";
import { makeAutoObservable } from "mobx";
import { accountService } from "../services/accountService";
import { storageService } from "../services/storageService";

class UserStore {
    private user: IUser | undefined;
    private favoritesCount: number;
    constructor() {
        this.user = undefined;
        this.favoritesCount = 0;
        makeAutoObservable(this)
    }
    get favCount(): number { return this.favoritesCount };
    set favCount(count: number) { this.favoritesCount = count }
    get id(): number | undefined { return this.user?.id };
    get name(): string | undefined { return this.user?.name };
    get username(): string | undefined { return this.user?.username };
    get surname(): string | undefined { return this.user?.surname };
    get birthdate(): string | undefined { return this.user?.birthdate };
    get email(): string | undefined { return this.user?.email };
    get roles(): string[] | undefined { return this.user?.roles };
    get avatar(): string | undefined { return this.user?.image };
    get isAdmin(): boolean { return this.user?.roles.includes('Admin') || false };
    get isAuthorized(): boolean { return this.user ? true : false };
    async setUserData(token: string | null | undefined) {
        if (token && token !== '') {
            const data: IUser = jwtDecode<IUser>(token);
            this.user = {
                id: data.id,
                name: data.name,
                surname: data.surname,
                email: data.email,
                roles: data.roles,
                birthdate: data.birthdate,
                image: data.image,
                username: data.username
            }
            if (this.user && !this.isAdmin) {
                const result = await accountService.addFavorites(storageService.getLocalFavorites());
                if (result.status === 200) {
                    this.favCount = result.data;
                    storageService.clearFavorites();
                }
            }
            return
        }
        this.user = undefined;
    };
    clearUserData() {
        this.user = undefined
        this.favoritesCount = 0;
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new UserStore();
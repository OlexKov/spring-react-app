import { jwtDecode } from "jwt-decode";
import { storageService } from "../services/storageService";
import { IUser } from "../models/IUser";
import { makeAutoObservable } from "mobx";

class UserStore {
    user: IUser | undefined;
    constructor() {
        const token = storageService.getAccessToken();
        if (token && token !== '') {
            this.setUserData(token);
        }
        else this.user = undefined
        makeAutoObservable(this)
    }
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
    setUserData(token: string) {
        const data: IUser = jwtDecode<IUser>(token);
        this.user = {
            id: data.id,
            name: data.name,
            surname: data.surname,
            email: data.email,
            roles: data.roles,
            birthdate: data.birthdate,
            image: data.image,
            username:data.username
        }
    };
    clearUserData() { this.user = undefined }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new UserStore();
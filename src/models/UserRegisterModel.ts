export interface UserRegisterModel {
    id: number;
    username: string;
    password: string;
    name: string;
    email: string;
    surname: string;
    birthdate: string;
    file: File | null;
    recaptchaToken:string;
}


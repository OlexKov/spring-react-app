import axios from "axios";
import { APP_ENV } from "../env";
import { TryError } from "../helpers/common-methods";
import { formPostConfig } from "../helpers/constants";
import { LoginModel } from "../models/LoginModel";
import { LoginResponseModel } from "../models/LoginResponseModel";
import { UserRegisterModel } from "../models/UserRegisterModel";

const accountsAPIUrl = APP_ENV.ACCOUNT_API_URL;
export const accountService = {

    login: (model:LoginModel) => TryError<LoginResponseModel>(()=>  axios.post<LoginResponseModel>(accountsAPIUrl + '/sign-in',  model ,formPostConfig)),
    register:(user:UserRegisterModel)=> TryError(()=> axios.post(accountsAPIUrl + '/sign-up', user,formPostConfig)),
   
}
import axios from "axios";
import { APP_ENV } from "../env";
import { TryError } from "../helpers/common-methods";
import { formPostConfig } from "../helpers/constants";
import { LoginModel } from "../models/LoginModel";
import { LoginResponseModel } from "../models/LoginResponseModel";
import { UserRegisterModel } from "../models/UserRegisterModel";
import { IPaginationResponse } from "../models/PaginarionResponse";
import { IProduct } from "../models/Product";

const accountsAPIUrl = APP_ENV.ACCOUNT_API_URL;
export const accountService = {

    login: (model:LoginModel) => TryError<LoginResponseModel>(()=>  axios.post<LoginResponseModel>(accountsAPIUrl + '/sign-in',  model ,formPostConfig)),
    register:(user:UserRegisterModel)=> TryError(()=> axios.post(accountsAPIUrl + '/sign-up', user,formPostConfig)),
    addFavorite:(id:number)=> TryError<number>(()=> axios.post(accountsAPIUrl + `/add-favorite/${id}`)),
    addFavorites:(ids:number[])=> TryError<number>(()=> axios.post(accountsAPIUrl + `/add-favorite`,ids)),
    removeFavorite:(id:number)=> TryError<number>(()=> axios.post(accountsAPIUrl + `/remove-favorite/${id}`)),
    getFavorites:(page:number,size:number)=> TryError<IPaginationResponse<IProduct>>(()=> axios.get<IPaginationResponse<IProduct>>(accountsAPIUrl + `/get-favorites/${page}/${size}`)),
}
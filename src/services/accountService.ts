import axios from "axios";
import { APP_ENV } from "../env";
import { TryError } from "../helpers/common-methods";
import { formPostConfig } from "../helpers/constants";
import { LoginModel } from "../models/LoginModel";
import { LoginResponseModel } from "../models/LoginResponseModel";
import { UserRegisterModel } from "../models/UserRegisterModel";
import { IPaginationResponse } from "../models/PaginarionResponse";
import { IProduct } from "../models/Product";
import { CartProduct } from "../models/CartProduct";
import { CartProductResponseModel } from "../models/CartProductResponseModel";


const accountsAPIUrl = APP_ENV.ACCOUNT_API_URL;
export const accountService = {

    login: (model:LoginModel) => TryError<LoginResponseModel>(()=>  axios.post<LoginResponseModel>(accountsAPIUrl + '/sign-in',  model ,formPostConfig)),
    googleLogin: (token:LoginResponseModel) => TryError<LoginResponseModel>(()=>  axios.post<LoginResponseModel>(accountsAPIUrl + `/sign-in/google`,token)),
    register:(user:UserRegisterModel)=> TryError(()=> axios.post(accountsAPIUrl + '/sign-up', user,formPostConfig)),

    addFavorite:(id:number)=> TryError<number>(()=> axios.post(accountsAPIUrl + `/add-favorite/${id}`)),
    addFavorites:(ids:number[])=> TryError<number>(()=> axios.post(accountsAPIUrl + `/add-favorite`,ids)),
    removeFavorite:(id:number)=> TryError<number>(()=> axios.post(accountsAPIUrl + `/remove-favorite/${id}`)),
    getFavorites:(page:number,size:number)=> TryError<IPaginationResponse<IProduct>>(()=> axios.get<IPaginationResponse<IProduct>>(accountsAPIUrl + `/get-favorites/${page}/${size}`)),

    removeFromCart:(id:number)=> TryError<number>(()=> axios.delete(accountsAPIUrl + `/remove-from-cart/${id}`)),
    addToCart:(id:number)=> TryError<number>(()=> axios.post(accountsAPIUrl + `/add-to-cart/${id}`)),
    addAllToCart:(cart:CartProductResponseModel[])=> TryError<number>(()=> axios.post(accountsAPIUrl + `/add-to-cart`,cart)),
    getCart:()=> TryError<CartProduct[]>(()=> axios.get<CartProduct[]>(accountsAPIUrl + `/get-cart`)),
    setCount:(id:number,count:number)=> TryError(()=> axios.post(accountsAPIUrl + `/set-count/${id}/${count}`)),
}
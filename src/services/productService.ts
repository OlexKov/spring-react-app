import axios from "axios";
import { TryError } from "../helpers/common-methods";
import { formPostConfig} from "../helpers/constants";
import { IPaginationResponse } from "../models/PaginarionResponse";
import { ICategory } from "../models/Category";
import { APP_ENV } from "../env";
import { IProduct } from "../models/Product";
import { SearchData } from "../models/SearchData";

export const productService = {
    search: (search:SearchData) =>TryError<IPaginationResponse<IProduct>>(()=> axios.post<IPaginationResponse<IProduct>>(APP_ENV.PRODUCTS_API_URL + `/get`,search,formPostConfig)),
    get: (page:number,size:number) =>TryError<IPaginationResponse<IProduct>>(()=> axios.get<IPaginationResponse<IProduct>>(APP_ENV.PRODUCTS_API_URL + `/get/${page-1}/${size}`)),
    getByIds: (page:number,size:number,ids:number[]) =>TryError<IPaginationResponse<IProduct>>(()=> axios.post<IPaginationResponse<IProduct>>(APP_ENV.PRODUCTS_API_URL + `/get/${page-1}/${size}`,ids)),
    create: (model: FormData) =>TryError<number>(()=> axios.post<number>(APP_ENV.PRODUCTS_API_URL + `/create` ,model,formPostConfig)),
    getById: (id: number) =>TryError<IProduct>(()=> axios.get<ICategory>(APP_ENV.PRODUCTS_API_URL + `/get/${id}`)),
    delete:(id: number) =>TryError(()=> axios.delete(APP_ENV.PRODUCTS_API_URL + `/delete/${id}`)),
    update: (model: FormData) =>TryError<number>(()=> axios.put<number>(APP_ENV.PRODUCTS_API_URL + `/update` ,model,formPostConfig)),

}
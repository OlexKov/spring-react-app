import axios from "axios";
import { TryError } from "../helpers/common-methods";
import { CategoryCreationModel } from "../models/CategoryCreationModel";
import { formPostConfig} from "../helpers/constants";
import { IPaginationResponse } from "../models/PaginarionResponse";
import { ICategory } from "../models/Category";
import { APP_ENV } from "../env";

export const categoryService = {
    getByName: (page:number,size:number,name:string) =>TryError<IPaginationResponse<ICategory>>(()=> axios.get<IPaginationResponse<ICategory>>(APP_ENV.CATEGORIES_API_URL + `/get/${page}/${size}/${name}`)),
    get: (page:number,size:number) =>TryError<IPaginationResponse<ICategory>>(()=> axios.get<IPaginationResponse<ICategory>>(APP_ENV.CATEGORIES_API_URL + `/get/${page-1}/${size}`)),
    create: (model: CategoryCreationModel) =>TryError<number>(()=> axios.post<number>(APP_ENV.CATEGORIES_API_URL + `/create` ,model,formPostConfig)),
    getById: (id: number) =>TryError<ICategory>(()=> axios.get<ICategory>(APP_ENV.CATEGORIES_API_URL + `/get/${id}`)),
    delete:(id: number) =>TryError(()=> axios.delete(APP_ENV.CATEGORIES_API_URL + `/delete/${id}`)),
    update: (model: CategoryCreationModel) =>TryError<number>(()=> axios.put<number>(APP_ENV.CATEGORIES_API_URL + `/update` ,model,formPostConfig)),
}
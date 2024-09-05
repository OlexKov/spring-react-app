import axios from "axios";
import { TryError } from "../helpers/common-methods";
import { CategoryCreationModel } from "../models/CategoryCreationModel";
import { formPostConfig} from "../helpers/constants";
import { ICategoryResponse } from "../components/models/ICategoryResponse";
import { ICategory } from "../components/models/ICategory";
const categoryAPIUrl = import.meta.env.VITE_APP_CATEGORIES_API_URL;
export const categoryService = {

    getByName: (page:number,size:number,name:string) =>TryError<ICategoryResponse>(()=> axios.get<ICategoryResponse>(categoryAPIUrl + `/get/${page}/${size}/${name}`)),
    get: (page:number,size:number) =>TryError<ICategoryResponse>(()=> axios.get<ICategoryResponse>(categoryAPIUrl + `/get/${page-1}/${size}`)),
    create: (model: CategoryCreationModel) =>TryError<number>(()=> axios.post<number>(categoryAPIUrl + `/create` ,model,formPostConfig)),
    getById: (id: number) =>TryError<ICategory>(()=> axios.get<ICategory>(categoryAPIUrl + `/get/${id}`)),
    delete:(id: number) =>TryError(()=> axios.delete(categoryAPIUrl + `/delete/${id}`)),
    update: (model: CategoryCreationModel) =>TryError<number>(()=> axios.put<number>(categoryAPIUrl + `/update` ,model,formPostConfig)),
}
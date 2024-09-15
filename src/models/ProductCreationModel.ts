import { UploadFile } from "antd";

export interface ProductCreationModel{
    id:number;
    name:string;
    description:string;
    price:number;
    discount:number;
    categoryId:number;
    files:(UploadFile | undefined)[]
}
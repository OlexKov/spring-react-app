import { IProductImage } from "./ProductImage";

export interface IProduct{
    id:number
    name:string
    description:string;
    creationTime:string;
    price:number;
    discount:number;
    images:IProductImage[];
    categoryId:number;
    categoryName:string;
}
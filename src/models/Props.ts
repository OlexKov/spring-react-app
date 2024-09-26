import { UploadFile } from "antd"
import { ReactElement } from "react"
import { IProduct } from "./Product"
import { BasketProduct } from "./BasketProduct"

export interface ImageLoaderProps {
    files: UploadFile[]
    onChange?: Function
}

export interface SortedImageProps {
    item: UploadFile,
    deleteHandler: Function
}

export interface ProtectedRouteProps {
    redirectPath?: string
    children: ReactElement
}

export interface ProductViewProps {
    product: IProduct
    onClick?: Function
    onFavoriteChange?: Function
    onEdit?:Function
}

export interface FavoriteButtonProps{
    product?:IProduct,
    onChange?:Function
}

export interface BasketProductProps{
    basketProduct:BasketProduct,
    onCountClick:Function
}
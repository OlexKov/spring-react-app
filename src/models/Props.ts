import { UploadFile } from "antd"
import { ReactElement } from "react"
import { IProduct } from "./Product"
import { CartProduct } from "./CartProduct"

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

export interface ProductButtonProps{
    product?:IProduct,
    onChange?:Function
}

export interface CartProductProps{
    cartProduct:CartProduct,
    onCountClick:Function
}


import { UploadFile } from "antd"
import { ReactElement, ReactNode } from "react"
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

export interface CartProductViewProps {
    cartProduct: CartProduct
    onDelete?: Function
    onCountChange?:Function
}

export interface ProductButtonProps{
    product?:IProduct,
    onChange?:Function
    hidden:boolean
}

export interface LoginButtonProps{
    title:string
    onLogin?:Function
    icon:ReactNode
}

export interface SmallCartProductProps{
    cartProduct:CartProduct,
    onCountClick:Function
}


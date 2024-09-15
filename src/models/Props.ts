import { UploadFile } from "antd"

export interface ImageLoaderProps {
    files: UploadFile[]
    onChange?: Function
}

export interface SortedImageProps {
    item: UploadFile,
    deleteHandler: Function
}
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetProp, UploadFile, UploadProps } from "antd";
import { AxiosResponse } from "axios"


export const TryError = <T>(funct: Function): AxiosResponse<T, any> => {
    return funct().catch((error: any) => error)
}

export const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  
  export const reorder = (list: UploadFile[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
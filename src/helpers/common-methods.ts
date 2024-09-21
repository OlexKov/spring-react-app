/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetProp, UploadFile, UploadProps } from "antd";
import { AxiosResponse } from "axios"


export const TryError = async <T>(funct: Function): Promise<AxiosResponse<T, any>> => await funct().catch((error: any) => error)


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

  export const getQueryString = (filter: any): string => {
    let result = '';
    Object.keys(filter).forEach((key) => {
      if (filter[key] !== undefined
        && filter[key] !== null
        && filter[key] !== ''
        && filter[key]?.length !== 0) {
        const value = typeof (filter[key]) === "object"
          ? JSON.stringify(filter[key])
          : filter[key];
        const symbol = result === '' ? '?' : '&'
        result += `${symbol + key}=${value}`
      }
    });
    return result;
  } 

  export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
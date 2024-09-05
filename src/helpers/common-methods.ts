/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios"


export const TryError = <T>(funct: Function): AxiosResponse<T, any> => {
    return funct().catch((error: any) => error)
}
import { ReactNode } from "react";

export interface MenuItem  {
    key:string
    label:ReactNode
    danger?: boolean;
    icon?: React.ReactNode;
    title?: string;
    users?:string[]
}
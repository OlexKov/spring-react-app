export interface SearchData{
    page:number 
    size:number
    name:string
    categories:string[] | undefined
    description:string
    sort:string
    sortDir:string
}
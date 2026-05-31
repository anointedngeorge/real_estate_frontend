import { UUID } from "crypto"


export interface ResponseInterface {
    message: string
    data: any
    status: boolean,
    status_code: number
}


export interface SystemSettingsInterface {
    data:string
}



export interface UsersListingInterface {
     id: string,
     username: string,
     email: string,
     first_name: string,
     last_name: string,
     role: string,
     phone_number: string | null ,
     date_joined: Date

}
export interface UsersListingQueryInterface {
    id?: string,  
    exclude_users_roles?: string | null,
    page?: number,
    page_size?: number
}



export interface ClienteCreateDto{
    email: string,
    password?: string,
    nombre?: string,
    session_token?: string
}

export interface ClienteUpdatedDto{
    email?: string,
    password?: string,
    nombre?: string 
}
export interface Cliente{
    id: number;
    email: string;
    password: string;
    nombre?: string;
    session_token?: string;
    created_at?: Date;
    updated_at?: Date;  
}

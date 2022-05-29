import { QueryResult } from "pg";
import bcrypt = require("bcryptjs");
import jwt = require("jsonwebtoken");

import { pool } from "../common/persistence/postgres.persistence";
import { ApplicationException } from "../common/exceptions/application.exception";
import { ClienteCreateDto } from '../dtos/clientes.dto';


export class ClienteService {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async login(email: string, password: string): Promise<any> {
    // Verificar que el correo que se envio sea correo
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (!emailRegex.test(email)) throw new ApplicationException("El correo no es correcto");

    if(!email || !password) throw new ApplicationException("El email es necesario");
    
    const response: QueryResult = await pool.query(
        "SELECT * FROM clientes WHERE email = $1",
        [email]
      );

    if (!response.rows.length) throw new ApplicationException("No existe un cliente registrado con ese correo!");

    const cliente = response.rows[0];
    
    // Valido Password
    const validPassword = bcrypt.compareSync(password, cliente.password);
    if (!validPassword) throw new ApplicationException("El password no es correcto!");

    // Verfica que hay secret key
    if (!process.env.jwt_secret_key) throw new Error("El secret Key no esta definida");

    const secretKey = process.env.jwt_secret_key;
    
    delete cliente.password;
    delete cliente.token_reset;
    
    // Genera Token
    const token = jwt.sign(
      {
        cliente
      },
      secretKey,
      { expiresIn: "7h", algorithm: "HS256" }
    );

    return {
        cliente,
        token
    };
  }
  

  public async logout(email: string): Promise<void> {
    // Verificar que el correo que se envio sea correo
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (!emailRegex.test(email)) throw new ApplicationException("El correo no es correcto");

    if(!email) throw new ApplicationException("El email es necesario");
    
    const response: QueryResult = await pool.query(
        "SELECT * FROM clientes WHERE email = $1",
        [email]
      );

    if (!response.rows.length) throw new ApplicationException("No existe un cliente registrado con ese correo!");

    const cliente = response.rows[0];

    if (!cliente) throw new ApplicationException("Hubo un error");  
    const now = new Date();

    await pool.query(
      "UPDATE clientes SET session_token = $1, updated_at = $2 WHERE id = $3",
      [ 
          " ", 
          now, 
          cliente.id 
      ]
  ); 

  }
  

  private async validaciones(cadena: string): Promise<void>{
    if(cadena.indexOf("<") > 0) throw new ApplicationException("No se permiten <");
    if(cadena.indexOf(">") > 0) throw new ApplicationException("No se permiten <");
    if(cadena.indexOf("'") > 0) throw new ApplicationException("No se permiten <");
    if(cadena.indexOf('"') > 0) throw new ApplicationException("No se permiten >");
  }


  private async encriptarContraseña(password: string): Promise<string>{
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  } 

  public async store(entry: ClienteCreateDto): Promise<string> {

    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (!emailRegex.test(entry.email)) throw new ApplicationException("El correo no es correcto");

    const existeCliente: QueryResult = await pool.query(
      "SELECT * FROM clientes WHERE email = $1",
      [entry.email]
    );

    if (existeCliente.rows.length) throw new ApplicationException("Cliente con ese email ya existe");
    
    // Validaciones
    if(!entry.password) throw new Error("Hubo un error en el servidor");
    await this.validaciones(entry.password);
    if(entry.password.length < 6) throw new ApplicationException("La contraseña es muy corta");

    if(entry.nombre) await this.validaciones(entry.nombre);

    // Encriptar contraseña
    entry.password = await this.encriptarContraseña(entry.password);

    // Verfica que hay secret key
    if (!process.env.jwt_secret_key) throw new Error("El secret Key no esta definida");

    const secretKey = process.env.jwt_secret_key;

    const { email } = entry

    // Genera Token
    const token = jwt.sign(
      {
        email
      },
      secretKey,
      { expiresIn: "7h", algorithm: "HS256" }
    );

    const now = new Date();

    const res = await pool.query(
         "INSERT INTO clientes(email, password, nombre, session_token, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
         [
            entry.email, 
            entry.password, 
            entry.nombre,
            token,
            now, 
            now
        ]
    );

    const response: QueryResult = await pool.query(
      "SELECT * FROM clientes WHERE id = $1",
      [res.rows[0].id]
    );

    if (!response.rows.length) throw new ApplicationException("Hubo un error");  
    
    return token;
  }

}
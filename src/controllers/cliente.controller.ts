import { Request, Response } from 'express';

import { route, POST, GET } from 'awilix-express';

import { ApplicationException } from '../common/exceptions/application.exception';
import { BaseController } from '../common/controllers/base.controller';

import { ClienteService } from '../services/cliente.service';
import { ClienteCreateDto } from '../dtos/clientes.dto';

@route('/tyba')
export class ClienteController extends BaseController {

    constructor(private readonly clienteService: ClienteService) {
        super();
    }

    @GET()
    public index(req: Request, res: Response): void {
        res.send("HOLA MUNDO 12123");
    }


    @route('/login')
    @POST()
    public async login(req: Request, res: Response): Promise<void> {

        const { email, password } = req.body;

        try {
            if(!req.is('application/json')) throw new ApplicationException("Hubo un error");

            const { token } = await this.clienteService.login(email.toLowerCase(), password);
            
            res.status(200).json({
                ok: true,
                token
            });
            // cliente: result.cliente,            
        } catch(error) {
            this.handleException(error, res);
        }
    }

    @route('/logout')
    @POST()
    public async logout(req: Request, res: Response): Promise<void> {

        const { email } = req.body;

        try {
            if(!req.is('application/json')) throw new ApplicationException("Hubo un error");

            await this.clienteService.logout(email.toLowerCase());
            
            res.status(200).json({
                ok: true 
            });
            // cliente: result.cliente,            
        } catch(error) {
            this.handleException(error, res);
        }
    }

    @route('/register')
    @POST()
    public async register(req: Request, res: Response): Promise<void> {

        try{
            if(!req.is('application/json')) throw new ApplicationException("Hubo un error");
            
            const {
                email, 
                password, 
                nombre
            } = req.body;

            const token = await this.clienteService.store({
                email,
                password,
                nombre
            } as ClienteCreateDto);
            
            res.status(200).json({
                ok: true, 
                token
            });

        } catch(error){
            this.handleException(error, res);
        }
        
    }

}

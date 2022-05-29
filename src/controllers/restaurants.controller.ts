import { Request, Response } from 'express';
import { route, GET } from 'awilix-express';
// import { ApplicationException } from '../common/exceptions/application.exception';
import { BaseController } from '../common/controllers/base.controller';
// import { RestaurantService } from '../services/restaurants.service';

@route('/tyba')
export class RestaurantController extends BaseController{

    // constructor(private readonly restaurantService: RestaurantService) {
    //     super();
    // }

 
    @route('/restaurants')
    @GET()
    public index(req: Request, res: Response): void {
        res.send("RESTAURANTS");
    }

    @route('/transactions')
    @GET()
    public transactions(req: Request, res: Response): void {
        res.send("RESTAURANTS");
    }


    @route('/restaurants/:id')
    @GET()
    public async restaurantById(req: Request, res: Response): Promise<void> {
    // const city_id = parseInt(req.params.id);

        // if(!req.is('application/json')) throw new ApplicationException("Hubo un error");
    try {
        // const apiResponse = await this.restaurantService.getRestauranByCityId(city_id);

        res.status(200).json({
            ok: true,
            // apiResponse
        });
    } catch(error){
        this.handleException(error, res);
    }

        res.send("RESTAURANTS");
    }
}


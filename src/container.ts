import express = require('express');
import { createContainer, asClass } from 'awilix';
import { scopePerRequest } from 'awilix-express';

import { TestService } from './services/test.service';
import { ClienteService } from './services/cliente.service';
import { RestaurantService } from './services/restaurants.service';

export default (app: express.Application): void => {

    const container = createContainer({
        injectionMode: 'CLASSIC'
    });
    
    container.register({
        testService: asClass(TestService).scoped(),
        clienteService: asClass(ClienteService).scoped(),
        restaurantService: asClass(RestaurantService).scoped(),
    });

    app.use(scopePerRequest(container));

};
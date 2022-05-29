// VARIABLES DE ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.APP_ENV = process.env.APP_ENV || 'development';

// Env files
import dotenv = require('dotenv');

process.env.APP_ENV='development';
process.env.NODE_ENV='development';


dotenv.config({
    path: `${__dirname}/../config/${process.env.APP_ENV}.env`
});


console.log("APP_ENV", process.env.APP_ENV);
console.log("NODE_ENV", process.env.NODE_ENV);

// ===================================================================================


import express = require('express');
import cors = require('cors');
// import jwt = require('express-jwt');

import { loadControllers } from 'awilix-express';
import loadContainer from './container';


const app: express.Application = express();

// Settings
app.set('port', process.env.PORT || 3000);

// Configurar CORS
app.use(cors());

// JSON Support
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Container
loadContainer(app);

// if(process.env.jwt_secret_key) {
//     app.use(jwt({ 
//         secret: process.env.jwt_secret_key,
//         algorithms: ['HS256']
//     })
//     .unless({path: 
//         [
//             '/', 
//             '/tyba/login',  
//             '/tyba/register',
//         ]
//     }));
// }

// // Controllers
app.use(loadControllers(
    'controllers/*.ts',
    {cwd: __dirname}
));


export { app }
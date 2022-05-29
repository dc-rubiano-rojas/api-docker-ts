
// import { pool } from "../common/persistence/postgres.persistence";
// import { ApplicationException } from "../common/exceptions/application.exception";

import { RestaurantGetDto } from "../dtos/restaurants";
const needle = require('needle')


export class RestaurantService {

    public async getRestauranByCityId(id: number): Promise<RestaurantGetDto | void> {
        const apiResponse = await needle(
            'get',
            `https://df1f5e23-b062-4e9b-be7b-20396b1953b7.mock.pstmn.io/categories/${id}`
        )
        return apiResponse
    }
}
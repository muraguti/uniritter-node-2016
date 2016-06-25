'use strict';

var Types = require('joi');

module.exports = function (server) {
    const 
        harvesterPlugin = server.plugins['hapi-harvester'],
        schema = {
            type: 'orders',
            attributes: {
                total: Types.number().forbidden(),
                created_on: Types.date().forbidden(),
                updated_on: Types.date().forbidden(),
                status: Types.string().forbidden().valid([ 'new', 'invoiced', 'done', 'cancelled' ]),
                items: Types.array().items(
                    Types.object().keys({
                        product_id: Types.string().guid().required(),
                        quantity: Types.number().integer().required().min(1),
                        price: Types.number().forbidden()
                    }).required().min(1)
                )
            }
        }

    harvesterPlugin.routes.all(schema).forEach(function (route) {
        server.route(route)
    })
}

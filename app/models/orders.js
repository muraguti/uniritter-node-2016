'use strict';

const 
    Types = require('joi'),
    uuid = require('uuid'),
    _ = require('lodash');

module.exports = function (server) {
    const 
        harvesterPlugin = server.plugins['hapi-harvester'],
        schema = {
            type: 'orders',
            attributes: {
                total: Types.number().forbidden(),
                created_on: Types.date().forbidden(),
                updated_on: Types.date().forbidden(),
                status: Types.string().forbidden().valid([ 'new', 'paid', 'done', 'cancelled' ]),
                items: Types.array().items(
                    Types.object().keys({
                        product_id: Types.string().guid().required(),
                        quantity: Types.number().integer().required().min(1),
                        price: Types.number().forbidden()
                    }).required().min(1)
                )
            }
        }

    var post = _.clone(harvesterPlugin.routes['post'](schema));
    //hack: this is chockfull of state. No biggie, since it's a PoC. But please don't do this in prod code.
    post.config.pre = [
        { 
            assign: 'enrichment', 
            method: (request, reply) => {
                var attributes = request.payload.data.attributes;
                request.payload.data._id = uuid.v4();
                attributes.updated_on = attributes.created_on = new Date();
                attributes.status = 'new';
                // to-do: this should be validating the products and getting the price from there...
                _.each(attributes.items, e => {
                    e.price = Math.floor((Math.random() * 10000) + 1) / 100;
                });
                attributes.total = _.reduce(attributes.items, (sum, i) => {
                    return sum + (i.price * i.quantity);
                }, 0.0);
                return reply(request.payload);
            } 
        },
        {
            assign: 'broadcast',
            method: (request, reply) => {
                return reply(1);
                const payload = request.pre.enrichment;
                const data = {
                    type: 'order_events',
                    id: uuid.v4(),
                    attributes: {
                        kind: 'create',
                        key:  payload._id,
                        eventDate: new Date(), 
                        payload: request.payload
                    }
                };
                return eh.createEvent(server, 'order_events', data)
                .then(() => reply(data));
            }
        } 
        ];
    server.route(post);
    
    server.route({
        method: 'POST',
        path:'/orders/{id}/cancel', 
        handler: function (request, reply) {
            var id = encodeURIComponent(request.params.id);
            const data = {
                type: 'order_events', 
                attributes: {
                    kind: 'cancel',
                    key: id,
                    eventDate: new Date(), 
                    payload: request.payload
                }};
            return eh.createEvent(server, 'order_events', data);
        }
    });
    server.route(harvesterPlugin.routes['get'](schema));
    server.route(harvesterPlugin.routes['getById'](schema));    
}

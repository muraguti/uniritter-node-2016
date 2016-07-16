'use strict';

const
    rx = require('rx'),
    EventEmitter = require('events').EventEmitter,
    emitter = new EventEmitter(),
    rxNode = require('rx-node');
    
module.exports.publish = function(event) {
    //const source = rx.Observable.return(event);
    //const emitter = rxNode.toEventEmitter(source, event.eventType);
    //emitter.publish();
    console.log('publishing event', event, 'at', event.attributes.kind);
    emitter.emit(event.attributes.kind, event);
};
    
module.exports.subscribe = function(eventType, callback) {
    console.log('subscribing to', eventType);
    const src = rx.Observable.fromEvent(emitter, eventType);
    const subs = src.subscribe(callback);
};

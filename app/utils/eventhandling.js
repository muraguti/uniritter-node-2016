'use strict';

const
    rx = require('rx'),
    EventEmitter = require('event').EventEmitter,
    rxNode = require('rx-node');
    
module.exports = function() {
    const emitter = new EventEmitter();
    
    this.publish = function(event) {
        //const source = rx.Observable.return(event);
        //const emitter = rxNode.toEventEmitter(source, event.eventType);
        //emitter.publish();
        emitter.emit(event.eventType, event);
    },
    
    this.subscribe = function(eventType) {
        const src = rx.Observable.fromEvent(emitter, eventType);
        const subs = src.subscribe(x => console.log('data:', x));
    }
}

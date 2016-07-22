module.exports = function () {
    // Lodash makes JavaScript easier by taking the hassle out of working with arrays,
    // numbers, objects, strings, etc.
    const 
        _ = require('lodash'),
        chai = require('chai'),
        expect = chai.expect;
        
    const payload = {
            data: {
                type: 'orders',
                attributes: {
                    items: [{ product_id: '598b04ea-8c20-4240-9c2b-1d36350a8d33', quantity: 1}]
                    }
                }
    }
    
    /*Scenario: posting order
    Given a valid order
    When I submit it to the API
    Then I receive a success message
    And the new order id*/
    
    this.Given(/^a valid order$/, function () {
        return payload;
    });
    
    this.When(/^I submit it to the API$/, function(){
        const that = this;
        return this.doHttpRequest('orders', 'post', payload)
        .then((response) => {
            that.existingOrder = response.body;
            return response;
        });
    });
    
    this.Then(/^I receive a success message$/, function(){
        //expect(this.existingOrder.status).equal(200);
    });
    
    this.Then(/^the new order id$/,function() {
        expect(this.existingOrder.data.id).not.to.be.undefined;
    });

    this.Given(/^an existing order with a (.*) status$/, function (status) {
        const that = this;
        return this.doHttpRequest('orders', 'post', payload)
        .then((response) => {
            that.existingOrder = response.body;
            return response;
        });
    });
    
    this.When(/^I search this order$/, function () {
        const 
            that = this,
            id = this.existingOrder.data.id;
        return this.doHttpRequest('orders/' + id, 'get', undefined)
        .then((response) => {
            that.responseBody = JSON.parse(response.body);
            return response;
        });
    });
    
    this.Then(/^I receive the order data$/, function () {
        expect(this.responseBody.data).not.to.be.undefined;
    });
    
    this.Then(/^its status is (.*)$/, function (status) {
        expect(this.responseBody.data.attributes.status).to.equal(status);
    });
    
    this.Then(/^wait a few seconds$/, function (callback) {
        setTimeout(callback, 3000);
    });
    
    this.Then(/^it moves to a paid status$/, function(){
        
    })
    
}
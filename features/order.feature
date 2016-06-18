Feature: Orders Management
    As an API client
    I want to manage my orders

Scenario: create order
  
 Given a valid order
 When I submit it to the API
 Then I receive sucess message
 And the order id
 
Scenario: check status
  Given a existing order
  And with status <s>
  When I check this order
  Then I receive the order info
  And the status is <s>
  
Scenario: validate invalid order
  Given an invalid order where <>
  When I submit the order
  Then I receive an error message notifying that <>
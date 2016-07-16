Feature: products
    As an API client
    I want to manage my products
    
Scenario: posting product
    Given a valid product
    When I submit it to the API
    Then I receive a success message
    And the new product id

Scenario Outline: invalid product
  Given an invalid product that <condition>
  When I submit it to the API
  Then I receive an error response
  And a message saying that <notification>
Examples:
  |         condition                   |   notification                |
  | is missing the name                 | item.name is mandatory    |
  | has a negative price                | product price must be a equal or greater than zero     |
  
      
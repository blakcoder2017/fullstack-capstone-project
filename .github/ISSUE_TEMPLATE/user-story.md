---
name: User Story
about: This template defines a user story
title: ''
labels: ''
assignees: ''

---

**As a** registered user  
**I need** to upload gifts and allow other users to request them  
**So that** I can give away items I no longer need and others can claim them securely

### Details and Assumptions
    * Only authenticated users can upload or request gifts  
    * Gift uploads include title, description, category, and images  
    * Requests notify the gift owner for approval  
    * Unauthenticated users cannot upload or request gifts and are redirected to login

### Acceptance Criteria
    gherkin
    Given I am an authenticated user on the gift upload page  
    When I submit valid gift details  
    Then the gift appears in the listings for others to see

    Given I am an authenticated user browsing gift listings  
    When I request a gift  
    Then my request is saved and the owner is notified

    Given I am not authenticated  
    When I try to upload or request a gift  
    Then I am redirected to the login page

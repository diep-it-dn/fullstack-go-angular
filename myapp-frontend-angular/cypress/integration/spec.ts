describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('Home')
    cy.contains('Login')
  })

  /* ==== Test Created with Cypress Studio ==== */
  it('Login with initial user that has full permission', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:4201');
    cy.get('.myapp-nav > .ng-star-inserted > .mat-button-wrapper > .mat-icon').click();
    cy.get('#mat-input-1').clear();
    cy.get('#mat-input-1').type('diep.it.dn@gmail.com'); // Change for your init user email
    cy.get('#mat-input-2').clear();
    cy.get('#mat-input-2').type('ChangeMe'); // Change for your init user password
    cy.get('.buttons > .mat-focus-indicator > .mat-button-wrapper').click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eql('/')
    });
    cy.get('.myapp-nav > a.ng-star-inserted').contains("settings").click();
    cy.get('.mat-drawer-inner-container > .mat-nav-list > [ng-reflect-router-link="/settings/permission-groups"] > .mat-list-item-content > span').click();
    cy.get('.mat-drawer-inner-container > .mat-nav-list > [ng-reflect-router-link="/settings/users"] > .mat-list-item-content > span').click();
    cy.get('.mat-drawer-inner-container > .mat-nav-list > [ng-reflect-router-link="/settings/contents"] > .mat-list-item-content > span').click();
    cy.get('.mat-drawer-inner-container > .mat-nav-list > [ng-reflect-router-link="/settings/posts"] > .mat-list-item-content > span').click();
    cy.get('[mattooltip="About"] > .mat-button-wrapper > .mat-icon').click();
    cy.get('#mat-tab-label-1-1').click();
    cy.get('.mat-menu-trigger').click();
    cy.get('.cdk-focused').click();
    cy.get('[routerlink="/auth/change-password"] > .mat-list-item-content > span').click();
    cy.get('.mat-button-wrapper > span.ng-star-inserted').click();
    cy.get('[ng-reflect-router-link="auth/logout"] > span').click();
    /* ==== End Cypress Studio ==== */
  });
})

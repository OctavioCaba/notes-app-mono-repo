describe('Note App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');

    cy.request('POST', 'http://localhost:3001/api/testing/reset');

    const user = {
      name: 'Octavio',
      username: 'DonLeopardo',
      password: 'admin'
    };

    cy.request('POST', 'http://localhost:3001/api/users', user);
  });

  it('frontpage can be opened', () => {
    cy.contains('Notes');
  });

  it('user can login', () => {
    cy.contains('Show Login').click();
    cy.get('[placeholder="Username"]').type('DonLeopardo');
    cy.get('[placeholder="Password"]').type('admin');
    cy.get('#form-login-button').click();
    cy.contains('New Note');
  });

  it('login fails with wrong password', () => {
      cy.contains('Show Login').click();
      cy.get('[placeholder="Username"]').type('DonLeopardo');
      cy.get('[placeholder="Password"]').type('cucuy');
      cy.get('#form-login-button').click();
      
      //cy.get('.error').contains('wrong credentials');

      cy.get('.error').should('contain', 'wrong credentials');
  });

  describe('when logged in', () => {
    beforeEach(() => {
      // MALA PRÁCTICA PORQUE ESTAMOS HACIENDO LO MISMO QUE EN EL TEST 'user can login'
      /* cy.contains('Show Login').click();
      cy.get('[placeholder="Username"]').type('DonLeopardo');
      cy.get('[placeholder="Password"]').type('admin');
      cy.get('#form-login-button').click();
      cy.contains('New Note'); */

      cy.login({ username: 'DonLeopardo', password: 'admin' });
    });

    it('a new note can be created', () => {
      const noteContent = 'a note created by cypress';
      cy.contains('New Note').click();
      cy.get('input').type(noteContent);
      cy.contains('save').click();
      cy.contains(noteContent);
    });

    describe('and a note exists', () => {
      beforeEach(() => {
        cy.createNote({ content: 'A first note created from cypress', important: false });

        cy.createNote({ content: 'A second note created from cypress', important: false });

        cy.createNote({ content: 'A third note created from cypress', important: false });
      });

      it('it can be made important', () => {
        cy.contains('A second note created from cypress').as('theNote');

        cy.get('@theNote')
        .contains('make important')
        .click();

        cy.get('@theNote')
        .contains('make not important')
      });
    });
  });
});

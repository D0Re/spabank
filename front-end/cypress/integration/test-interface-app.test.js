/// <reference types='cypress'>
describe('SPA-banking', () => {
  const url = 'http://localhost:8080/';

  beforeEach(() => {
    // reset and seed the database prior to every test
    cy.viewport(1360, 660)
    cy.visit(url)
    cy.get('#login').type('developer')
    cy.get('#password').type('skillbox')
    cy.contains('Войти').click()
  })

  it('Проверяем возможность авторизации в системе', () => {
    cy.get('.accounts__title')
      .should('be.visible')
  })

  it(`Отображается список счетов`, () => {
    cy.get('.container')
      .then((el) => {
        cy.wait(4000)
        cy.get('.accounts__list').children().should('be.visible')
      })
  })

  it(`Возможность посмотреть информацию о счете`, () => {
    cy.contains('Открыть').click()

    cy.get('.acc__title')
      .should('be.visible')
  })

  it(`Возможность совершить перевод на другой счет`, () => {
    cy.contains('Открыть').click()

    cy.get('.acc__title')
      .should('be.visible')

    cy.wait(2000)

    cy.get('.from-transfer__container-top > .form-transfer__input').type('61253747452820828268825011');
    cy.get('.from-transfer__container-bottom > .form-transfer__input').type('1000');
    cy.get('.from-transfer > .btn').click();
    cy.contains('Перевод успешно выполнен')
  })

  it(`Возможность посмотреть список и курсы валют`, () => {
    cy.contains('Валюта').click()

    cy.get('.currency__title')
      .should('be.visible')

    cy.wait(2000)

    cy.get('.currency-account__list')
      .should('be.visible')
  })

  it(`Возможность совершить обмен валюты`, () => {
    cy.contains('Валюта').click()

    cy.get('.currency__title')
      .should('be.visible')

    cy.wait(2000)

    cy.get('.currency-account__list')
      .should('be.visible')

    cy.get('.currency-trade__value').type('10')
    cy.get('.currency-trade__form > .btn').click()
    cy.contains('Перевод успешно выполнен')
  })
})

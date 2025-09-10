describe('Конструктор бургера — E2E', () => {
  const API_URL = Cypress.env('BURGER_API_URL');

  const trimSlash = (s: string) => s.replace(/\/+$/, '');
  const BASE = trimSlash(API_URL);

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    const cors204 = {
      statusCode: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET,POST,OPTIONS',
        'access-control-allow-headers': '*'
      },
      body: ''
    };
    cy.intercept('OPTIONS', '**/ingredients*', cors204).as(
      'preflightIngredients'
    );
    cy.intercept('OPTIONS', '**/auth/*', cors204).as('preflightAuth');
    cy.intercept('OPTIONS', '**/orders*', cors204).as('preflightOrders');

    cy.fixture('ingredients').then((ING) => {
      cy.intercept('GET', '**/ingredients*', { body: ING }).as(
        'getIngredients'
      );
    });
    cy.fixture('user').then((USER) => {
      cy.intercept('GET', '**/auth/user*', { body: USER }).as('getUser');
    });
    cy.fixture('order').then((ORDER) => {
      cy.intercept('POST', '**/orders*', { body: ORDER }).as('createOrder');
    });

    cy.visit('/', {
      timeout: 60000,
      onBeforeLoad(win) {
        try {
          win.localStorage.setItem('refreshToken', 'fake-refresh-token');
        } catch {}
        win.document.cookie = 'accessToken=Bearer fake-access-token';
      }
    });

    cy.wait('@getIngredients', { timeout: 30000 });

    cy.get('a[href*="/ingredients/"]', { timeout: 30000 })
      .its('length')
      .should('be.gt', 0);

    cy.get('a[href*="/ingredients/"]').first().scrollIntoView();
  });

  const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  it('Добавляет ингредиенты из списка в конструктор', () => {
    let bunName = '';
    cy.contains('h2', 'Булки')
      .parent()
      .within(() => {
        cy.get('a[href*="/ingredients/"]')
          .first()
          .find('[class*="text_type_main-default"]')
          .first()
          .invoke('text')
          .then((t) => (bunName = t.trim()));
      });

    cy.contains('h2', 'Булки')
      .parent()
      .within(() => {
        cy.contains('button', 'Добавить')
          .first()
          .scrollIntoView()
          .click({ force: true });
      });

    cy.contains('button', 'Оформить заказ')
      .closest('section')
      .within(() => {
        if (bunName) cy.contains(new RegExp(escapeRe(bunName))).should('exist');
      });

    let mainName = '';
    cy.contains('h2', 'Начинки')
      .parent()
      .within(() => {
        cy.get('a[href*="/ingredients/"]')
          .first()
          .find('[class*="text_type_main-default"]')
          .first()
          .invoke('text')
          .then((t) => (mainName = t.trim()));

        cy.contains('button', 'Добавить')
          .first()
          .scrollIntoView()
          .click({ force: true });
      });

    cy.contains('button', 'Оформить заказ')
      .closest('section')
      .within(() => {
        if (mainName)
          cy.contains(new RegExp(escapeRe(mainName))).should('exist');
        else cy.get('li').should('exist');
      });
  });

  it('Открывает и закрывает модальное окно ингредиента и показывает корректные данные', () => {
    let mainName = '';
    cy.contains('h2', 'Начинки')
      .parent()
      .within(() => {
        cy.get('a[href*="/ingredients/"]')
          .first()
          .as('firstMain')
          .find('[class*="text_type_main-default"]')
          .first()
          .invoke('text')
          .then((t) => (mainName = t.trim()));
      });

    cy.get('@firstMain').click();
    cy.location('pathname').should('include', '/ingredients/');

    cy.contains('h3', 'Детали ингредиента', { timeout: 10000 }).should('exist');
    if (mainName) cy.contains(new RegExp(escapeRe(mainName))).should('exist');
    cy.contains('Калории, ккал').should('exist');
    cy.contains('Белки, г').should('exist');
    cy.contains('Жиры, г').should('exist');
    cy.contains('Углеводы, г').should('exist');

    cy.contains('h3', 'Детали ингредиента')
      .parent()
      .find('button')
      .first()
      .click();
    cy.location('pathname').should('eq', '/');
    cy.contains('h3', 'Детали ингредиента').should('not.exist');
  });

  it('Оформляет заказ и очищает конструктор', () => {
    cy.contains('h2', 'Булки')
      .parent()
      .within(() => {
        cy.contains('button', 'Добавить')
          .first()
          .scrollIntoView()
          .click({ force: true });
      });

    cy.contains('h2', 'Начинки')
      .parent()
      .within(() => {
        cy.contains('button', 'Добавить')
          .first()
          .scrollIntoView()
          .click({ force: true });
      });

    cy.setCookie('accessToken', 'Bearer fake-access-token');
    cy.window().then((win) => {
      try {
        win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      } catch {}
    });

    cy.contains('button', 'Оформить заказ').click();

    cy.fixture('order').then(({ order }) => {
      const orderNum = String(order?.number ?? '');
      const matcher = new RegExp(`\\b${orderNum}\\b`);

      cy.get('body', { timeout: 15000 }).should(($body) => {
        const $found = $body
          .find('*')
          .filter((_, n) => matcher.test((n.textContent || '').trim()));
        expect(
          $found.length,
          'order number appears in modal'
        ).to.be.greaterThan(0);
      });

      cy.get('body').type('{esc}');
      cy.get('body').click(5, 5, { force: true });
      cy.get('body').then(($body) => {
        const $btn = $body
          .find('div[class*="modal"], [role="dialog"]')
          .find('button');
        if ($btn.length) {
          cy.wrap($btn.first()).click({ force: true });
        }
      });

      cy.get('body').should(($body) => {
        const $found = $body
          .find('*')
          .filter((_, n) => matcher.test((n.textContent || '').trim()));
        expect($found.length, 'order number disappeared after close').to.eq(0);
      });
    });
  });
});

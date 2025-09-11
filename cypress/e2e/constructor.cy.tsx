Cypress.on('uncaught:exception', () => {
  return false;
});

describe('Конструктор бургера — E2E', () => {
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
    cy.intercept('OPTIONS', '**/ingredients**', cors204);
    cy.intercept('OPTIONS', '**/auth/**', cors204);
    cy.intercept('OPTIONS', '**/orders**', cors204);

    cy.fixture('ingredients').then((ING) => {
      cy.intercept('GET', '**/ingredients**', { body: ING }).as(
        'getIngredients'
      );
    });
    cy.fixture('user').then((USER) => {
      cy.intercept('GET', '**/auth/user**', { body: USER }).as('getUser');
    });
    cy.fixture('order').then((ORDER) => {
      cy.intercept('POST', '**/orders**', { body: ORDER }).as('createOrder');
    });

    cy.fixture('orders').then((ORDERS) => {
      cy.intercept('GET', '**/orders/all**', { body: ORDERS }).as('getOrders');
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
    cy.wait('@getUser', { timeout: 30000 });

    cy.get('a[href*="/ingredients/"]', { timeout: 30000 })
      .its('length')
      .should('be.gt', 0);

    cy.get('a[href*="/ingredients/"]').first().scrollIntoView();
  });

  afterEach(() => {
    cy.clearCookies();
    cy.window().then((win) => {
      try {
        win.localStorage.removeItem('refreshToken');
      } catch {}
    });
    cy.clearLocalStorage();
  });

  const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  it('сервис должен быть доступен по адресу localhost:4000', () => {});

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

  it('Открывает выбранный ингредиент и показывает корректные данные', () => {
    cy.fixture('ingredients').then(({ data }) => {
      const item = data.find((x: any) => x.type === 'main') || data[0];
      const name: string = item.name;

      cy.contains('a[href*="/ingredients/"]', name, { timeout: 10000 }).click();
      cy.location('pathname').should('include', '/ingredients/');

      cy.contains('h3.text_type_main-medium', name, { timeout: 10000 })
        .should('exist')
        .parent()
        .within(() => {
          cy.contains('Калории, ккал').should('exist');
          cy.contains('Белки, г').should('exist');
          cy.contains('Жиры, г').should('exist');
          cy.contains('Углеводы, г').should('exist');
        });
    });
  });

  it('Открывает выбранный ингредиент в модальном окне и показывает корректные данные', () => {
    cy.fixture('ingredients').then(({ data }) => {
      const item = data.find((x: any) => x.type === 'main') || data[0];
      const name: string = item.name;

      cy.contains('a[href*="/ingredients/"]', name, { timeout: 10000 }).click();
      cy.location('pathname').should('include', '/ingredients/');

      cy.get('#modals', { timeout: 10000 })
        .should('exist')
        .within(() => {
          cy.contains('h3.text_type_main-medium', name).should('exist');
          cy.contains('Калории, ккал').should('exist');
          cy.contains('Белки, г').should('exist');
          cy.contains('Жиры, г').should('exist');
          cy.contains('Углеводы, г').should('exist');
        });

      cy.get('#modals').then(($m) => {
        const $btn = $m.find('button');
        if ($btn.length) {
          cy.wrap($btn.first()).click({ force: true });
        }
      });

      cy.get('body').type('{esc}');

      cy.get('#modals').click('topLeft', { force: true });

      cy.get('#modals').find('h3.text_type_main-medium').should('not.exist');
    });
  });

  it('Оформляет заказ, проверяет номер в модалке и очищает конструктор', () => {
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
    cy.wait('@createOrder', { timeout: 30000 });

    cy.fixture('order').then(({ order }) => {
      const orderNum = String(order?.number ?? '');

      cy.get('#modals', { timeout: 15000 })
        .find('h2.text_type_digits-large')
        .should('exist')
        .invoke('text')
        .then((t) => {
          expect(t.trim()).to.eq(orderNum);
        });
    });

    cy.get('body').type('{esc}');

    cy.get('#modals').then(($m) => {
      const $title = $m.find('h2.text_type_digits-large');
      if ($title.length) {
        const $btn = $m.find('button');
        if ($btn.length) {
          cy.wrap($btn.first()).click({ force: true });
        }
      }
    });

    cy.get('#modals').find('h2.text_type_digits-large').should('not.exist');

    cy.contains('button', 'Оформить заказ')
      .closest('section')
      .within(() => {
        cy.get('ul').find('li').should('have.length', 0);
        cy.contains('Выберите булки').should('exist');
        cy.contains('Выберите начинку').should('exist');
      });
  });
});

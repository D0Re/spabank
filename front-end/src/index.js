import { el, mount, setChildren } from "redom";
import Navigo from 'navigo';

import {
  createElementFormLogin,
  createElementAccountsPage,
  createElementATMsPage,
  createElementCurrencyPage,
  createElementAccPage,
  createGraph,
  createElementAccPageHistoryTranc,
  createModalErrorRoot,
  openModalError,
} from './modules/view-app.js';

import {
  loginApp,
  getAccounts,
  createAccount,
  getAtmBanks,
  getCurrencyAccount,
  getAllCurrency,
  getExchangeWebSocket,
  getInformCard,
  postTransaction,
  postCurrencyExchange,
} from './modules/api-app.js';

import {
  validationFormLogin
} from './modules/validation.js'

/*Подключаем стили*/
import './style/normalize.css';
import './style/style.css';

/*Подключаем изображения и прочее файлы*/
import logo from './assets/images/logo.png';


/*Глобальные переменные*/
let main = null;
let arrayAccounts;
let token = localStorage.getItem('token');
let id = localStorage.getItem('idAcc');
let objTranc;


createElement();
createModalErrorRoot();
const router = new Navigo('/', { hash: true });


router

  .on('/', async () => {
    localStorage.removeItem('token');
    createElement();
    setChildren(main, createElementFormLogin());
    login();
    validationFormLogin();
  })
  .on('/account', async () => {
    const create = createElementAccountsPage(arrayAccounts);
    getAccounts(token)
      .then(res => {
        arrayAccounts = res
        create.createElListAcc(arrayAccounts);
        addAccountControlBtn();
        routerApp();
        sortAccounts(arrayAccounts)
      })
      .catch(err => {
        openModalError(err);
      })
    createElementHeader(true);

  })
  .on('/atms', () => {
    createElementHeader(true);
    getAtmBanks(token)
      .then(res => {
        createElementATMsPage(res);
        routerApp();
      })
      .catch(err => {
        openModalError(err);
      })
  })
  .on('/currency', () => {
    createElementHeader(true);
    routerApp();
    let arrayCurrencyAccount = null;
    let arrayCurrency = null;
    createElementCurrencyPage();
    Promise.all([getCurrencyAccount(token), getAllCurrency(token)]).then(value => {
      arrayCurrencyAccount = value[0];
      arrayCurrency = value[1];
      getExchangeWebSocket()
      createElementCurrencyPage(arrayCurrencyAccount, arrayCurrency, true);
      postCurrencyExchange(token);
    })
      .catch(err => {
        openModalError('Ошибка загрузки, сервер недоступен, попробуйте повторить попытку позже.');
      });
  })
  .on("/card/:id", () => {
   
    createElementHeader(true);
    createElementAccPage();

    getInformCard(id, token)
      .then((res) => {
        let arrayMonth = [];
        objTranc = res.resultTransaction;

        for (let key in objTranc) {
          const date = new Date();
          let year = date.getFullYear();
          let month = date.getMonth();

          if (((month + 1) - 6) < 0) {
            year -= 1
            month = 12 + ((month + 1) - 6)
          } else {
            month -= (month + 1) - 6;
          }
          let twoDate = String(year) + String(month);

          if (twoDate <= key) {
            objTranc[key].name = key;
            objTranc[key].balance = key;
            arrayMonth.push(objTranc[key]);
          }
        };

        createElementAccPage(res.result, true);
        createGraph('dinamicCard', arrayMonth, 6);
        postTransaction(id, token);
        routerApp();

        document.querySelector('.acc__btn-back').addEventListener('click', () => {
          router.navigate('/account');
        });

        document.querySelector('.acc__container-dinamic-balance').addEventListener('click', () => {
          router.navigate(`/card-history-transaction/${id}`);
        });

        document.querySelector('.container-bottom').addEventListener('click', () => {
          router.navigate(`/card-history-transaction/${id}`);
        });
      })
      .catch(err => {
        openModalError(err);
      });
  })
  .on(`/card-history-transaction/:id`, () => {
    
    createElementHeader(true);
    createElementAccPageHistoryTranc();
  
    getInformCard(id, token)
      .then(res => {
        let arrayMonth = [];
        objTranc = res.resultTransaction;

        for (let key in objTranc) {
          const date = new Date();
          let year = date.getFullYear();
          let month = date.getMonth();

          let twoDate = String(year - 1) + '0' + String(month + 2);

          if (twoDate <= key) {
            objTranc[key].name = key;
            objTranc[key].balance = key;
            arrayMonth.push(objTranc[key]);
          }
        };

        createElementAccPageHistoryTranc(res.result, true);
        createGraph('graph-dinamic-balance', arrayMonth, 12);
        createGraph('graph-dinamic-transaction', arrayMonth, 12, true);
        routerApp();

        document.querySelector('.acc__btn-back').addEventListener('click', () => {
          router.navigate(`/card/${id}`);
        });
      })

  })

router.resolve()


function createElement() {
  const container = el('div', {
    class: 'container',
  });
  main = el('main', {
    class: 'main'
  });
  const header = createElementHeader()
  setChildren(main, container);
  setChildren(document.body, [header, main]);
}

function createElementHeader(login = null) {
  const header = el('header', {
    class: 'header',
  })
  const logoImg = el('img', {
    class: 'logo',
    src: logo,
  });

  if (login) {
    const menu = el('menu', {
      class: 'menu'
    }, el('ul', {
      class: 'menu__list'
    },
      [el('li', {
        class: 'menu__item'
      }, el('a', 'Банкоматы', {
        class: 'menu__link',
        href: '/atms',
        data: 'data-navigo',
      })),
      el('li', {
        class: 'menu__item'
      }, el('a', 'Счета', {
        class: 'menu__link',
        href: '/account',
        data: 'data-navigo',
      })),

      el('li', {
        class: 'menu__item'
      }, el('a', 'Валюта', {
        class: 'menu__link',
        href: '/currency',
        data: 'data-navigo',
      })),

      el('li', {
        class: 'menu__item'
      }, el('a', 'Выйти', {
        class: 'menu__link',
        href: '/',
        data: 'data-navigo',
      }))
      ])
    );

    setChildren(document.querySelector('.header'), [logoImg, menu])
    return header;
  }
  setChildren(header, logoImg)

  return header;
}

function login() {
  const form = document.querySelector('.form-entry');
  const btnLogin = document.querySelector('.form-entry__btn');

  btnLogin.addEventListener('click', async () => {
    token = await loginApp();

    if (token) {
      arrayAccounts = await getAccounts(token);
      router.navigate('/account');
    }
  })

  form.addEventListener('submit', i => {
    i.preventDefault();
  });
}

function routerApp() {
  document.querySelectorAll('.menu__link').forEach(el => {
    el.addEventListener('click', i => {
      i.preventDefault()
      router.navigate(i.target.getAttribute('href'));
    });
  });

  document.querySelectorAll('.account').forEach(el => {
    el.querySelector('.account__btn').addEventListener('click', () => {
      
      id = el.querySelector('.account__id').textContent;
      localStorage.setItem('idAcc', el.querySelector('.account__id').textContent);
      
      router.navigate(`/card/${id}`);
    })
  });
}

function addAccountControlBtn() {
  document.querySelector('.accounts__btn-add').addEventListener('click', async () => {
    await createAccount(token)

    const create = createElementAccountsPage(arrayAccounts);
    getAccounts(token)
      .then(res => {
        arrayAccounts = res
        create.createElListAcc(arrayAccounts);
        addAccountControlBtn();
        routerApp();
        sortAccounts(arrayAccounts)
      })
    createElementHeader(true);
  })
}

function sortAccounts(array) {
  let arrayRes = [];

  document.querySelector('.select').addEventListener('click', (e) => {
    arrayRes = [];

    if (e.target.textContent === 'По номеру') {
      array.payload.sort((a, b) => {
        if (Number(a.account) < Number(b.account)) {
          return 1
        } else if (Number(a.account) > Number(b.account)) {
          return -1
        } else {
          return 0
        }
      })

      createEl(array.payload)
    };

    if (e.target.textContent === 'По балансу') {
      array.payload.sort((a, b) => {
        if (Number(a.balance) < Number(b.balance)) {
          return 1
        } else if (Number(a.balance) > Number(b.balance)) {
          return -1
        } else {
          return 0
        }
      })

      createEl(array.payload)
    };

    if (e.target.textContent === 'По последней транзакции') {
      array.payload.forEach(el => {
        if (el.transactions.length === 0) {
          arrayRes.push(el)
        } else {
          if (arrayRes.length === 0) {
            arrayRes.push(el)
            return
          }
          if (arrayRes[0].transactions.length === 0) {
            arrayRes.unshift(el);
          } else if (el.transactions[0].date > arrayRes[0].transactions[0].date) {
            arrayRes.unshift(el);
          } else {
            arrayRes.splice(1, 0, el);
          }
        }
      })

      createEl(arrayRes)
    };
  });

  function createEl(array) {
    const arrayEl = [];

    array.forEach(item => {

      let date = null;
      const arrayMonth = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

      if (item.transactions[0]) {
        date = new Date(item.transactions[0].date);
        date = date.getDate() + ' ' + arrayMonth[date.getMonth()] + ' ' + date.getFullYear();
      } else {
        date = '';
      }

      const elAccounts = el('li', {
        class: 'accounts__list-item'
      }, el('div', {
        class: 'account'
      }, el('span', item.account, {
        class: 'account__id'
      }), el('span', item.balance.toFixed(2) + ` ₽`, {
        class: 'account__balance'
      }), el('div', {
        class: 'account__transaction-container'
      }, el('span', 'Последняя транзакция: ', {
        class: 'account__transaction-text'
      }), el('span', date, {
        class: 'account__transaction-date'
      })), el('button', 'Открыть', {
        class: 'account__btn btn'
      })));

      arrayEl.push(elAccounts)
    });

    setChildren(document.querySelector('.accounts__list'), arrayEl)
    routerApp()
  }
}

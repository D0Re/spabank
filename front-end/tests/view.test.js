import { strict } from 'assert';
import {
  createElementFormLogin,
  createElementAccountsPage,
  createElementCurrencyPage,
  createElementAccPage,
} from '../src/modules/view-app.js';

test('Проверяем корректность создания формы авторизации', () => {
  document.body.append(createElementFormLogin())

  const form = document.querySelectorAll('input');
  const btn = document.querySelector('.form-entry__btn');

  expect(form[0].placeholder).toBe('Введите логин');
  expect(form[1].placeholder).toBe('Введите пароль');
  expect(btn.textContent).toBe('Войти');
});

test('Проверяем корректность отрисовки страницы счетов', () => {
  const modelObj = {
    "payload": [
        {
            "account": "74213041477477406320783754",
            "balance": 4196743.46,
            "mine": true,
            "transactions": [
                {
                    "amount": 64.56,
                    "date": "2022-05-09T09:41:13.892Z",
                    "from": "72273266568403431664712771",
                    "to": "74213041477477406320783754"
                }
            ]
        },
        {
            "account": "20504682386273361464023588",
            "mine": true,
            "balance": 1000000,
            "transactions": [
                {
                    "date": "2022-04-23T13:36:31.453Z",
                    "from": "74213041477477406320783754",
                    "to": "20504682386273361464023588",
                    "amount": 1000000
                }
            ]
        },
        {
            "account": "04816144517481830764486406",
            "mine": true,
            "balance": 100000,
            "transactions": [
                {
                    "date": "2022-04-23T14:01:39.012Z",
                    "from": "74213041477477406320783754",
                    "to": "04816144517481830764486406",
                    "amount": 100000
                }
            ]
        },
        {
            "account": "37582380400543320754263504",
            "mine": true,
            "balance": 0,
            "transactions": []
        },
        {
            "account": "22544118521658064724144421",
            "mine": true,
            "balance": 26058,
            "transactions": [
                {
                    "date": "2022-05-06T10:54:24.274Z",
                    "from": "74213041477477406320783754",
                    "to": "22544118521658064724144421",
                    "amount": 23432
                }
            ]
        },
        {
            "account": "16654668423205150202405623",
            "mine": true,
            "balance": 0,
            "transactions": []
        },
        {
            "account": "15738753415383086854410064",
            "mine": true,
            "balance": 0,
            "transactions": []
        },
        {
            "account": "76340134601236534444278347",
            "mine": true,
            "balance": 0,
            "transactions": []
        },
        {
            "account": "52430874263824365314377343",
            "mine": true,
            "balance": 0,
            "transactions": []
        }
    ],
    "error": ""
  }

  document.body.append(document.createElement('main'));
  const create = createElementAccountsPage();
  create.createElListAcc(modelObj);

  let page = document.querySelector('.container');
  page = JSON.stringify(page.innerHTML)

  let result = `<div class=" accounts__container-account"><h1 class="accounts__title">Ваши Счета</h1><div class="select-account"><div class=" select" id="select-account"><span class=" select__value">Сортировка</span><select class=" select__none">Сортировка</select><ul class=" select__list"><li class=" select__item">По номеру</li><li class=" select__item">По балансу</li><li class=" select__item">По последней транзакции</li></ul></div></div><button class=" accounts__btn-add btn"><div class=" accounts__btn-add_plus"></div><span class=" accounts__btn-add_text">Создать новый счёт</span></button></div><div class=" accounts__container-accounts"><ul class=" accounts__list"><li class=" accounts__list-item"><div class=" account"><span class=" account__id">74213041477477406320783754</span><span class=" account__balance">4196743.46 ₽</span><div class=" account__transaction-container"><span class=" account__transaction-text">Последняя транзакция: </span><span class=" account__transaction-date">9 мая 2022</span></div><button class=" account__btn btn">Открыть</button></div></li><li class=" accounts__list-item"><div class=" account"><span class=" account__id">20504682386273361464023588</span><span class=" account__balance">1000000.00 ₽</span><div class=" account__transaction-container"><span class=" account__transaction-text">Последняя транзакция: </span><span class=" account__transaction-date">23 апреля 2022</span></div><button class=" account__btn btn">Открыть</button></div></li><li class=" accounts__list-item"><div class=" account"><span class=" account__id">04816144517481830764486406</span><span class=" account__balance">100000.00 ₽</span><div class=" account__transaction-container"><span class=" account__transaction-text">Последняя транзакция: </span><span class=" account__transaction-date">23 апреля 2022</span></div><button class=" account__btn btn">Открыть</button></div></li><li class=" accounts__list-item"><div class=" account"><span class=" account__id">37582380400543320754263504</span><span class=" account__balance">0.00 ₽</span><div class=" account__transaction-container"><span class=" account__transaction-text">Последняя транзакция: </span><span class=" account__transaction-date"></span></div><button class=" account__btn btn">Открыть</button></div></li><li class=" accounts__list-item"><div class=" account"><span class=" account__id">22544118521658064724144421</span><span class=" account__balance">26058.00 ₽</span><div class=" account__transaction-container"><span class=" account__transaction-text">Последняя транзакция: </span><span class=" account__transaction-date">6 мая 2022</span></div><button class=" account__btn btn">Открыть</button></div></li><li class=" accounts__list-item"><div class=" account"><span class=" account__id">16654668423205150202405623</span><span class=" account__balance">0.00 ₽</span><div class=" account__transaction-container"><span class=" account__transaction-text">Последняя транзакция: </span><span class=" account__transaction-date"></span></div><button class=" account__btn btn">Открыть</button></div></li><li class=" accounts__list-item"><div class=" account"><span class=" account__id">15738753415383086854410064</span><span class=" account__balance">0.00 ₽</span><div class=" account__transaction-container"><span class=" account__transaction-text">Последняя транзакция: </span><span class=" account__transaction-date"></span></div><button class=" account__btn btn">Открыть</button></div></li><li class=" accounts__list-item"><div class=" account"><span class=" account__id">76340134601236534444278347</span><span class=" account__balance">0.00 ₽</span><div class=" account__transaction-container"><span class=" account__transaction-text">Последняя транзакция: </span><span class=" account__transaction-date"></span></div><button class=" account__btn btn">Открыть</button></div></li><li class=" accounts__list-item"><div class=" account"><span class=" account__id">52430874263824365314377343</span><span class=" account__balance">0.00 ₽</span><div class=" account__transaction-container"><span class=" account__transaction-text">Последняя транзакция: </span><span class=" account__transaction-date"></span></div><button class=" account__btn btn">Открыть</button></div></li></ul></div>`
  result = JSON.stringify(result)

  expect(page).toBe(result)
});

test('Проверяем корректность отрисовки страницы конкретного счета', () => {
  const modelObj = {
    account: "74213041477477406320783754",
    balance: 4338024.02,
    mine: true,
    transactions: [
      {date: '2020-09-21T10:19:41.656Z', from: '03075161147576483308375751', to: '74213041477477406320783754', amount: 5299.09},
      {date: '2020-09-20T18:19:22.773Z', from: '74213041477477406320783754', to: '35110031722044432128716373', amount: 9964.92},
      {date: '2020-09-22T18:41:23.579Z', from: '55644304736377674327410786', to: '74213041477477406320783754', amount: 5903.28},
      {date: '2020-09-23T01:57:20.223Z', from: '74213041477477406320783754', to: '20676535650685341466086362', amount: 8973.71},
      {date: '2020-09-20T14:49:11.604Z', from: '77427804067068854505643187', to: '74213041477477406320783754', amount: 3264.49},
      {date: '2020-09-21T10:56:09.488Z', from: '66256481715188133566342525', to: '74213041477477406320783754', amount: 4278.35},
      {date: '2020-10-20T11:53:53.056Z', from: '32738473258717602001415062', to: '74213041477477406320783754', amount: 9544.46},
      {date: '2020-10-20T16:20:49.799Z', from: '74213041477477406320783754', to: '51086782655845204744803707', amount: 736.58},
      {date: '2020-10-19T22:41:24.671Z', from: '74213041477477406320783754', to: '58260448852541766126032272', amount: 9035.65},
      {date: '2020-10-21T00:28:54.267Z', from: '74213041477477406320783754', to: '73003546888202608186565604', amount: 2617.47},
      {date: '2020-10-21T19:20:08.481Z', from: '74213041477477406320783754', to: '68460044008755080226662884', amount: 9319.44},
      {date: '2020-10-20T20:01:16.064Z', from: '74847150332830381217324183', to: '74213041477477406320783754', amount: 2725.91},
      {date: '2020-11-19T18:23:13.510Z', from: '74213041477477406320783754', to: '48578624073520776558718428', amount: 6804.39},
      {date: '2020-11-21T09:56:23.656Z', from: '06063054426041078483263725', to: '74213041477477406320783754', amount: 3858.05},
      {date: '2020-11-20T08:29:43.744Z', from: '74213041477477406320783754', to: '11058318061637564385871201', amount: 9120.37},
      {date: '2020-11-19T14:06:16.751Z', from: '74213041477477406320783754', to: '60228030523138312144615768', amount: 8302.53},
      {date: '2020-11-21T01:14:37.517Z', from: '74213041477477406320783754', to: '14372116167504433887463240', amount: 9346.56},
      {date: '2020-11-20T18:11:18.243Z', from: '61608263725254633754234122', to: '74213041477477406320783754', amount: 1901.06},
      {date: '2020-12-20T07:13:22.725Z', from: '74213041477477406320783754', to: '76120185182651822023247304', amount: 8551.27},
      {date: '2020-12-20T17:06:11.034Z', from: '63674007301648561653138300', to: '74213041477477406320783754', amount: 33.75},
      {date: '2020-12-21T08:45:19.575Z', from: '47380770851287858765522752', to: '74213041477477406320783754', amount: 479.76}
    ]
  };

  document.body.append(document.createElement('main'));
  createElementAccPage(modelObj, true);

  let page = document.querySelector('.container');
  page = JSON.stringify(page.innerHTML)

  let result = `<div class=" container-top"><div class=" acc__container-top-left"><h1 class=" acc__title">Просмотр счёта</h1><span class=" acc__number">№ 74213041477477406320783754</span></div><div class=" acc__container-top-right"><button class=" btn acc__btn-back">Вернуться назад</button><div class=" container-balance"><span class=" acc__balance-text">Баланс</span><span class=" acc__balance-value">4338024.02</span></div></div></div><div class=" container-middle"><div class=" acc__container-transfer"><h2 class=" acc__title-cont">Новый перевод</h2><form class=" from-transfer"><div class=" from-transfer__container-top"><label class=" form-transfer__input-text">Номер счёта получателя</label><input class=" form-transfer__input form-transfer__input-num" placeholder="Введите номер"></div><div class=" from-transfer__container-bottom"><label class=" form-transfer__input-text">Сумма перевода</label><input class=" form-transfer__input form-transfer__input-value" placeholder="Введите сумму"></div><button class=" btn from-transfer__btn" disabled="">Отправить</button></form><div class=" container-list-num" style="display: none;"><ul class=" list-num-tranc" id="list-num-tranc"></ul></div><div class=" form-transfer-errors"></div></div><div class=" acc__container-dinamic-balance"><h2 class=" acc__title-cont">Динамика баланса</h2><canvas id="dinamicCard" class=" graph-card"></canvas></div></div><div class=" container-bottom"><div class=" acc__container-history-transaction"><h2 class=" acc__title-cont">История переводов</h2><table class=" table-transaction"><tbody class=" table-transaction__body"><tr class=" table-transaction__heading"><td class=" table-transaction__heading-title">Счёт отправителя</td><td class=" table-transaction__heading-title">Счёт получателя</td><td class=" table-transaction__heading-title">Сумма</td><td class=" table-transaction__heading-title">Дата</td></tr><tr class=" table-transaction__str"><td class=" table-transaction__item">47380770851287858765522752</td><td class=" table-transaction__item">74213041477477406320783754</td><td class=" table-transaction__item table-transaction__item_green">+ 479.76 ₽</td><td class=" table-transaction__item">21.12.2020</td></tr><tr class=" table-transaction__str"><td class=" table-transaction__item">63674007301648561653138300</td><td class=" table-transaction__item">74213041477477406320783754</td><td class=" table-transaction__item table-transaction__item_green">+ 33.75 ₽</td><td class=" table-transaction__item">20.12.2020</td></tr><tr class=" table-transaction__str"><td class=" table-transaction__item">74213041477477406320783754</td><td class=" table-transaction__item">76120185182651822023247304</td><td class=" table-transaction__item table-transaction__item_red">- 8551.27 ₽</td><td class=" table-transaction__item">20.12.2020</td></tr><tr class=" table-transaction__str"><td class=" table-transaction__item">61608263725254633754234122</td><td class=" table-transaction__item">74213041477477406320783754</td><td class=" table-transaction__item table-transaction__item_green">+ 1901.06 ₽</td><td class=" table-transaction__item">20.11.2020</td></tr><tr class=" table-transaction__str"><td class=" table-transaction__item">74213041477477406320783754</td><td class=" table-transaction__item">14372116167504433887463240</td><td class=" table-transaction__item table-transaction__item_red">- 9346.56 ₽</td><td class=" table-transaction__item">21.11.2020</td></tr><tr class=" table-transaction__str"><td class=" table-transaction__item">74213041477477406320783754</td><td class=" table-transaction__item">60228030523138312144615768</td><td class=" table-transaction__item table-transaction__item_red">- 8302.53 ₽</td><td class=" table-transaction__item">19.11.2020</td></tr><tr class=" table-transaction__str"><td class=" table-transaction__item">74213041477477406320783754</td><td class=" table-transaction__item">11058318061637564385871201</td><td class=" table-transaction__item table-transaction__item_red">- 9120.37 ₽</td><td class=" table-transaction__item">20.11.2020</td></tr><tr class=" table-transaction__str"><td class=" table-transaction__item">06063054426041078483263725</td><td class=" table-transaction__item">74213041477477406320783754</td><td class=" table-transaction__item table-transaction__item_green">+ 3858.05 ₽</td><td class=" table-transaction__item">21.11.2020</td></tr><tr class=" table-transaction__str"><td class=" table-transaction__item">74213041477477406320783754</td><td class=" table-transaction__item">48578624073520776558718428</td><td class=" table-transaction__item table-transaction__item_red">- 6804.39 ₽</td><td class=" table-transaction__item">19.11.2020</td></tr><tr class=" table-transaction__str"><td class=" table-transaction__item">74847150332830381217324183</td><td class=" table-transaction__item">74213041477477406320783754</td><td class=" table-transaction__item table-transaction__item_green">+ 2725.91 ₽</td><td class=" table-transaction__item">20.10.2020</td></tr><tr class=" table-transaction__str"><td class=" table-transaction__item">74213041477477406320783754</td><td class=" table-transaction__item">68460044008755080226662884</td><td class=" table-transaction__item table-transaction__item_red">- 9319.44 ₽</td><td class=" table-transaction__item">21.10.2020</td></tr></tbody></table></div></div>`
  result = JSON.stringify(result)

  expect(page).toBe(result)
});

test('Проверяем корректность отрисовки страницы "Валюты", без области измения курса в реальном времени', () => {
  const modelArrayCurrencyAccount = [
    {
        "amount": 22.16,
        "code": "AUD"
    },
    {
        "amount": 253776.33999999997,
        "code": "BTC"
    },
    {
        "amount": 48.75,
        "code": "BYR"
    },
    {
        "amount": 45.22,
        "code": "CAD"
    },
    {
        "amount": 67.29,
        "code": "CHF"
    },
    {
        "amount": 10.47,
        "code": "CNH"
    },
    {
        "amount": 43236167.93225757,
        "code": "ETH"
    },
    {
        "amount": 27.85,
        "code": "EUR"
    },
    {
        "amount": 5.72,
        "code": "GBP"
    },
    {
        "amount": 78.48,
        "code": "HKD"
    },
    {
        "amount": 1114524,
        "code": "JPY"
    },
    {
        "amount": 97.06581580855689,
        "code": "NZD"
    },
    {
        "amount": 635907.8142857142,
        "code": "RUB"
    },
    {
        "amount": 81862.19,
        "code": "UAH"
    },
    {
        "amount": 6123.996504234829,
        "code": "USD"
    }
  ];

  const modelArrayCurrency = [
    "ETH",
    "BTC",
    "USD",
    "EUR",
    "JPY",
    "GBP",
    "AUD",
    "CAD",
    "CHF",
    "CNH",
    "HKD",
    "NZD",
    "RUB",
    "UAH",
    "BYR"
  ];

  document.body.append(document.createElement('main'));
  createElementCurrencyPage(modelArrayCurrencyAccount, modelArrayCurrency, true);

  let page = document.querySelector('.container');
  page = JSON.stringify(page.innerHTML)

  let result = `<h1 class="currency__title">Валютный обмен</h1><div class=" container-currency"><div class=" currency__container-left"><div class=" currency-account currency__container-left-child"><h2 class=" currency__dist-title">Ваши валюты</h2><ul class=" currency-account__list"><li class=" currency-account__item"><span class=" currency-account__currency-name">AUD</span><span class=" currency-account__currency-space"></span><span class=" currency-account__currency-value">22.16</span></li><li class=" currency-account__item"><span class=" currency-account__currency-name">BTC</span><span class=" currency-account__currency-space"></span><span class=" currency-account__currency-value">253776.34</span></li><li class=" currency-account__item"><span class=" currency-account__currency-name">BYR</span><span class=" currency-account__currency-space"></span><span class=" currency-account__currency-value">48.75</span></li><li class=" currency-account__item"><span class=" currency-account__currency-name">CAD</span><span class=" currency-account__currency-space"></span><span class=" currency-account__currency-value">45.22</span></li><li class=" currency-account__item"><span class=" currency-account__currency-name">CHF</span><span class=" currency-account__currency-space"></span><span class=" currency-account__currency-value">67.29</span></li><li class=" currency-account__item"><span class=" currency-account__currency-name">CNH</span><span class=" currency-account__currency-space"></span><span class=" currency-account__currency-value">10.47</span></li><li class=" currency-account__item"><span class=" currency-account__currency-name">ETH</span><span class=" currency-account__currency-space"></span><span class=" currency-account__currency-value">43236167.93</span></li><li class=" currency-account__item"><span class=" currency-account__currency-name">EUR</span><span class=" currency-account__currency-space"></span><span class=" currency-account__currency-value">27.85</span></li><li class=" currency-account__item"><span class=" currency-account__currency-name">GBP</span><span class=" currency-account__currency-space"></span><span class=" currency-account__currency-value">5.72</span></li><li class=" currency-account__item"><span class=" currency-account__currency-name">HKD</span><span class=" currency-account__currency-space"></span><span class=" currency-account__currency-value">78.48</span></li><li class=" currency-account__item"><span class=" currency-account__currency-name">JPY</span><span class=" currency-account__currency-space"></span><span class=" currency-account__currency-value">1114524.00</span></li><li class=" currency-account__item"><span class=" currency-account__currency-name">NZD</span><span class=" currency-account__currency-space"></span><span class=" currency-account__currency-value">97.07</span></li><li class=" currency-account__item"><span class=" currency-account__currency-name">RUB</span><span class=" currency-account__currency-space"></span><span class=" currency-account__currency-value">635907.81</span></li><li class=" currency-account__item"><span class=" currency-account__currency-name">UAH</span><span class=" currency-account__currency-space"></span><span class=" currency-account__currency-value">81862.19</span></li><li class=" currency-account__item"><span class=" currency-account__currency-name">USD</span><span class=" currency-account__currency-space"></span><span class=" currency-account__currency-value">6124.00</span></li></ul></div><div class=" currency-trade currency__container-left-child"><h2 class=" currency__dist-title">Обмен валюты</h2><form class=" currency-trade__form"><div class=" currency-trade__container-input"><div class=" currency-trade__container-currency"><span class=" currency-trade__text">Из</span><div class=" select" id="select-formTrade-out"><span class=" select__value">BTC</span><select class=" select__none">BTC</select><ul class=" select__list"><li class=" select__item">ETH</li><li class=" select__item">BTC</li><li class=" select__item">USD</li><li class=" select__item">EUR</li><li class=" select__item">JPY</li><li class=" select__item">GBP</li><li class=" select__item">AUD</li><li class=" select__item">CAD</li><li class=" select__item">CHF</li><li class=" select__item">CNH</li><li class=" select__item">HKD</li><li class=" select__item">NZD</li><li class=" select__item">RUB</li><li class=" select__item">UAH</li><li class=" select__item">BYR</li></ul></div><span class=" currency-trade__text">в</span><div class=" select" id="select-formTrade-in"><span class=" select__value">ETH</span><select class=" select__none">ETH</select><ul class=" select__list"><li class=" select__item">ETH</li><li class=" select__item">BTC</li><li class=" select__item">USD</li><li class=" select__item">EUR</li><li class=" select__item">JPY</li><li class=" select__item">GBP</li><li class=" select__item">AUD</li><li class=" select__item">CAD</li><li class=" select__item">CHF</li><li class=" select__item">CNH</li><li class=" select__item">HKD</li><li class=" select__item">NZD</li><li class=" select__item">RUB</li><li class=" select__item">UAH</li><li class=" select__item">BYR</li></ul></div></div><div class=" currency-trade__container-value"><span class=" currency-trade__text">Сумма</span><input class=" currency-trade__value"></div></div><button class=" btn currency-trade__btn" disabled="">Обменять</button></form><div class=" currency-trade-error"></div></div></div><div class=" currency__container-right"><h2 class=" currency__dist-title">Изменение курсов в реальном времени</h2><div class=" container-list"></div></div></div>`
  result = JSON.stringify(result)

  expect(page).toBe(result)
});

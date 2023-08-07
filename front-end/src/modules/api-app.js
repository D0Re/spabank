import {
  createElementExchangeOnline,
  createElListCurrency,
  openModalError,
} from './view-app.js';

import {
  validateFormTransaction,
  validationFormCyrrency,
} from './validation.js';

import {el, setChildren} from 'redom';

export async function loginApp() {
  try {
    const login = document.querySelector('#login');
    const password = document.querySelector('#password');
    let result = null;

    result = await fetch('http://localhost:3000/login', {
      method: 'POST',
      body: JSON.stringify({
        login: login.value,
        password: password.value,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    });

    result = await result.json();

    login.value = '';
    password.value = '';

    if (result.payload) {
      localStorage.setItem('token', result.payload.token)

      return result.payload.token;
    };

    if (result.error) {
      if (result.error === 'No such user') {
        document.querySelector('.login-error').textContent = 'Пользователя с таким логином не существует';
      } else {
        document.querySelector('.login-error').textContent = 'Введен неверный пароль';
      };

    };
  } catch (err) {
    openModalError('Ошибка загрузки, сервер недоступен, попробуйте повторить попытку позже.');
  }
}

export async function getAccounts(token) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await fetch('http://localhost:3000/accounts', {
        headers: {
          Authorization: `Basic ${token}`
        }
      });

      result = await result.json();

      resolve(result)
    } catch (err) {
      console.log(err)
      reject('Ошибка загрузки, сервер недоступен, попробуйте повторить попытку позже.');
    };

  });
};

export async function createAccount(token) {
  try {
    let result = await fetch('http://localhost:3000/create-account', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`
      }
    });
    result = await result.json();
    return result;
  } catch (err) {
    openModalError('Ошибка загрузки, сервер недоступен, попробуйте повторить попытку позже.');
  }
}

export async function getAtmBanks(token) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await fetch('http://localhost:3000/banks', {
        headers: {
          Authorization: `Basic ${token}`
        }
      });
      result = await result.json();
      resolve(result.payload);
    } catch {
      reject('Ошибка загрузки, сервер недоступен, попробуйте повторить попытку позже.');
    }

  });
}

export async function getCurrencyAccount(token) {
  try {
    let result = await fetch('http://localhost:3000/currencies', {
      headers: {
        Authorization: `Basic ${token}`
      }
    });

    result = await result.json();
    let resultArray = [];

    for (let key in result.payload) {
      resultArray.push(result.payload[key])
    }

    return resultArray;
  } catch (err) {
    openModalError('Ошибка загрузки, сервер недоступен, попробуйте повторить попытку позже.');
  }

}

export async function getAllCurrency(token) {
  try {
      let result = await fetch('http://localhost:3000/all-currencies', {
      headers: {
        Authorization: `Basic ${token}`
      }
    });
    result = await result.json();
    return result.payload;
  } catch (err) {
    openModalError('Ошибка загрузки, сервер недоступен, попробуйте повторить попытку позже.');
  }
}

export async function getExchangeWebSocket() {
  try {
    let soccet = new WebSocket('ws://localhost:3000/currency-feed')
    let arrayCurrency = [];
    soccet.onopen = function(e) {

    }

    soccet.onmessage = async function(el) {
      let message = JSON.parse(el.data);
      if (window.location.pathname != '/currency') {
        soccet.close()
        return
      }

      if(arrayCurrency.length < 20) {
        arrayCurrency.push({
          name: message.from + '/' + message.to,
          rate: message.rate,
          change: message.change
        })
      } else {
        arrayCurrency.push({
          name: message.from + '/' + message.to,
          rate: message.rate,
          change: message.change
        });
        arrayCurrency.shift();
      }
      createElementExchangeOnline(arrayCurrency)
    }

    return soccet;
  } catch (err) {
    openModalError('Ошибка загрузки, сервер недоступен, попробуйте повторить попытку позже.');
  }
}

export async function getInformCard(id, token) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await fetch(`http://localhost:3000/account/${id}`, {
        headers: {
          Authorization: `Basic ${token}`
        }
      });
      result = await result.json();

      const resultTransaction = await processingArrayTransaction(result.payload.transactions, id)
      result = result.payload
      resolve({result, resultTransaction})
    } catch (err) {
      reject('Ошибка загрузки, сервер недоступен, попробуйте повторить попытку позже.');
    }
  })

}

export function postTransaction(id, token) {
  try {
    const form = document.querySelector('.from-transfer');
  validateFormTransaction(id)
  let listNumTranc = [];

  if(localStorage.getItem('numTranc')) {
    listNumTranc = JSON.parse(localStorage.getItem('numTranc'));
  }

  form.addEventListener('submit', (i) => {
    
    const num = form.querySelector('.form-transfer__input-num');
    const value = form.querySelector('.form-transfer__input-value');

    fetch('http://localhost:3000/transfer-funds', {
      method: 'POST',

      body: JSON.stringify({
        from: id,
	      to: num.value,
        amount: value.value,
      }),

      headers: {
        'Content-type': 'application/json',
        Authorization: `Basic ${token}`,
      },
    })
      .then(el => el.json())
      .then(res => {
        if (res.payload) {

          if(!listNumTranc.includes(num.value)) {
            listNumTranc.push(num.value);
            localStorage.setItem('numTranc', JSON.stringify(listNumTranc));
          }

          num.value = '';
          value.value = '';
          form.querySelector('.btn').disabled = true;
          if (!document.querySelector('.form-transfer-errors').classList.contains('not-error')) {
            document.querySelector('.form-transfer-errors').append('Перевод успешно выполнен');
          }
          document.querySelector('.form-transfer-errors').classList.add('not-error');
          setTimeout(() => {
            document.querySelector('.form-transfer-errors').textContent = '';
            document.querySelector('.form-transfer-errors').classList.remove('not-error');
          }, 5000);

          let listNum = [];

          if(localStorage.getItem('numTranc')) {
            const list = JSON.parse(localStorage.getItem('numTranc'));

            list.forEach( i => {
              const elem = el('li', i, {
                class: 'list-num-tranc__item',
              });
              listNum.push(elem);
            });
          }
          setChildren(document.querySelector('.list-num-tranc'), listNum);
        } else {
          let error = null;

          if(res.error === 'Invalid amount') {
            error = 'Hе указана сумма перевода, или она отрицательная';
          } else if(res.error === 'Invalid account to') {
            error = 'Не указан счёт зачисления, или этого счёта не существует';
          } else {
            error = 'Вы попытались перевести больше денег, чем доступно на счёте списания';
          }

          document.querySelector('.form-transfer-errors').textContent = '';
          document.querySelector('.form-transfer-errors').append(error);
          document.querySelector('.form-transfer-errors').classList.add('error');

          setTimeout(() => {
            document.querySelector('.form-transfer-errors').textContent = '';
            document.querySelector('.form-transfer-errors').classList.remove('error');
          }, 5000);
        }
        console.log(res)
      });
  });
  } catch (err) {
    openModalError('Ошибка загрузки, сервер недоступен, попробуйте повторить попытку позже.');
  }
}

export function postCurrencyExchange(token) {
  try {
    const form =  document.querySelector('.currency-trade__form');
  validationFormCyrrency()

  form.addEventListener('submit', (i) => {
    i.preventDefault();

    const from = form.querySelector('#select-formTrade-out').querySelector('.select__none');
    const to = form.querySelector('#select-formTrade-in').querySelector('.select__none');
    const value = form.querySelector('.currency-trade__value');

    fetch('http://localhost:3000/currency-buy', {
      method: 'POST',

      body: JSON.stringify({
        from: from.textContent,
        to: to.textContent,
        amount: value.value,
      }),

      headers: {
        'Content-type': 'application/json',
        Authorization: `Basic ${token}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        if (res.payload) {
          value.value = '';
          createElListCurrency(res.payload, 'obj');
          if (!document.querySelector('.currency-trade-error').classList.contains('not-error')) {
            document.querySelector('.currency-trade-error').append('Перевод успешно выполнен');
          }
          document.querySelector('.currency-trade-error').classList.add('not-error');
          document.querySelector('.currency-trade__btn').disabled = true;
          setTimeout(() => {
            document.querySelector('.currency-trade-error').textContent = '';
            document.querySelector('.currency-trade-error').classList.remove('not-error');
          }, 5000);
        } else {
          let error = null;

          if(res.error === 'Overdraft prevented') {
            error = 'Попытка перевести больше, чем доступно на счёте'
          }

          document.querySelector('.currency-trade-error').textContent = error;
          document.querySelector('.currency-trade-error').classList.add('error');

          setTimeout(() => {
            document.querySelector('.currency-trade-error').textContent = '';
            document.querySelector('.currency-trade-error').classList.remove('error');
          }, 5000);
        }

      });
  })
  } catch (err) {
    openModalError('Ошибка загрузки, сервер недоступен, попробуйте повторить попытку позже.');
  }

}

async function processingArrayTransaction(array, id) {
  let resultArray = {};

  array.forEach( el => {
    const date = new Date(el.date);

    const year = date.getFullYear();
    const month = date.getMonth();
    let key = null;

    if((month + 1) <= 9) {
      key = String(year) + '0' + String(month + 1);
    } else {
      key = String(year) + String(month + 1);
    }

    const amount = el.amount;
    let fromCash = 0;
    let toCash = 0;

    let route = null;
    if(id === el.from) {
      fromCash = amount;
      route = -1;
    } else {
      route = 1;
      toCash = amount;
    };

    if(!resultArray[key]) {
      resultArray[key] = {
        fromCash: fromCash,
        toCash: toCash,
        profit: toCash - fromCash,
      }
    } else {
      resultArray[key].fromCash += fromCash;
      resultArray[key].toCash += toCash;
      const profit = toCash - fromCash;
      resultArray[key].profit += profit;
    }
  });

  return resultArray;
}

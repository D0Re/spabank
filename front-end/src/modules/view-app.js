import {el, setChildren } from 'redom';
import Chart from 'chart.js/auto';

export function createElementFormLogin() {
  const containerForm = el('div', {
    class: 'container-form'
  });

  const blockForm = el('div', {
    class: 'block-form'
  });

  const title = el('h1', 'Вход в аккаунт', {
    class: 'title-form'
  });

  const form = el('form', {
    class: 'form-entry'
  });

  const login = el('div', {
    class: 'form-entry__login'
  }, el('span', 'Логин', {
    class: 'form-entry__text'
  }), el('input', {
    class: 'form-entry__input',
    id: 'login',
    placeholder: 'Введите логин'
  }));

  const password = el('div', {
    class: 'form-entry__login'
  }, el('span', 'Пароль', {
    class: 'form-entry__text'
  }), el('input', {
    class: 'form-entry__input',
    id: 'password',
    placeholder: 'Введите пароль'
  }));

  const btn = el('button', 'Войти', {
    class: 'form-entry__btn btn',
    disabled: true,
  });

  const error = el('div', {
    class: 'login-error'
  });

  setChildren(form, [login, password, error, btn]);
  setChildren(blockForm, [title, form]);
  setChildren(containerForm, blockForm);

  return containerForm
}

export function createElementAccountsPage(arrayAccounts) {
  const skelet = skeletonAccountsPage();

  skelet.title.textContent = 'Ваши Счета';
  skelet.title.classList.remove('accounts__title-skeleton');

  skelet.select.classList.remove('select-account_skeleton');
  setChildren(skelet.select, createCustomSelect('Сортировка', ['По номеру', 'По балансу', 'По последней транзакции'], 'select-account'));

  skelet.btnAddAccount.remove();
  const btnAddAccount = el('button', {
    class: 'accounts__btn-add btn'
  }, el('div', {
    class: 'accounts__btn-add_plus'
  }), el('span', 'Создать новый счёт', {
    class: 'accounts__btn-add_text'
  }));

  skelet.containerTop.append(btnAddAccount);

  function createElListAcc(arrayAccounts) {
    let arrayAccountsHelp = [];

    arrayAccounts.payload.forEach( item => {
      
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

      arrayAccountsHelp.push(elAccounts)
    });

    setChildren(skelet.listAccounts, arrayAccountsHelp)
  }

  return {
    createElListAcc
  }
}

export function createElementATMsPage(arrayAtms) {
  const skelet = skeletonATMsPage();

  skelet.title.textContent = 'Карта банкоматов';
  skelet.title.classList.remove('atms__title_skeleton');

  const scriptInit = el('script', {
    type: 'text/javascript',
    defer: true
  });

  document.head.prepend(scriptInit);

  let data = `
  // Функция ymaps.ready() будет вызвана, когда
  // загрузятся все компоненты API, а также когда будет готово DOM-дерево.
  ymaps.ready(init);
  function init(){
      // Создание карты.
      var myMap = new ymaps.Map("map", {
          // Координаты центра карты.
          // Порядок по умолчанию: «широта, долгота».
          // Чтобы не определять координаты центра карты вручную,
          // воспользуйтесь инструментом Определение координат.
          center: [55.76, 37.64],
          // Уровень масштабирования. Допустимые значения:
          // от 0 (весь мир) до 19.
          zoom: 11,
      });
      myMap.behaviors
    // Отключаем некоторые включенные по умолчанию поведения:
    // - drag - перемещение карты при нажатой левой кнопки мыши;
    // - rightMouseButtonMagnifier - увеличение области, выделенной
    // правой кнопкой мыши.
    .disable(['scrollZoom']);
  `;

  arrayAtms.forEach( (el, index) => {
    const objPoint = `
    var myPlacemark${index} = new ymaps.Placemark([${el.lat}, ${el.lon}]);
    myMap.geoObjects.add(myPlacemark${index});
  `;

  data = data + objPoint;
  });

  scriptInit.innerHTML = data + `;
  }`;

  // setTimeout(() => {
  //   skelet.map.classList.remove('atms__map_skeleton');
  // }, 3000)

}

export function createElementCurrencyPage(currencyAccount = null, arrayCurrency = null, status = false) {
  const skelet = skeletonCurrencyPage();

  skelet.title.textContent = 'Валютный обмен';
  skelet.title.classList.remove('currency__title_skeleton')

  if(!status) {

    setChildren(skelet.elFormTradeCurrency, el('h2', 'Обмен валюты', {
      class: 'currency__dist-title'
    }), el('div', {
      class: 'currency-trade-error'
    }));
  } else {
    setChildren(skelet.containerRight, el('h2', 'Изменение курсов в реальном времени', {
      class: 'currency__dist-title'
    }), el('div', {
      class: 'container-list'
    }));

    setChildren(skelet.elCurrencyAccount, el('h2', 'Ваши валюты', {
      class: 'currency__dist-title'
    }), el('ul', {
      class: 'currency-account__list'
    }));
    createElListCurrency(currencyAccount);

    const formTrade = el('form', {
      class: 'currency-trade__form'
    }, el('div', {
      class: 'currency-trade__container-input'
    }, el('div', {
      class: 'currency-trade__container-currency'
    }, el('span', 'Из', {
      class: 'currency-trade__text'
    }), createCustomSelect('BTC', arrayCurrency, 'select-formTrade-out'), el('span', 'в', {
      class: 'currency-trade__text'
    }), createCustomSelect('ETH', arrayCurrency, 'select-formTrade-in')), el('div', {
      class: 'currency-trade__container-value'
    }, el('span', 'Сумма', {
      class: 'currency-trade__text'
    }), el('input', {
      class: 'currency-trade__value'
    }))), el('button', 'Обменять', {
      class: 'btn currency-trade__btn',
      disabled: true,
    }));

    setChildren(skelet.elFormTradeCurrency, el('h2', 'Обмен валюты', {
      class: 'currency__dist-title'
    }), formTrade, el('div', {
      class: 'currency-trade-error'
    }));
  }
}

export function createElListCurrency(array, type = false) {
  let resultArray = [];
  if (type === 'obj') {
    for(let i in array) {
      resultArray.push(array[i])
    }
  } else {
    resultArray = array
  }
  
  document.querySelector('.currency-account__list').innerHTML = '';
  resultArray.forEach( i => {
    const itemList = el('li', {
      class: 'currency-account__item'
    }, el('span', i.code, {
      class: 'currency-account__currency-name'
    }), el('span', {
      class: 'currency-account__currency-space'
    }), el('span', i.amount.toFixed(2), {
      class: 'currency-account__currency-value'
    }));

    document.querySelector('.currency-account__list').append(itemList);
  })
}

export function createElementAccPage(account = null, status = false) {
  const skelet = skeletonAccPage()

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
  

  const elListNum = el('div', {
    class: 'container-list-num',
  }, el('ul', {
    class: 'list-num-tranc',
    id: 'list-num-tranc'
  }, listNum));

  setChildren(skelet.contAndFormTransfer, el('h2', 'Новый перевод', {
    class: 'acc__title-cont'
  }), el('form', {
    class: 'from-transfer'
  }, el('div', {
    class: 'from-transfer__container-top'
  }, el('label' , 'Номер счёта получателя', {
    class: 'form-transfer__input-text'
  }), el('input', {
    class: 'form-transfer__input form-transfer__input-num',
    placeholder: 'Введите номер',
  })), el('div', {
    class: 'from-transfer__container-bottom'
  }, el('label' , 'Сумма перевода', {
    class: 'form-transfer__input-text'
  }), el('input', {
    class: 'form-transfer__input form-transfer__input-value',
    placeholder: 'Введите сумму',
  })), el('button', 'Отправить', {
    class: 'btn from-transfer__btn',
    disabled: true,
  })), elListNum, el('div', {
    class: 'form-transfer-errors'
  }));

  if (status) {
    const arrayElTable = createElTableTransaction(account, 11);

    setChildren(skelet.contTitleAndNumber, el('h1', 'Просмотр счёта', {
      class: 'acc__title'
    }), el('span', `№ ${account.account}`, {
      class: 'acc__number'
    }));

    setChildren(skelet.contBtnAndBalance, el('button', 'Вернуться назад', {
    class: 'btn acc__btn-back'
    }), el('div', {
      class: 'container-balance'
    }, el('span', 'Баланс', {
      class: 'acc__balance-text'
    }), el('span', account.balance, {
      class: 'acc__balance-value'
    })));

    setChildren(skelet.contDinamicBalance, el('h2', 'Динамика баланса', {
      class: 'acc__title-cont'
    }), el('canvas', {
      id: 'dinamicCard',
      class: 'graph-card',
    }));

    setChildren(skelet.contHistoryTransaction, el('h2', 'История переводов', {
      class: 'acc__title-cont'
    }), el('table', {
      class: 'table-transaction'
    }, el('tbody', {
      class: 'table-transaction__body'
    },el('tr', {
      class: 'table-transaction__heading'
    }, el('td', 'Счёт отправителя', {
      class: 'table-transaction__heading-title'
    }),el('td', 'Счёт получателя', {
      class: 'table-transaction__heading-title'
    }),el('td', 'Сумма', {
      class: 'table-transaction__heading-title'
    }),el('td', 'Дата', {
      class: 'table-transaction__heading-title'
    })), arrayElTable)));
  } else {
    setChildren(skelet.contTitleAndNumber, el('h1', 'Просмотр счёта', {
      class: 'acc__title'
    }), el('div', {
      class: 'acc__number acc__number_skeleton'
    }));

    setChildren(skelet.contBtnAndBalance, el('button', 'Вернуться назад', {
      class: 'btn acc__btn-back'
    }), el('div', {
      class: 'container-balance'
    }, el('span', 'Баланс', {
      class: 'acc__balance-text'
    }), el('div', {
      class: 'acc__balance-value acc__balance-value_skeleton'
    })));
  }
  
  if(!JSON.parse(localStorage.getItem('numTranc'))) {
    elListNum.style.display = 'none';
  }

  document.querySelector('.form-transfer__input-num').addEventListener('focus', () => {
    elListNum.classList.add('list-active');
  });

  document.querySelector('.form-transfer__input-num').addEventListener('blur', (e) => {
    setTimeout(() => {
      elListNum.classList.remove('list-active');
    }, 100);
  });

  document.querySelector('.list-num-tranc').addEventListener('click', i => {
    const num = document.querySelector('.form-transfer__input-num');
    const value = document.querySelector('.form-transfer__input-value');
    const btn = document.querySelector('.from-transfer__btn');
    if(i.target.classList.value === ' list-num-tranc__item') {
      num.value = i.target.textContent;

      if(num.value && value.value) {
        btn.disabled = false;
      } else {
        btn.disabled = true;
      }
    }
  })
}

export function createElementAccPageHistoryTranc(account = null, status = false) {
  
  if(!status) {
    createElementAccPage()
    const skelet = skeletonAccPageHistoryTranc();
    setChildren(skelet.graphDinamicBalance, el('h2', 'Динамика баланса', {
      class: 'acc__title-cont'
    }), el('div', {
      class: 'graph-dinamic-balance graph-dinamic-balance_skeleton',
    }));

    setChildren(skelet.graphDinamicTransaction, el('h2', 'Соотношение входящих исходящих транзакций', {
      class: 'acc__title-cont'
    }), el('div', {
      class: 'graph-dinamic-balance graph-dinamic-balance_skeleton',
    }));
  } else {
    createElementAccPage(account, true);
    const skelet = skeletonAccPageHistoryTranc();
    const arrayElTable = createElTableTransaction(account, 26, 0);

    const countListElTable = Math.floor(account.transactions.length / 25);
    let i = 1;
    let r = 10;

    function numBtn(i, r) {
      let arrayBtnControl = [];

      for(i; i <= (countListElTable - 1); i++) {
        let x = el('button', i, {
          class: 'table-control-btn btn-table'
        });

        if(i === r) {
          x = el('button', '>', {
            class: 'table-control-btn-onward btn-table'
          });
          arrayBtnControl.push(x);
          break
        }

        x.addEventListener('click', () => {
          let num = x.textContent * 25;

          const arrayElTable = createElTableTransaction(account, 26, num);

          let table = document.querySelector('.table-transaction');

          const elTable = el('tbody', {
            class: 'table-transaction__body'
          },el('tr', {
            class: 'table-transaction__heading'
          }, el('td', 'Счёт отправителя', {
            class: 'table-transaction__heading-title'
          }),el('td', 'Счёт получателя', {
            class: 'table-transaction__heading-title'
          }),el('td', 'Сумма', {
            class: 'table-transaction__heading-title'
          }),el('td', 'Дата', {
            class: 'table-transaction__heading-title'
          })), arrayElTable);

          setChildren(table, elTable);
        })

        arrayBtnControl.push(x);
      }

      return arrayBtnControl;
    }

    const arrayBtnControl = numBtn(1, 10);

    setChildren(skelet.graphDinamicBalance, el('h2', 'Динамика баланса', {
      class: 'acc__title-cont'
    }), el('canvas', {
      class: 'graph-dinamic-balance',
      id: 'graph-dinamic-balance',
      role: 'img',
    }));

    setChildren(skelet.graphDinamicTransaction, el('h2', 'Соотношение входящих исходящих транзакций', {
      class: 'acc__title-cont'
    }), el('canvas', {
      class: 'graph-dinamic-transaction',
      id: 'graph-dinamic-transaction',
    }));

    setChildren(skelet.contHistoryTransaction, el('h2', 'История переводов', {
      class: 'acc__title-cont'
    }), el('table', {
      class: 'table-transaction table-transaction-history'
    }, el('tbody', {
      class: 'table-transaction__body'
    },el('tr', {
      class: 'table-transaction__heading'
    }, el('td', 'Счёт отправителя', {
      class: 'table-transaction__heading-title'
    }),el('td', 'Счёт получателя', {
      class: 'table-transaction__heading-title'
    }),el('td', 'Сумма', {
      class: 'table-transaction__heading-title'
    }),el('td', 'Дата', {
      class: 'table-transaction__heading-title'
    })), arrayElTable)), el('div', {
      class: 'acc__container-control'
    }, arrayBtnControl));

    if (document.querySelector('.table-control-btn-onward')) {
      document.querySelector('.table-control-btn-onward').addEventListener('click', () => {
        const contBtn = document.querySelector('.acc__container-control')
        document.querySelectorAll('.table-control-btn').forEach((elem, index) => {
          if(Number(elem.textContent) === countListElTable && index === 0) {
            return
          }

          if((Number(elem.textContent) + 10) <= (countListElTable - 1)) {
            if (elem.textContent < 10) {
              elem.textContent = Number(elem.textContent) + 9;
            } else {
              elem.textContent = Number(elem.textContent) + 9;
            }

          } else {
            elem.textContent = ''
            document.querySelector('.table-control-btn-onward').style.display = 'none';
          }

          if(elem.textContent != 1 && index === 0 && !document.querySelector('.table-control-btn-back')) {
            const btn = el('button', '<', {
              class: 'table-control-btn-back btn-table'
            });
            contBtn.prepend(btn);

            btn.addEventListener('click', () => {
              let valueFirstEl = null;
              let count = 9;
              document.querySelectorAll('.table-control-btn').forEach((elem, index) => {
                if (index === 0) {
                  valueFirstEl = elem.textContent
                }
                if(elem.textContent == 11 && index === 0) {
                  btn.remove();
                }

                elem.textContent = valueFirstEl - count;

                if (elem.textContent == 1) {
                  btn.style.display = 'none';
                }

                --count
              });
              document.querySelector('.table-control-btn-onward').style.display = 'block';
            })
          }
        });

        if (document.querySelector('.table-control-btn-back')) {
          document.querySelector('.table-control-btn-back').style.display = 'block'
        };
      });
    }



    if (account.transactions.length === 0) {
      document.querySelector('.acc__container-control').style.display = 'none';
    };
  }



};

export function createElementExchangeOnline(arrayEx) {
  const list = el('list', {
    class: 'list-exchange'
  });

  arrayEx.forEach( i => {
    let classNameLine = null;
    let classNameValue = null;

    if(i.change === 1) {
      classNameLine = 'list-exchange__line_green';
      classNameValue = 'advance';
    } else {
      classNameLine = 'list-exchange__line_red';
      classNameValue = 'drop';
    };

    const item = el('li', {
      class: 'list-exchange__item'
    }, el('span', i.name, {
      class: 'list-exchange__title'
    }), el('span', {
      class: `list-exchange__line ${classNameLine}`
    }), el('span', i.rate, {
      class: `list-exchange__value ${classNameValue}`
    }));

    list.append(item);
  });
  document.querySelector('.container-list').textContent = '';
  document.querySelector('.container-list').append(list);
}

function createCustomSelect(title, arrayItem, id) {
  let value = title;
  let arrayElement = [

  ];
  arrayItem.forEach( i => {
    arrayElement.push(el('li', i, {
      class: 'select__item'
    }))
  });

  const select = el('div', {
    class: 'select',
    id: id
  },el('span', title, {
    class: 'select__value'
  }), el('select', value, {
    class: 'select__none'
  }), el('ul', {
    class: 'select__list'
  }, arrayElement));

  select.addEventListener('click', event => {
    select.classList.toggle('select_active');
  });

  arrayElement.forEach(el => {
    el.addEventListener('click', () => {
      const selectId = document.querySelector(`#${id}`);
      if (selectId.querySelector('.select__item_active')){
        selectId.querySelector('.select__item_active').classList.remove('select__item_active');
      };

      selectId.querySelector('.select__value').textContent = el.textContent;
      selectId.querySelector('.select__none').textContent = el.textContent;
      el.classList.add('select__item_active');
    })
  });

  return select
}

export function createGraph(id, array, mon, flag = false) {
  let profitMonth = [];
  let fromCashArray = [];
  let labels = [];
  const date = new Date();
  const ctx = document.getElementById(`${id}`).getContext('2d');
  let numMonth = date.getMonth() + 1;
  const arrayMonthName = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  if(mon < 12 && numMonth <= 6) {
    numMonth = 12 + (numMonth - 6);
  }

  let profit = 0;

  for (let i = 0; i < mon; i++) {
    if (numMonth === 12) {
      numMonth = 0
    }

    labels.push(arrayMonthName[numMonth]);
    let result = null;

    if (flag) {
      for (let i = 0; i < array.length; i++) {
        if ((numMonth + 1) === Number(array[i].name.substr(4,2))) {
          profitMonth.push(array[i].toCash);
          fromCashArray.push(array[i].fromCash);
          numMonth++
          result = true;
          break
        }
      }
    } else {
      for (let i = 0; i < array.length; i++) {
        if ((numMonth + 1) === Number(array[i].name.substr(4,2))) {
          profit += array[i].profit;
          
          profitMonth.push(profit);
          numMonth++
          result = true;
          break
        }
      }
    }

    if (!result) {
      profitMonth.push(0);
      fromCashArray.push(0)
      numMonth++
    }
  };

 
  let data = null;

  if (flag) {
    data = {
      labels: labels,
      datasets: [
        {
          label: 'Пополнения',
          data: profitMonth,
          backgroundColor: 'rgba(118, 202, 102, 1)',
        },
        {
          label: 'Транзакции',
          data: fromCashArray,
          backgroundColor: 'rgba(253, 78, 93, 1)',
        },
      ],
    };
  } else {
    data = {
      labels: labels,
      datasets: [{
        label: 'Баланс',
        data: profitMonth,
        backgroundColor: [
          'rgba(17, 106, 204, 1)',
        ],
        borderColor: [
          'rgba(17, 106, 204, 1)',
        ],
        borderWidth: 1
      }],
    };
  }

  const config = {
    type: 'bar',
    data: data,
    options: {
      scaleStepWidth: 500000,
      responsive: true,
      maintainAspectRatio: false,
      scaleStartValue: 0,
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true
        }
      }
    },

  };

  const myChart = new Chart(
    ctx,
    config,
  );
}

function createElTableTransaction(array, num, x = 0) {
  let arrayElTable = [];

  if(num > array.transactions.length) {
    num = array.transactions.length
  }

  if(array.transactions.length != 0) {
    for(let i = 1; i <= num; i++) {
      const element = array.transactions[(array.transactions.length - x) - i]
      let statusTransaction = null;
      let amount = null;
      const date = new Date(element.date);
      const day = date.getDate();
      let month = date.getMonth() + 1;
      const year = date.getFullYear();

      if(month < 10) {
        month = '0' + month;
      }

      if(element.from != array.account) {
        statusTransaction = 'table-transaction__item_green';
        amount = `+ ${element.amount} ₽`
      } else {
        statusTransaction = 'table-transaction__item_red';
        amount = `- ${element.amount} ₽`
      }

      const elementTable = el('tr', {
        class: 'table-transaction__str'
      }, el('td', element.from, {
        class: 'table-transaction__item'
      }), el('td', element.to, {
        class: 'table-transaction__item'
      }), el('td', amount, {
        class: `table-transaction__item ${statusTransaction}`
      }), el('td', `${day}.${month}.${year}`, {
        class: 'table-transaction__item'
      }))

      arrayElTable.push(elementTable);
    };
  }

  return arrayElTable;
}

function skeletonAccountsPage() {
  const container = el('div', {
    class: 'container'
  });

  const title = el('h1', {
    class: 'accounts__title accounts__title-skeleton'
  });

  const select = el('div', {
    class: 'select-account_skeleton select-account'
  })

  const btnAddAccount = el('div', {
    class: 'accounts__btn-add accounts__btn-add_skeleton'
  });

  const containerTop = el('div', {
    class: 'accounts__container-account'
  });

  const containerAccounts = el('div', {
    class: 'accounts__container-accounts'
  });

  const listAccounts = el('ul', {
    class: 'accounts__list'
  }, el('li', {
    class: 'accounts__list-item'
  }, el('div', {
      class: 'account account_skeleton'
    }, el('span', {
      class: 'account__id_skeleton'
    }), el('span', {
      class: 'account__balance_skeleton'
    }), el('div', {
      class: 'account__transaction-container'
    }, el('span', {
      class: 'account__transaction-text_skeleton'
    }), el('span', {
      class: 'account__transaction-date_skeleton'
    })), el('button', {
      class: 'account__btn_skeleton account__btn btn_skeleton'
    }))), el('li', {
    class: 'accounts__list-item'
  }, el('div', {
      class: 'account account_skeleton'
    }, el('span', {
      class: 'account__id_skeleton'
    }), el('span', {
      class: 'account__balance_skeleton'
    }), el('div', {
      class: 'account__transaction-container'
    }, el('span', {
      class: 'account__transaction-text_skeleton'
    }), el('span', {
      class: 'account__transaction-date_skeleton'
    })), el('button', {
      class: 'account__btn_skeleton account__btn btn_skeleton'
    }))), el('li', {
    class: 'accounts__list-item'
  }, el('div', {
      class: 'account account_skeleton'
    }, el('span', {
      class: 'account__id_skeleton'
    }), el('span', {
      class: 'account__balance_skeleton'
    }), el('div', {
      class: 'account__transaction-container'
    }, el('span', {
      class: 'account__transaction-text_skeleton'
    }), el('span', {
      class: 'account__transaction-date_skeleton'
    })), el('button', {
      class: 'account__btn_skeleton account__btn btn_skeleton'
    }))), el('li', {
    class: 'accounts__list-item'
  }, el('div', {
      class: 'account account_skeleton'
    }, el('span', {
      class: 'account__id_skeleton'
    }), el('span', {
      class: 'account__balance_skeleton'
    }), el('div', {
      class: 'account__transaction-container'
    }, el('span', {
      class: 'account__transaction-text_skeleton'
    }), el('span', {
      class: 'account__transaction-date_skeleton'
    })), el('button', {
      class: 'account__btn_skeleton account__btn btn_skeleton'
    }))), el('li', {
    class: 'accounts__list-item'
  }, el('div', {
      class: 'account account_skeleton'
    }, el('span', {
      class: 'account__id_skeleton'
    }), el('span', {
      class: 'account__balance_skeleton'
    }), el('div', {
      class: 'account__transaction-container'
    }, el('span', {
      class: 'account__transaction-text_skeleton'
    }), el('span', {
      class: 'account__transaction-date_skeleton'
    })), el('button', {
      class: 'account__btn_skeleton account__btn btn_skeleton'
    }))), el('li', {
    class: 'accounts__list-item'
  }, el('div', {
      class: 'account account_skeleton'
    }, el('span', {
      class: 'account__id_skeleton'
    }), el('span', {
      class: 'account__balance_skeleton'
    }), el('div', {
      class: 'account__transaction-container'
    }, el('span', {
      class: 'account__transaction-text_skeleton'
    }), el('span', {
      class: 'account__transaction-date_skeleton'
    })), el('button', {
      class: 'account__btn_skeleton account__btn btn_skeleton'
    }))));

  setChildren(containerAccounts, listAccounts);
  setChildren(containerTop, [title, select, btnAddAccount]);
  setChildren(container, [containerTop, containerAccounts]);
  setChildren(document.querySelector('main'), container);

  return {
    title,
    select,
    btnAddAccount,
    listAccounts,
    containerTop,
  }
}

function skeletonAccPage() {
  const contTitleAndNumber =  el('div', {
    class: 'acc__container-top-left'
  }, el('h1', {
    class: 'acc__title acc__title_skeleton'
  }), el('div', {
    class: 'acc__number acc__number_skeleton'
  }));

  const contBtnAndBalance = el('div', {
    class: 'acc__container-top-right'
  }, el('button', {
    class: 'btn acc__btn-back_skeleton'
  }), el('div', {
    class: 'container-balance'
  }, el('div', {
    class: 'acc__balance-text acc__balance-text_skeleton'
  }), el('div', {
    class: 'acc__balance-value acc__balance-value_skeleton'
  })));

  const contAndFormTransfer = el('div', {
    class: 'acc__container-transfer'
  }, el('h2', {
    class: 'acc__title-cont acc__title-cont_skeleton'
  }), el('div', {
    class: 'from-transfer'
  }, el('div', {
    class: 'from-transfer__container-top'
  }, el('label', {
    class: 'form-transfer__input-text acc__title-cont_skeleton'
  }), el('div', {
    class: 'form-transfer__input form-transfer__input_skeleton form-transfer__input-num',
  })), el('div', {
    class: 'from-transfer__container-bottom'
  }, el('label', {
    class: 'form-transfer__input-text acc__title-cont_skeleton'
  }), el('div', {
    class: 'form-transfer__input form-transfer__input_skeleton form-transfer__input-value',
  })), el('button', {
    class: 'btn from-transfer__btn_skeleton',
  })));

  const contDinamicBalance = el('div', {
    class: 'acc__container-dinamic-balance'
  }, el('h2', {
    class: 'acc__title-cont acc__title-cont_skeleton acc__title-dinam_skeleton'
  }), el('div', {
    class: 'graph-card graph-card_skeleton',
  }));

  const arrayElTable = [
    el('tr', {
      class: 'table-transaction__str'
    }, el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: `table-transaction__item`
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    })),
    el('tr', {
      class: 'table-transaction__str'
    }, el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: `table-transaction__item`
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    })),
    el('tr', {
      class: 'table-transaction__str'
    }, el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: `table-transaction__item`
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    })),
  ];

  const contHistoryTransaction = el('div', {
    class: 'acc__container-history-transaction'
  }, el('h2', {
    class: 'acc__title-cont acc__title-cont_skeleton'
  }), el('table', {
    class: 'table-transaction'
  }, el('tbody', {
    class: 'table-transaction__body'
  },el('tr', {
    class: 'table-transaction__heading'
  }, el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
    class: 'table-transaction__heading-title table-transaction__heading-title_skeleton'
  }),el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
    class: 'table-transaction__heading-title table-transaction__heading-title_skeleton'
  }),el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
    class: 'table-transaction__heading-title table-transaction__heading-title_skeleton'
  }),el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
    class: 'table-transaction__heading-title table-transaction__heading-title_skeleton'
  })), arrayElTable)));

  const containerBottom = el('div', {
    class: 'container-bottom'
  }, contHistoryTransaction);

  const containerMiddle = el('div', {
    class: 'container-middle'
  }, contAndFormTransfer, contDinamicBalance);

  const containerTop = el('div', {
    class: 'container-top'
  }, contTitleAndNumber, contBtnAndBalance);

  const container = el('div', {
    class: 'container'
  }, containerTop, containerMiddle, containerBottom);

  setChildren(document.querySelector('main'), container);

  return {
    contTitleAndNumber,
    contBtnAndBalance,
    contAndFormTransfer,
    contDinamicBalance,
    contHistoryTransaction
  }
}

function skeletonAccPageHistoryTranc() {
  const graphDinamicBalance = el('div', {
    class: 'cont-graph-dinamic-balance'
  }, el('h2', {
    class: 'acc__title-cont acc__title-cont_skeleton'
  }), el('div', {
    class: 'graph-dinamic-balance graph-dinamic-balance_skeleton',
  }));

  const graphDinamicTransaction = el('div', {
    class: 'cont-graph-dinamic-transaction'
  }, el('h2', {
    class: 'acc__title-cont acc__title-cont_skeleton'
  }), el('div', {
    class: 'graph-dinamic-balance graph-dinamic-balance_skeleton',
  }));

  const arrayElTable = [
    el('tr', {
      class: 'table-transaction__str'
    }, el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: `table-transaction__item`
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    })),
    el('tr', {
      class: 'table-transaction__str'
    }, el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: `table-transaction__item`
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    })),
    el('tr', {
      class: 'table-transaction__str'
    }, el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: `table-transaction__item`
    }), el('td', el('div', {
      class: 'table-transaction_skeleton',
    }), {
      class: 'table-transaction__item'
    })),
  ];

  const contHistoryTransaction = el('div', {
    class: 'acc__container-history-transaction'
  }, el('h2', {
    class: 'acc__title-cont acc__title-cont_skeleton'
  }), el('table', {
    class: 'table-transaction table-transaction-history'
  }, el('tbody', {
    class: 'table-transaction__body'
  },el('tr', {
    class: 'table-transaction__heading'
  }, el('td', el('div', {
    class: 'table-transaction__heading-title_skeleton table-transaction_skeleton',
  }), {
    class: 'table-transaction__heading-title'
  }),el('td', el('div', {
    class: 'table-transaction__heading-title_skeleton table-transaction_skeleton',
  }), {
    class: 'table-transaction__heading-title'
  }),el('td', el('div', {
    class: 'table-transaction__heading-title_skeleton table-transaction_skeleton',
  }), {
    class: 'table-transaction__heading-title'
  }),el('td', el('div', {
    class: 'table-transaction__heading-title_skeleton table-transaction_skeleton',
  }), {
    class: 'table-transaction__heading-title'
  })), arrayElTable)));

  const contMiddle = document.querySelector('.container-middle');
  const contBottom = document.querySelector('.container-bottom');
  contMiddle.classList.add('history-container-middle');
  contBottom.classList.add('history-container-bottom');

  setChildren(contBottom, contHistoryTransaction);
  setChildren(contMiddle, [graphDinamicBalance, graphDinamicTransaction]);

  return {
    graphDinamicBalance,
    graphDinamicTransaction,
    contHistoryTransaction,
  }
}

function skeletonCurrencyPage() {
  const container = el('div', {
    class: 'container'
  });

  const containerCurrency = el('div', {
    class: 'container-currency'
  });

  const title = el('h1', {
    class: 'currency__title currency__title_skeleton'
  });

  const containerLeft = el('div', {
    class: 'currency__container-left'
  });

  const containerRight = el('div', {
    class: 'currency__container-right'
  }, el('h2', {
    class: 'currency__dist-title currency__dist-title_skeleton'
  }), el('div', {
    class: 'container-list'
  }, el('ul', {
    class: 'list-exchange'
  }, el('li', {
    class: 'list-exchange__item list-exchange__item_skeleton'
  }), el('li', {
    class: 'list-exchange__item list-exchange__item_skeleton'
  }), el('li', {
    class: 'list-exchange__item list-exchange__item_skeleton'
  }), el('li', {
    class: 'list-exchange__item list-exchange__item_skeleton'
  }), el('li', {
    class: 'list-exchange__item list-exchange__item_skeleton'
  }), el('li', {
    class: 'list-exchange__item list-exchange__item_skeleton'
  }), el('li', {
    class: 'list-exchange__item list-exchange__item_skeleton'
  }), el('li', {
    class: 'list-exchange__item list-exchange__item_skeleton'
  }), el('li', {
    class: 'list-exchange__item list-exchange__item_skeleton'
  }), el('li', {
    class: 'list-exchange__item list-exchange__item_skeleton'
  }), el('li', {
    class: 'list-exchange__item list-exchange__item_skeleton'
  }), el('li', {
    class: 'list-exchange__item list-exchange__item_skeleton'
  }))));

  const elCurrencyAccount = el('div', {
    class: 'currency-account currency__container-left-child'
  }, el('h2', {
    class: 'currency__dist-title currency__dist-title_skeleton'
  }), el('ul', {
    class: 'currency-account__list'
  }, el('li', {
    class: 'currency-account__item currency-account__item_skeleton'
  }), el('li', {
    class: 'currency-account__item currency-account__item_skeleton'
  }), el('li', {
    class: 'currency-account__item currency-account__item_skeleton'
  }), el('li', {
    class: 'currency-account__item currency-account__item_skeleton'
  }), el('li', {
    class: 'currency-account__item currency-account__item_skeleton'
  }), el('li', {
    class: 'currency-account__item currency-account__item_skeleton'
  })));

  const formTrade = el('div', {
    class: 'currency-trade__form'
  }, el('div', {
    class: 'currency-trade__container-input'
  }, el('div', {
    class: 'currency-trade__container-currency'
  }, el('span', {
    class: 'currency-trade__text currency-trade__text_skeleton'
  }), el('div', {
    class: 'currency-trade currency-trade_skeleton'
  }), el('span', {
    class: 'currency-trade__text currency-trade__text_skeleton'
  }), el('div', {
    class: 'currency-trade currency-trade_skeleton'
  })), el('div', {
    class: 'currency-trade__container-value'
  }, el('span', {
    class: 'currency-trade__text currency-trade__text_skeleton'
  }), el('div', {
    class: 'currency-trade__value currency-trade__value_skeleton'
  }))), el('button', {
    class: 'btn currency-trade__btn currency-trade__btn_skeleton',
  }));

  const elFormTradeCurrency = el ('div', {
    class: 'currency-trade currency__container-left-child'
  }, el('h2', {
    class: 'currency__dist-title currency__dist-title_skeleton'
  }), formTrade);

  setChildren(containerLeft, [elCurrencyAccount, elFormTradeCurrency]);
  setChildren(containerCurrency, [containerLeft, containerRight])
  setChildren(container, [title, containerCurrency]);
  setChildren(document.querySelector('main'), container);

  return {
    title,
    containerLeft,
    containerRight,
    elCurrencyAccount,
    formTrade,
    elFormTradeCurrency,
  }
}

function skeletonATMsPage() {
  const container = el('div', {
    class: 'container'
  });

  const title = el('h1', {
    class: 'atms__title atms__title_skeleton'
  });

  const map = el('div', {
    class: 'atms__map atms__map_skeleton',
    id: 'map'
  });

  setChildren(container, [title, map]);
  setChildren(document.querySelector('main'), container);

  return {
    title,
    map,
  }
}

export function createModalErrorRoot() {
  const contModal = el('div', {
    class: 'container-modal',
  }, el('div', {
    class: 'modal',
  }, el('span', 'Произошла ошибка', {
    class: 'modal__title',
  }), el('span', {
    class: 'modal__error-text',
  }), el('button', {
    class: 'modal__btn-close btn',
  })));

  document.body.append(contModal);

  document.querySelector('.modal__btn-close').addEventListener('click', () => {
    document.querySelector('.modal_active').classList.remove('modal_active');
  })
}

export function openModalError(err) {
  const modal = document.querySelector('.container-modal');

  modal.querySelector('.modal__error-text').textContent = err;

  modal.classList.add('modal_active');
}



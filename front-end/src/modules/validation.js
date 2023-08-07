export function validateFormTransaction(id) {
  const form = document.querySelector('.from-transfer');
  const num = form.querySelector('.form-transfer__input-num');
  const value = form.querySelector('.form-transfer__input-value');
  const btn = form.querySelector('.btn');
  const error = document.querySelector('.form-transfer-errors');
  const valueBalance = document.querySelector('.acc__balance-value').textContent;
  let flag = false;

  let numData = '';
  let valueData = '';

  num.addEventListener('input', (i) => {
    if(num.value && value.value) {
      btn.disabled = false;
    } else {
      btn.disabled = true;
    }

    validNumber('Вы указали свой номер счета')

    if(i.inputType === 'deleteContentBackward') {
      numData = num.value;
      return
    };

    if(!i.data.match(/\d/)) {
      num.value = numData;
    } else {
      numData = num.value;
    }
  });

  value.addEventListener('input', (i) => {
   
    if(num.value && value.value) {
      btn.disabled = false;
    } else {
      btn.disabled = true;
    }

    validNumber('Вы указали свой номер счета')
    if(Number(value.value) > Number(valueBalance)) {
      validNumber('Недостаточно средств для перевода', true)
    }

    if(i.inputType === 'deleteContentBackward') {
      valueData = value.value;
      return
    };

    if(!i.data.match(/\d/)) {
      value.value = valueData;
    } else {
      valueData = value.value;
    }
  });

  num.addEventListener('blur', () => {
    validNumber('Вы указали свой номер счета')
  });

  value.addEventListener('blur', () => {
    validNumber('Вы указали свой номер счета')
  });
  
  function validNumber(text, status = false) {
    if (Number(num.value) === Number(id)) {
      error.classList.add('error');
      error.textContent = text;
      btn.disabled = true;
      setTimeout(() => {
        error.textContent = '';
        error.classList.remove('error');
      }, 5000);
    }

    if(status) {
      error.classList.add('error');
      error.textContent = text;
      btn.disabled = true;
      setTimeout(() => {
        error.textContent = '';
        error.classList.remove('error');
      }, 5000);
    }
  }
}

export function validationFormCyrrency() {
  const form = document.querySelector('.currency-trade__form');
  const value = form.querySelector('.currency-trade__value');
  const btn = form.querySelector('.btn');

  let valueData = '';

  value.addEventListener('input', (i) => {
    if(i.inputType != 'deleteContentBackward') {
      if(!i.data.match(/\d/)) {
        value.value = valueData;
      } else {
        valueData = value.value;
      }
    }

    if(value.value) {
      btn.disabled = false;
    } else {
      btn.disabled = true;
    }

    console.log(value.value)

    if(i.inputType === 'deleteContentBackward') {
      valueData = value.value;
      return
    };


  });
}

export function validationFormLogin() {
  const form = document.querySelector('.form-entry');
  const login = document.getElementById('login');
  const password = document.getElementById('password');
  const errorText = document.querySelector('.login-error');
  let actualPassword = '';

  form.addEventListener('input', () => {
    errorText.textContent = '';
    if (login.value.length > 6 && actualPassword === 'skillbox') {
      document.querySelector('.form-entry__btn').disabled = false;
    } else {
      document.querySelector('.form-entry__btn').disabled = true;
    }
  });

  login.addEventListener('blur', () => {
    if (login.value.length < 6 || login.value.match(/\s/)) {
      login.classList.add('input-error');
      errorText.textContent = 'Недостаточная длина логина или пароля, или введен пробел';
    }
  });

  password.addEventListener('blur', () => {
    if (String(actualPassword).length < 6 || String(actualPassword).match(/\s/)) {
      password.classList.add('input-error');
      errorText.textContent = 'Недостаточная длина логина или пароля, или введен пробел';
    }
  });

  password.addEventListener('input', () => {
    actualPassword = password.value;
  });


  password.addEventListener('click', () => {
    if (password.getAttribute('type') === 'password') {
      password.setAttribute('type', 'text');
    } else {
      password.setAttribute('type', 'password');
    }
  });
}

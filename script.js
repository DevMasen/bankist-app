'use strict';
/*
changed by Masen on Aug 2024
GitHub : https://github.com/DevMasen
main project by Jonas Schmedtman Udemy
*/

//! Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [
    {
      price: 200,
      date: '2019-11-01T13:15:33.035Z',
    },
    {
      price: 450,
      date: '2019-11-30T09:48:16.867Z',
    },
    {
      price: -400,
      date: '2019-12-25T06:04:23.907Z',
    },
    {
      price: 3000,
      date: '2020-01-25T14:18:46.235Z',
    },
    {
      price: -650,
      date: '2020-02-05T16:33:06.386Z',
    },
    {
      price: 1300,
      date: '2020-07-26T12:01:20.894Z',
    },
  ],
  interestRate: 1.2,
  pin: 1111,
  currency: 'EUR',
  exchangeRate: 0.92,
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [
    { price: 5000, date: '2019-11-01T13:15:33.035Z' },
    { price: 3400, date: '2019-11-30T09:48:16.867Z' },
    { price: -150, date: '2019-12-25T06:04:23.907Z' },
    { price: -790, date: '2020-01-25T14:18:46.235Z' },
    { price: -3210, date: '2020-02-05T16:33:06.386Z' },
    { price: -1000, date: '2020-04-10T14:43:26.374Z' },
    { price: 8500, date: '2020-06-25T18:49:59.371Z' },
    { price: -30, date: '2020-07-26T12:01:20.894Z' },
  ],
  interestRate: 1.5,
  pin: 2222,
  currency: 'EUR',
  exchangeRate: 0.92,
  locale: 'en-UK',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [
    { price: 200, date: '2019-11-01T13:15:33.035Z' },
    { price: -200, date: '2019-11-30T09:48:16.867Z' },
    { price: 340, date: '2019-12-25T06:04:23.907Z' },
    { price: -300, date: '2020-01-25T14:18:46.235Z' },
    { price: -20, date: '2020-02-05T16:33:06.386Z' },
    { price: 50, date: '2020-04-10T14:43:26.374Z' },
    { price: 400, date: '2020-06-25T18:49:59.371Z' },
    { price: -460, date: '2020-07-26T12:01:20.894Z' },
  ],
  interestRate: 0.7,
  pin: 3333,
  currency: 'EUR',
  exchangeRate: 0.92,
  locale: 'en-GB',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [
    { price: 430, date: '2019-11-01T13:15:33.035Z' },
    { price: 1000, date: '2019-11-30T09:48:16.867Z' },
    { price: 700, date: '2019-12-25T06:04:23.907Z' },
    { price: 50, date: '2020-01-25T14:18:46.235Z' },
    { price: 90, date: '2020-02-05T16:33:06.386Z' },
  ],
  interestRate: 1,
  pin: 4444,
  currency: 'USD',
  exchangeRate: 1,
  locale: 'en-US',
};

const account5 = {
  owner: 'Masen Mohseni',
  movements: [
    { price: 600, date: '2024-08-01T14:43:26.374Z' },
    { price: -700, date: '2024-08-02T18:49:59.371Z' },
    { price: -800, date: '2024-08-03T12:01:20.894Z' },
    { price: 900, date: '2024-08-04T23:15:03.782Z' },
    { price: 1000, date: '2024-08-05T16:20:33.363Z' },
  ],
  interestRate: 1.5,
  pin: 5555,
  currency: 'IRR',
  exchangeRate: 42105,
  locale: 'fa-IR',
};

const accounts = [account1, account2, account3, account4, account5];

//! HTML Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const labelTime = document.querySelector('.time');
const labelLoan = document.querySelector('.loan-label');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//! Variables
let currentAccount,
  timer,
  sorted = false;

//! Functons
//* IIFE setInterval function for running current time
(function () {
  setInterval(function () {
    const now = new Date();
    labelTime.textContent = new Intl.DateTimeFormat(navigator.language, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(now);
  }, 1000);
})();

//* IIFE function for computing usernames from account owners's name
(function (accounts = []) {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
})(accounts);

// * function for reset logout timer
const resetLogoutTimer = function () {
  //* set timer in minutes
  let totalSeconds = 120,
    min,
    second;

  const tick = function () {
    min = String(Math.trunc(totalSeconds / 60)).padStart(2, 0);
    second = String(totalSeconds % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${second}`;

    if (totalSeconds === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }

    totalSeconds--;
  };

  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

//* function for calculating days passed of a movement
const formatDate = function (acc = {}, isoDate = new Date(0).toISOString()) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const date = new Date(isoDate);
  const now = new Date();

  const daysPassed = calcDaysPassed(date, now);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed < 7) return `${daysPassed} Days Ago`;

  //* setting options for date
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  //* return formatted date
  return new Intl.DateTimeFormat(acc.locale, options).format(date);
};

//* function for calculating currect format of movements
const formatPrice = function (acc = {}, value = 0) {
  const options = {
    style: 'currency',
    currency: acc.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  return new Intl.NumberFormat(acc.locale, options).format(
    value * acc.exchangeRate
  );
};

//* function for displaying movements of an account on screen
const displayMovements = function (account = {}, sort = false) {
  let html, type, displayedDate, displayedMov;

  containerMovements.innerHTML = '';

  const movs = sort
    ? account.movements.slice().sort((a, b) => a.price - b.price)
    : account.movements;

  movs.forEach(function (mov, i) {
    type = mov.price > 0 ? 'deposit' : 'withdrawal';

    displayedDate = formatDate(account, mov.date);

    displayedMov = formatPrice(account, mov.price);

    html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayedDate}</div>
          <div class="movements__value">${displayedMov}</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//* function for displaying final balance
const calcDisplayBalance = function (account = {}) {
  account.balance = account.movements
    .map(mov => mov.price)
    .reduce((sum, prc) => sum + prc, 0);
  labelBalance.textContent = formatPrice(account, account.balance);
};

//* function for displaying summary
const calcDisplaySummary = function (account = {}) {
  const income = account.movements
    .map(mov => mov.price)
    .filter(prc => prc > 0)
    .reduce((sum, dep) => sum + dep, 0);

  labelSumIn.textContent = formatPrice(account, income);

  const outlet = account.movements
    .map(mov => mov.price)
    .filter(prc => prc < 0)
    .reduce((sum, wit) => sum + wit, 0);

  labelSumOut.textContent = formatPrice(account, Math.abs(outlet));

  const rate = account.interestRate / 100;
  const interest = account.movements
    .map(mov => mov.price)
    .filter(prc => prc > 0)
    .map(dep => dep * rate)
    .filter(int => int >= 1)
    .reduce((sum, int) => sum + int, 0);

  labelSumInterest.textContent = formatPrice(account, interest);
};

//* function for updating UI
const updateUI = function (account = {}) {
  //* Displaying Current Balance
  calcDisplayBalance(account);

  //* Displaying Movements
  displayMovements(account);

  //* Displaying Summary
  calcDisplaySummary(account);
};

//! Main
//* Adding Event Listener to Login Button
btnLogin.addEventListener('click', function (e) {
  //* Prevent form from refresh after submit
  e.preventDefault();

  //* find account by user input
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  //* setting options for login date
  const date = new Date();
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  //* check password and login
  if (currentAccount?.pin === +inputLoginPin.value) {
    //* set label date to formatted date
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(date);

    //* displaying user wellcome message
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner
      .split(' ')
      .at(0)}`;

    //* desplaying main UI
    containerApp.style.opacity = '1';

    //* Clear Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //* reset timer
    if (timer) clearInterval(timer);
    timer = resetLogoutTimer();

    //* Update UI
    updateUI(currentAccount);
  }
});

//* Adding Event Listener to Transfer Button
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const transferAmount = +inputTransferAmount.value;

  //* check conditions
  if (
    transferAccount &&
    transferAccount.username !== currentAccount.username &&
    transferAmount > 0 &&
    transferAmount <= currentAccount.balance
  ) {
    currentAccount.movements.push({
      price: -transferAmount,
      date: new Date().toISOString(),
    });

    transferAccount.movements.push({
      price: transferAmount,
      date: new Date().toISOString(),
    });

    //* reset timer
    if (timer) clearInterval(timer);
    timer = resetLogoutTimer();

    updateUI(currentAccount);
  }

  //* clear the inputs
  inputTransferTo.value = inputTransferAmount.value = '';
});

//* Adding Event Listener to Close Account Button
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  //* check for currect credential
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    //* delete account
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    //* Hide UI
    containerApp.style.opacity = 0;

    labelWelcome.textContent = 'Log in to get started';
  }

  //* clear the inputs
  inputCloseUsername.value = inputClosePin.value = '';
});

//* Adding Event Listener to Loan Button
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  //* check the conditions for getting loan
  if (
    amount > 0 &&
    currentAccount.movements
      .map(mov => mov.price)
      .some(prc => Math.abs(prc) > amount * 0.1)
  ) {
    labelLoan.textContent = 'Please Wait...';
    //* setting Timeout for requesting loan
    setTimeout(function () {
      //* add loan to movements
      currentAccount.movements.push({
        price: amount,
        date: new Date().toISOString(),
      });

      //* reset timer
      if (timer) clearInterval(timer);
      timer = resetLogoutTimer();

      //* update UI
      updateUI(currentAccount);

      //* change label
      labelLoan.textContent = 'Request loan';
    }, 3000);
  }

  inputLoanAmount.value = '';
});

//* Adding Event Listener to Sort Button
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  //* sort and unsort movements with boolean currentAccount.sorted
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

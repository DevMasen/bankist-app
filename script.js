'use strict';
/*
created by Masen on Aug 2024
GitHub : https://github.com/DevMasen
main project by Jonas Schmedtman Udemy
*/

//* Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Masen Mohseni',
  movements: [100, 200, -300, -400, 500, 600, -700, -800, 900, 1000],
  interestRate: 1.5,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

//* HTML Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

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
let currentAccount;
//! Functons
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

//* function for displaying movements of an account on screen
const displayMovements = function (movements = [], sort = false) {
  containerMovements.innerHTML = '';
  let html;
  let type;

  currentAccount.sorted = sort;
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (m, i) {
    type = m > 0 ? 'deposit' : 'withdrawal';
    html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">Today</div>
          <div class="movements__value">${m} €</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//* function for displaying final balance
const calcDisplayBalance = function (account = {}) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance} €`;
};

//* function for displaying summary
const calcDisplaySummary = function (account = {}) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, dep) => acc + dep, 0);

  labelSumIn.textContent = `${income} €`;

  const outlet = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, wit) => acc + wit, 0);

  labelSumOut.textContent = `${Math.abs(outlet)} €`;

  const rate = account.interestRate / 100;
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(dep => dep * rate)
    .filter((int, _, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => int + acc, 0);

  labelSumInterest.textContent = `${interest} €`;
};

//* function for updating UI
const updateUI = function (account = {}) {
  //* Displaying Current Balance
  calcDisplayBalance(account);

  //* Displaying Movements
  displayMovements(account.movements);

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

  //* check password and login
  if (currentAccount?.pin === +inputLoginPin.value) {
    //* displaying user wellcome message
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner
      .split(' ')
      .at(0)}`;

    //* desplaying main UI
    containerApp.style.opacity = '1';

    //* Clear Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

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
    currentAccount.movements.push(-transferAmount);
    transferAccount.movements.push(transferAmount);

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

  const amount = +inputLoanAmount.value;

  //* check the conditions for getting loan
  if (
    amount > 0 &&
    currentAccount.movements.some(mov => Math.abs(mov) > amount * 0.1)
  ) {
    //* add loan to movements
    currentAccount.movements.push(amount);

    //* update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

//* Adding Event Listener to Sort Button
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  //* sort and unsort movements with boolean currentAccount.sorted 
  displayMovements(currentAccount.movements, !currentAccount.sorted);
});

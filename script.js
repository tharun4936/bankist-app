'use strict';

/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2021-02-27T10:17:24.185Z',
    '2021-02-28T14:11:59.604Z',
    '2021-03-01T17:01:17.194Z',
    '2021-03-05T23:36:17.929Z',
    '2021-03-06T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};


const accounts = [account1, account2];
let currentAccount;
let timer;
let sort = false;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const labelSort = document.querySelector('.btn--sort');

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



//Formatting dates
const startLogoutTimer = function () {
  let time = 120;
  const tick = function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${minutes}:${seconds}`;
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  }
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}
const dateFormat = function (date, asIn = false) {

  const calcDaysPassed = (date1, date2) => {

    return Math.round(Math.abs(Number(date1) - Number(date2)) / (1000 * 60 * 60 * 24));

  }
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0 && asIn === false) return 'today';
  else if (daysPassed === 1 && asIn === false) return 'yesterday';
  else if (daysPassed <= 7 && asIn === false) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}



//Function Definitions/Expressions
const updateUI = function (account) {
  //Displaying Balance
  calcDisplayBalance(account);

  //Displaying movements
  displayMovements(account);

  //Displaying summary
  calcDisplaySummary(account);
}

const calcDisplaySummary = function (account) {

  const depositAmt = account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${depositAmt.toFixed(2)}€`;
  const withdrawalAmt = Math.abs(account.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0));
  labelSumOut.textContent = `${withdrawalAmt.toFixed(2)}€`;
  const interest = account.movements.filter(mov => mov > 0 && mov * (account.interestRate / 100) >= 1).reduce((acc, mov) => acc + (mov * 0.012), 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;

};

const displayMovements = function (account, sort = false) {

  containerMovements.innerHTML = '';
  const movs = sort ? account.movements.slice().sort((a, b) => a - b) : account.movements;
  movs.forEach(function (mov, i) {
    let type;
    const displayDate = dateFormat(new Date(account.movementsDates[i]));
    type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });

}

const calcDisplayBalance = function (account) {
  const balanceAmount = account.movements.reduce((accu, mov) => accu + mov, 0);
  account.balance = balanceAmount;
  labelBalance.textContent = `${balanceAmount.toFixed(2)}€`;
}

const createUserName = function (accounts) {
  accounts.forEach(function (account) {
    const username = account.owner.toLowerCase().split(' ').reduce((acc, name) => acc + name[0], '')
    account.username = username;
  })

}

createUserName(accounts);

//Main code  
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  const date = new Date();
  const hours = `${date.getHours()}`.padStart(2, 0);
  const minutes = `${date.getMinutes()}`.padStart(2, 0);
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value) || (inputLoginPin === '' || inputLoginUsername === '')) {
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Good day ${currentAccount.owner.split(' ')[0]}!`;

    labelDate.textContent = `${dateFormat(date, true)}, ${hours}:${minutes}`;

    //Clearing out empty fields and cursors
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Updating the UI
    updateUI(currentAccount);

    //Start Log out timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

  }
  else {
    //Clearing out empty fields and cursors
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Enter the correct username and password!';
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const recipentUsername = inputTransferTo.value;
  const amtTransfer = Number(inputTransferAmount.value);
  const date = `${new Date().toISOString()}`;
  const recipentAccount = accounts.find(acc => recipentUsername === acc.username);
  if (amtTransfer > 0 && recipentAccount && (currentAccount.balance - amtTransfer) > 0 && currentAccount !== recipentAccount) {
    currentAccount.movements.push(-amtTransfer);
    recipentAccount.movements.push(amtTransfer);
    currentAccount.movementsDates.push(date);
    recipentAccount.movementsDates.push(date);

    updateUI(currentAccount);

    inputTransferAmount.value = '';
    inputTransferTo.value = '';
    inputTransferAmount.blur();
    clearInterval(timer);
    timer = startLogoutTimer();
  }

});
btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  const accountUsername = inputCloseUsername.value;
  const accountPin = Number(inputClosePin.value);
  console.log(accountUsername, accountPin);
  if (accountUsername === currentAccount.username && accountPin === currentAccount.pin) {
    console.log('credentials match');
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });
    accounts.splice(index, 1);
    console.log(accounts);
    //logging out animation
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';

    //clearing out fields
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const date = `${new Date().toISOString()}`;
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(date);
    updateUI(currentAccount);
    inputLoanAmount.value = '';
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});


btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  sort = !sort;
  labelSort.innerHTML = `&downarrow; ${sort ? 'UNSORT' : ' SORT '}`;
  displayMovements(currentAccount, sort);
});


//LECTURES: 100 random dice rolls using Array.from method
// const diceRolls = Array.from({ length: 100 }, () => Math.trunc(Math.random() * 6 + 1));
// console.log(diceRolls);
// const a = new Array(5);

// const b = [];
// console.log(a, b);

//Sorting using sort method
// const a = [4, 7, 6, 3, 9, 0, 2];
// a.sort((a, b) => a - b);
// console.log(a);


//Understanding Higher order functions;

//Higher order function definition
const obj = {
  a: 3,
  b: 5,
  higher(callback) {
    return callback(this.a, this.b);

  }
}
const returnValue = obj.higher(function (a, b) {
  return a + b;
});

console.log(returnValue);






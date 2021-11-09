'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Ganesh Deokar',
  movements: [200, 400, 500, 2500, -600, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 2111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-US', 
};

const account2 = {
  owner: 'Priya Gupta ',
  movements: [1000, 3400, -150, -790, -3210, -1000, 300, -30],
  interestRate: 1.5,
  pin: 1234,

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
  currency: 'INR',
  locale: 'en-US',
};

const account3 = {
  owner: 'Rohit Mehra ',
  movements: [10000, 34003, -15000, -790, -3210, 10000, 300, -30],
  interestRate: 1.5,
  pin: 0000,

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
  currency: 'INR',
  locale: 'en-US',
};
const account4 = {
  owner: 'Krish Krish', 
  movements: [500, 3400, -150, -790, -320, -1000, 300, -30],
  interestRate: 1.5,
  pin: 3333,

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
  currency: 'INR',
  locale: 'en-US',
};
const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
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

/////////////////////////////////////////////////
// Functions

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

const date = new Date(acc.movementsDates[i]);
const day=`${date.getDate()}`.padStart(2,0);
const month=`${date.getMonth()+1}`.padStart(2,0);
const year=date.getFullYear();
const displayDates=`${day}/${month}/${year}`;

const formattedMov=new Intl.NumberFormat(acc.locale,{
  style:'currency',
  currency:'USD',
}).format(mov);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDates}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${+acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${+incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${+Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${+interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startlogOutTimer=function(){
 const tick= function(){
    const min2=String(Math.trunc(time1/60)).padStart(2,0);
    const sec2=String(time1 % 60).padStart(2,0);
 // In each call, print remaining time to UI
   labelTimer.textContent=`${min2}:${sec2}`;

 // when 0 seconds, stop timer and log out user
 if(time1===0){
   clearInterval(timer3);
   labelWelcome.textContent = `Login to get started!`;
   containerApp.style.opacity = 0;
 }
   // decerse 1 sec
 time1--;
};
  // set time to 5 minutes
  let time1 = 600;
  // call the timer every second
  tick();
   const timer3=setInterval(tick,1000);
   return timer3;
}

///////////////////////////////////////
// Event handlers
let currentAccount,timer3;

// // fake always logged in
// currentAccount=account1;
// updateUI(currentAccount);
// containerApp.style.opacity=100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create a current date and time:-
// const now1=new Date();
// const day=`${now1.getDate()}`.padStart(2,0);
// const month=`${now1.getMonth()+1}`.padStart(2,0);
// const year=now1.getFullYear();
// const hour=`${now1.getHours()}`.padStart(2,0);
// const min=`${now1.getMinutes()}`.padStart(2,0);
// labelDate.textContent=`${day}/${month}/${year}, ${hour}:${min}`;

const now1=new Date();
const options={
  hour:'numeric',
  minute:'numeric',
  day: 'numeric',
  month:'long',
  year: 'numeric',
  weekday:'long',
}
const locale=navigator.language;
console.log(locale);
labelDate.textContent=new Intl.DateTimeFormat(locale, options).format(now1);
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

if(timer3)clearInterval(timer3);
    timer3=startlogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});


btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // add transfer date:
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer3);
    timer3=startlogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function(){
    // Add movement
    currentAccount.movements.push(+Math.floor(amount));

    // Add loan dates
    currentAccount.movementsDates.push(new Date().toISOString());

     // Reset timer
     clearInterval(timer3);
     timer3=startlogOutTimer();

    // Update UI
    updateUI(currentAccount);
  },2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value=== currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(acc.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
console.log(23===23.0);

// Base 10 - 0 to 9
// Binary base 2 - 0.1. 1/10=0.1 . 3/10=3.3333333
console.log(0.1+0.2===0.3);

// convesion
console.log(Number('23'));
console.log(+'23');

// Parsing
console.log(Number.parseInt('30px'));
console.log(Number.parseInt('e23',10));

console.log(Number.parseInt('2.5rem'));
console.log(Number.parseFloat('2.5rem'));

// console.log(parseFloat('2.5rem'));


// Check if value is NaN
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(23/0));


// Checking if value is number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20x'));
console.log(Number.isFinite(23/0));

console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23));
console.log(Number.isInteger(23/0));


// Math and Rounding:-

console.log(Math.sqrt(25));
console.log(25 ** (1/2));
console.log(8 ** (1/3));


console.log(Math.max(5,18,23,11,2));
console.log(Math.max(5,18,'23',11,2));
console.log(Math.max(5,18,'23px',11,2));

console.log(Math.min(5,18,23,11,2));
console.log(Math.min('5',18,23,11,2));
console.log(Math.min('5px',18,23,11,2));

console.log(Math.PI*Number.parseFloat('10px')**2);//radius of circle PI*r*r

console.log(Math.trunc(Math.random()*6)+1);

const randomInt=(min,max)=>Math.trunc(Math.random()*(max-min)+1)+min;
// 0...1-->0...(max-min)-->min...(max)
console.log(randomInt(10,20));


// Rounding Integers:-

console.log(Math.trunc(23.3));
console.log(Math.round(23.9));

console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3));
console.log(Math.floor('23.9'));

console.log(Math.trunc(-23.9));
console.log(Math.floor(-23.9));

// Rounding decimals
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2));
// toFixed method will always return a string not a number



// Remainder Operator:-
console.log(5%2);
console.log(5/2);//5=2*2+1

console.log(8%3);
console.log(8/3);//8=3*2+2

// odd or even :-
const isEven=(n)=>n%2==0?'even':'odd';
console.log(isEven(10));

labelBalance.addEventListener('click', function (){
[...document.querySelectorAll('.movements__row')].forEach(function (row,i){
  if (i % 2 === 0) row.style.backgroundColor='orangered';
  if (i % 3 === 0) row.style.backgroundColor='blue';
});
});
// Nth time



// working with bigInt

console.log(2**53-1);
console.log(Number.MAX_SAFE_INTEGER);

// oprations with bigInt
console.log(10000n+10000n);
console.log(3628754892375493752352783524789562345437534n*10000000n);

// Math.sqrt is not working with BigInt 

const huge= 2017185789237558348957n;
const num=23;
console.log(huge* BigInt(num));

//Expectations
console.log(20n>5);
console.log(20n===20);
console.log(typeof 20n);
console.log(20n===20);
console.log(20n==='20');
console.log(huge+'is Really big');


// divisions
console.log(11n/3n);
console.log(10/3);
console.log();


// Create a Date:-

const now=new Date();
console.log(now);

console.log(new Date('Sat Sep 18 2021 17:15:17'));
console.log(new Date('December 24,2015'));
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2037,10,33,15,23,5));

console.log(new Date(0));
console.log(new Date(3*24*60*60*1000));

// Working with dates
const future=new Date(2037,10,33,15,23,5);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime());
console.log(new Date(2143446785000));

console.log(Date.now());

future.setFullYear(2040);
console.log(future);

// Internationaliing Dates(Intl):-

const future1=new Date(2037,10,33,15,23,5);
console.log(+future1);
const calcDaysPassed=(date1,date2)=>(date2-date1)/(1000*60*60*24);
const days1 = calcDaysPassed(new Date(2037,3,14,10,10),new Date(2021,9,20));
console.log(Math.round(Math.abs(days1)));



// InterNationalising numbers:-

const num1= 3884764.23;
const options1={
  style:"currency",
  unit:"celsius",
  currency:"EUR",
  // useGrouping: false,
};
console.log('US:      ',new Intl.NumberFormat('en-US',options1).format(num1));
console.log('Germany:    ', new Intl.NumberFormat('de-DE',options1).format(num1));
console.log('Syria:   ', new Intl.NumberFormat('ar-SY',options1).format(num1));
console.log('Browser:   ', new Intl.NumberFormat(navigator.language,options1).format(num1));



// Timers:setTimeOut and setInterval

// setTimeOut:-

const ingredients=['olives','spinach']
const timerPizza=setTimeout((ing1,ing2)=>console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕🍕🍕`),3000,'olives','spinach',...ingredients);

console.log('Watching...');
if(ingredients.includes('spinach')) clearTimeout(timerPizza);


// setInterval:-

// setInterval(function(){
//   const now2= new Date();
// const date2=`${now2.getDate()}`.padStart(2,0);
// const month2=`${now2.getMonth()}`.padStart(2,0);
// const year2=now2.getFullYear();
// const hour2=`${now2.getHours()}`.padStart(2,0);
// const minutes2=`${now2.getMinutes()}`.padStart(2,0);
//   console.log(`${month2}/${date2}/${year2} ${hour2}:${minutes2}`);
// },1000);



// Implemening a countdown timer:-




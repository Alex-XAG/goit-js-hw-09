import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const dateInput = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const timerBlock = document.querySelector('.timer');
const daysNumber = document.querySelector('[data-days]');
const hoursNumber = document.querySelector('[data-hours]');
const minNumber = document.querySelector('[data-minutes]');
const secNumber = document.querySelector('[data-seconds]');

startBtn.classList.add('btn-start-date');

startBtn.classList.add('disabled');
let finishDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);

    if (selectedDates[0] < Date.now()) {
      Notify.failure('Please choose a date from the future');
      finishDate = new Date();
    } else {
      startBtn.disabled = false;
      startBtn.classList.remove('disabled');
      finishDate = selectedDates[0];
    }
  },
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = pad(Math.floor(ms / day));
  // Remaining hours
  const hours = pad(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

//   console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
//   console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
//   console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

function pad(value) {
  return String(value).padStart(2, '0');
}

class Timer {
  constructor() {
    this.isActive = false;
    this.timeCounter = null;
    startBtn.disabled = true;
  }
  timerStart() {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.timeCounter = setInterval(() => {
      const currentTime = Date.now();
      const diffTime = finishDate - currentTime;
      const dateElements = convertMs(diffTime);

      secNumber.textContent = dateElements.seconds;
      minNumber.textContent = dateElements.minutes;
      hoursNumber.textContent = dateElements.hours;
      daysNumber.textContent = dateElements.days;
      if (diffTime <= 0) {
        this.stop();
        timerBlock.innerHTML = 'Yeah!!! Our time is coming!!!';
      }
    }, 1000);
  }
  timerStop() {
    clearInterval(this.timeCounter);
  }
}

const timer = new Timer();

flatpickr(dateInput, options);

startBtn.addEventListener('click', () => timer.timerStart());

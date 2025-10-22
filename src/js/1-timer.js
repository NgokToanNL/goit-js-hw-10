// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerIntervalId = null;

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };

}

function updateTimerInterface({ days, hours, minutes, seconds }) {
    daysValue.textContent = days.toString();
    hoursValue.textContent = addLeadingZero(hours);
    minutesValue.textContent = addLeadingZero(minutes);
    secondsValue.textContent = addLeadingZero(seconds);
}

function stopTimer() {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
    datetimePicker.disabled = false;
    startButton.disabled = true;
    iziToast.success({
        title: 'Done',
        message: 'The countdown is finished!',
        position: 'topRight'
    })
}

function tick() {
    const now = new Date();
    const ms = userSelectedDate.getTime() - now.getTime();

    if (ms <= 0) {
        stopTimer();
        updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 })

        return;
    }
    const time = convertMs(ms);
    updateTimerInterface(time);

}

function startTimer() {
    if (timerIntervalId) return;

    startButton.disabled = true;
    datetimePicker.disabled = true;

    tick();

    timerIntervalId = setInterval(tick, 1000);
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];
        const now = new Date();

        if (selectedDate.getTime() <= now.getTime()) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
                position: 'topRight'
            });
            startButton.disabled = true;
            userSelectedDate = null;
        } else {
            userSelectedDate = selectedDate;
            startButton.disabled = false;
        }
  },
};

flatpickr(datetimePicker, options);

startButton.addEventListener('click', startTimer);


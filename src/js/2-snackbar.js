// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";


const form = document.querySelector('.form');

function creatPromise(delay, state) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === 'fulfilled') {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });
}

function onFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const delay = Number(formData.get('delay'));
    const state = formData.get('state');

    if (delay === null || state === null) {
        iziToast.error({
            title: 'Error',
            message: 'Please fill in all fields (Delay and State).',
            position: 'topRight'
        });
        return;
    }

    const promise = creatPromise(delay, state);

    promise
        .then(resultDelay => {
            iziToast.success({
                title: 'Ok',
                message: `✅ Fulfilled promise in ${delay}ms`,
                position: 'topRight',
                timeout: 5000
            });
        })
        .catch(errorDelay => {
            iziToast.error({
                title: 'Error',
                message: `❌ Rejected promise in ${delay}ms`,
                position: 'topRight',
                timeout: 5000
            });
        });
}

form.addEventListener('submit', onFormSubmit);
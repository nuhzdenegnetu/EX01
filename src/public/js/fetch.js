document.querySelector('form.login__form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Останавливаем стандартное поведение формы

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    try {
        const response = await fetch(form.action, {
            method: form.method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            if (result.redirectUrl) {
                window.location.href = result.redirectUrl; // Перенаправление
            } else {
                alert(result.message || 'Успешно!');
            }
            console.log('Отправка данных:', data);
            console.log('Ответ сервера:', result);
        } else {
            const error = await response.json();
            alert(error.message || 'Ошибка при входе');

        }
    } catch (err) {
        console.error('Ошибка:', err);
        alert('Произошла ошибка. Попробуйте снова.');
    }

});

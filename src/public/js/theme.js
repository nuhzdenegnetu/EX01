document.addEventListener('DOMContentLoaded', () => {
    const themeSelect = document.getElementById('theme-select');
    const savedTheme = document.cookie
        .split('; ')
        .find(row => row.startsWith('theme='))
        ?.split('=')[1];

    // Установить сохранённую тему или тему по умолчанию
    const currentTheme = savedTheme || 'light';
    document.body.classList.add(`${currentTheme}-theme`);
    themeSelect.value = currentTheme;

    // Обработчик изменения темы
    themeSelect.addEventListener('change', (event) => {
        const selectedTheme = event.target.value;

        // Удалить старый класс и добавить новый
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${selectedTheme}-theme`);

        // Сохранить тему в cookies
        document.cookie = `theme=${selectedTheme}; path=/; max-age=${30 * 24 * 60 * 60}`;
    });
});
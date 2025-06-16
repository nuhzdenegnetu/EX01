document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = document.cookie
        .split('; ')
        .find(row => row.startsWith('theme='))
        ?.split('=')[1];

    // Установить сохранённую тему или тему по умолчанию
    const currentTheme = savedTheme || 'light';
    document.body.className = `page page--${currentTheme}`;
    themeToggle.checked = currentTheme === 'dark';

    // Обработчик переключения темы
    themeToggle.addEventListener('change', () => {
        const selectedTheme = themeToggle.checked ? 'dark' : 'light';

        // Обновить класс темы
        document.body.className = `page page--${selectedTheme}`;

        // Сохранить тему в cookies
        document.cookie = `theme=${selectedTheme}; path=/; max-age=${30 * 24 * 60 * 60}`;
    });
});
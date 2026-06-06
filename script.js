// SCROLL TO TOP
const scrollBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollBtn.classList.add('show');
    } else {
        scrollBtn.classList.remove('show');
    }
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// DARK MODE
const darkToggle = document.getElementById('darkToggle');
const body = document.body;

function setTheme(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
        darkToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        darkToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

if (localStorage.getItem('theme') === 'dark') {
    setTheme(true);
} else {
    setTheme(false);
}

darkToggle.addEventListener('click', () => {
    setTheme(!body.classList.contains('dark-mode'));
});

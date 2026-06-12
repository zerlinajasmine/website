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

// MUSIC PLAYER
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;
let autoplayAttempted = false;

musicBtn.addEventListener('click', () => {
    toggleMusic();
});

function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
        musicBtn.textContent = '♫';
    } else {
        bgMusic.play();
        musicBtn.classList.add('playing');
        musicBtn.textContent = '♬';
    }
    isPlaying = !isPlaying;
}

// Try autoplay on first user interaction
document.addEventListener('click', function firstClick() {
    if (!autoplayAttempted) {
        autoplayAttempted = true;
        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.classList.add('playing');
            musicBtn.textContent = '♬';
        }).catch(() => {});
    }
}, { once: true });

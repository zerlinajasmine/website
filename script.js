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

// NAV SCROLL SPY
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.top-nav a');

function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let current = '';

    sections.forEach(section => {
        const offsetTop = section.offsetTop;
        const offsetBottom = offsetTop + section.offsetHeight;
        if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

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

// FORM SUBMISSION + LOCALSTORAGE
const storyForm = document.getElementById('storyForm');
const thankYou = document.getElementById('thankyou');

function loadStories() {
    const list = document.getElementById('storiesList');
    if (!list) return;
    const stories = JSON.parse(localStorage.getItem('myStories') || '[]');
    if (stories.length === 0) {
        list.innerHTML = '<p class="empty">Belum ada cerita yang dikirim.</p>';
        return;
    }
    list.innerHTML = stories.map(s => `
        <div class="story-item">
            <div class="story-date">${s.date}</div>
            <div class="story-text">${s.text}</div>
            <div class="story-meta">${s.name} · ${s.publish === 'Ya, boleh' ? 'Disetujui untuk dipublikasikan' : 'Tidak untuk dipublikasikan'}</div>
        </div>
    `).join('');
}

if (storyForm && thankYou) {
    storyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(storyForm);
        try {
            await fetch(storyForm.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            // Save to localStorage
            const stories = JSON.parse(localStorage.getItem('myStories') || '[]');
            stories.unshift({
                id: Date.now(),
                date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                text: data.get('message'),
                name: data.get('name') || 'Anonim',
                publish: data.get('publish') || 'Tidak'
            });
            localStorage.setItem('myStories', JSON.stringify(stories));
            storyForm.style.display = 'none';
            thankYou.style.display = 'block';
            loadStories();
        } catch {
            alert('Gagal mengirim. Coba lagi ya.');
        }
    });
}

loadStories();

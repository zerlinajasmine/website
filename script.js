// SUPABASE CLIENT
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get or create user ID
let userId = localStorage.getItem('hd_user_id');
if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('hd_user_id', userId);
}

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

// SUPABASE: FORM SUBMISSION
const storyForm = document.getElementById('storyForm');
const thankYou = document.getElementById('thankyou');

if (storyForm && thankYou) {
    storyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(storyForm);
        const name = data.get('name') || 'Anonim';
        const message = data.get('message');
        const publish = data.get('publish') || 'Tidak';

        try {
            // Send to Formspree (still goes to email)
            await fetch(storyForm.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            }).catch(() => {});
            // Save to Supabase
            const { error } = await supabase
                .from('stories')
                .insert({ user_id: userId, name, message, publish_consent: publish });
            if (error) throw error;
            storyForm.style.display = 'none';
            thankYou.style.display = 'block';
            loadMyStories();
        } catch {
            alert('Gagal mengirim. Coba lagi ya.');
        }
    });
}

// SUPABASE: LOAD MY STORIES
async function loadMyStories() {
    const list = document.getElementById('storiesList');
    if (!list) return;

    const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
        list.innerHTML = '<p class="empty">Belum ada cerita yang dikirim.</p>';
        return;
    }

    list.innerHTML = data.map(s => {
        const date = new Date(s.created_at).toLocaleDateString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        const replyHtml = s.reply
            ? `<div class="story-reply"><strong>Balasan:</strong> ${s.reply}</div>`
            : '';
        return `
            <div class="story-item">
                <div class="story-date">${date}</div>
                <div class="story-text">${s.message}</div>
                <div class="story-meta">${s.name} · ${s.publish_consent === 'Ya, boleh' ? 'Disetujui untuk dipublikasikan' : 'Tidak untuk dipublikasikan'}</div>
                ${replyHtml}
            </div>
        `;
    }).join('');
}

loadMyStories();

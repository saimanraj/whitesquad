// --- Scroll Reveal Animation ---
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Trigger numbers animation if it's a stats item
            if(entry.target.classList.contains('stat-item')) {
                const counter = entry.target.querySelector('.counter');
                if(counter && !counter.classList.contains('counted')) {
                    startCounter(counter);
                    counter.classList.add('counted'); // Prevent re-animating
                }
            }
        }
    });
};

const revealObserver = new IntersectionObserver(revealCallback, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
revealElements.forEach(el => revealObserver.observe(el));

// --- Number Counter Animation ---
function startCounter(counter) {
    const target = +counter.getAttribute('data-target');
    const duration = 2000; // 2 seconds
    const stepTime = Math.abs(Math.floor(duration / target));
    let current = 0;
    const increment = target > 1000 ? Math.ceil(target / 100) : Math.ceil(target / 50);

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            counter.innerText = target.toLocaleString();
            clearInterval(timer);
        } else {
            counter.innerText = current.toLocaleString();
        }
    }, stepTime > 0 ? stepTime : 10);
}

// --- Lightbox Modal Logic ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(imageSrc) {
    lightboxImg.src = imageSrc;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
}

function closeLightbox() {
    lightbox.classList.remove('show');
    setTimeout(() => { lightboxImg.src = ''; }, 300);
    document.body.style.overflow = 'auto'; // Restore scrolling
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) closeLightbox();
});
lightbox.addEventListener('click', (e) => {
    if(e.target === lightbox) closeLightbox();
});


// --- Real Audio & Visualizer Logic ---
const audio = document.getElementById('bgMusic');
const visualizer = document.getElementById('visualizer');
const playBtn = document.getElementById('masterPlay');
const topPlayBtn = document.getElementById('playAudioBtn');
const heroPlayIcon = document.getElementById('heroPlayIcon');
const progressBar = document.getElementById('progress');
let isPlaying = false;

// Generate visualizer bars dynamically
for(let i=0; i<30; i++) {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = '10px';
    visualizer.appendChild(bar);
}
const bars = document.querySelectorAll('.bar');

// Function to handle playing and pausing audio natively
function toggleMusic() {
    if (!isPlaying) {
        // Attempt to play HTML5 audio
        audio.play().then(() => {
            isPlaying = true;
            playBtn.innerText = '⏸ Pause Track';
            topPlayBtn.innerHTML = '<span class="icon" id="heroPlayIcon">⏸</span> Pause Campus Theme';
            playBtn.style.background = 'var(--cyan)';
            
            // Start Visualizer Animation
            window.audioVisualizer = setInterval(() => {
                bars.forEach(bar => {
                    const height = Math.random() * 50 + 10;
                    bar.style.height = `${height}px`;
                });
            }, 100);
        }).catch(error => {
            console.log("Audio playback was blocked by browser. User must interact first.", error);
            alert("Please click anywhere on the page first to allow audio playback!");
        });
    } else {
        // Pause audio
        audio.pause();
        isPlaying = false;
        playBtn.innerText = '▶ Play Track';
        topPlayBtn.innerHTML = '<span class="icon" id="heroPlayIcon">▶</span> Play Campus Theme';
        playBtn.style.background = 'var(--purple)';
        
        // Stop Visualizer
        clearInterval(window.audioVisualizer);
        bars.forEach(bar => bar.style.height = '10px');
    }
}

// Update native progress bar
audio.addEventListener('timeupdate', () => {
    if(audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
});

// Event Listeners for Buttons
playBtn.addEventListener('click', toggleMusic);

topPlayBtn.addEventListener('click', () => {
    // If not playing, start it, otherwise just scroll to it or pause
    if(!isPlaying) {
        toggleMusic();
    }
    // Scroll down to the music section to see the visualizer
    document.getElementById('music').scrollIntoView({ behavior: 'smooth' });
});

// --- Back to Top ---
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
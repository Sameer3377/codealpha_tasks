// Playlist data
const songs = [
    {
        title: "Summer Vibes",
        artist: "DJ Sunshine",
        duration: "3:45",
        url: "assets/audio/song1.mp3"
    },
    {
        title: "Night Drive",
        artist: "Neon Dreams",
        duration: "4:12",
        url: "assets/audio/song2.mp3"
    },
    {
        title: "Morning Coffee",
        artist: "Acoustic Soul",
        duration: "3:28",
        url: "assets/audio/song3.mp3"
    },
    {
        title: "City Lights",
        artist: "Urban Echo",
        duration: "4:56",
        url: "assets/audio/song4.mp3"
    },
    {
        title: "Ocean Waves",
        artist: "Tranquil Sounds",
        duration: "5:23",
        url: "assets/audio/song5.mp3"
    },
    {
        title: "Mountain Peak",
        artist: "Nature's Voice",
        duration: "3:52",
        url: "assets/audio/song6.mp3"
    }
];

// Elements
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const albumArt = document.getElementById('albumArt');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const progressThumb = document.getElementById('progressThumb');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const volumeLevel = document.getElementById('volumeLevel');
const volumeIcon = document.getElementById('volumeIcon');
const playlistEl = document.getElementById('playlist');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');

// State
let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let isRepeating = false;
let volume = 0.7;

// Initialize
function init() {
    renderPlaylist();
    audio.volume = volume;
}

// Render playlist
function renderPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        if (index === currentSongIndex) item.classList.add('active');
        
        item.innerHTML = `
            <div class="playlist-item-number">${index + 1}</div>
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
            <div class="playlist-item-duration">${song.duration}</div>
        `;
        
        item.onclick = () => loadSong(index);
        playlistEl.appendChild(item);
    });
}

// Load song
function loadSong(index) {
    currentSongIndex = index;
    const song = songs[index];
    
    audio.src = song.url;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    
    renderPlaylist();
    
    if (isPlaying) {
        playSong();
    }
}

// Play song
function playSong() {
    isPlaying = true;
    playBtn.textContent = '⏸';
    albumArt.classList.add('playing');
    audio.play().catch(e => console.log('Playback error:', e));
}

// Pause song
function pauseSong() {
    isPlaying = false;
    playBtn.textContent = '▶';
    albumArt.classList.remove('playing');
    audio.pause();
}

// Toggle play/pause
playBtn.onclick = () => {
    if (audio.src === '') {
        loadSong(0);
        playSong();
    } else {
        isPlaying ? pauseSong() : playSong();
    }
};

// Previous song
prevBtn.onclick = () => {
    currentSongIndex = currentSongIndex > 0 ? currentSongIndex - 1 : songs.length - 1;
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
};

// Next song
nextBtn.onclick = () => {
    playNextSong();
};

function playNextSong() {
    if (isShuffled) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// Update progress bar
audio.ontimeupdate = () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = progressPercent + '%';
        progressThumb.style.left = progressPercent + '%';
        
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
};

// Seek
progressBar.onclick = (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
};

// Format time
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Volume control
volumeSlider.onclick = (e) => {
    const rect = volumeSlider.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    volume = Math.max(0, Math.min(1, percent));
    audio.volume = volume;
    volumeLevel.style.width = (volume * 100) + '%';
    updateVolumeIcon();
};

volumeIcon.onclick = () => {
    if (volume > 0) {
        audio.volume = 0;
        volumeLevel.style.width = '0%';
        volume = 0;
    } else {
        audio.volume = 0.7;
        volumeLevel.style.width = '70%';
        volume = 0.7;
    }
    updateVolumeIcon();
};

function updateVolumeIcon() {
    if (volume === 0) {
        volumeIcon.textContent = '🔇';
    } else if (volume < 0.5) {
        volumeIcon.textContent = '🔉';
    } else {
        volumeIcon.textContent = '🔊';
    }
}

// Shuffle toggle
shuffleBtn.onclick = () => {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active');
};

// Repeat toggle
repeatBtn.onclick = () => {
    isRepeating = !isRepeating;
    repeatBtn.classList.toggle('active');
    audio.loop = isRepeating;
};

// Auto-play next song
audio.onended = () => {
    if (!isRepeating) {
        playNextSong();
    }
};

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        isPlaying ? pauseSong() : playSong();
    } else if (e.code === 'ArrowRight') {
        nextBtn.click();
    } else if (e.code === 'ArrowLeft') {
        prevBtn.click();
    }
});

// Initialize player
init();

// DOM Elements
const playlistsContainer = document.getElementById('playlists-container');
const playlistGrid = document.getElementById('playlist-grid');
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const progressBar = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-bar');
const nowPlayingTitle = document.getElementById('now-playing-title');
const nowPlayingArtist = document.getElementById('now-playing-artist');
const nowPlayingCover = document.getElementById('now-playing-cover');

// App State
let playlists = [];
let currentPlaylist = null;
let currentTrackIndex = 0;
let isPlaying = false;

// Fetch playlists from JSON
async function fetchPlaylists() {
    try {
        const response = await fetch('playlists.json');
        const data = await response.json();
        playlists = data.playlists;
        displayPlaylists();
    } catch (error) {
        console.error('Error fetching playlists:', error);
    }
}

// Display playlists in the sidebar and grid
function displayPlaylists() {
    // Clear existing content
    playlistsContainer.innerHTML = '';
    playlistGrid.innerHTML = '';

    // Add playlists to sidebar
    playlists.forEach(playlist => {
        // Add to sidebar
        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        playlistItem.textContent = playlist.name;
        playlistItem.addEventListener('click', () => showPlaylist(playlist.id));
        playlistsContainer.appendChild(playlistItem);

        // Add to grid
        const playlistCard = document.createElement('div');
        playlistCard.className = 'playlist-card';
        playlistCard.innerHTML = `
            <div class="playlist-cover">
                <img src="${playlist.coverUrl}" alt="${playlist.name}">
                <button class="play-button" data-playlist-id="${playlist.id}">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <h3 class="playlist-title">${playlist.name}</h3>
            <p class="playlist-description">${playlist.description}</p>
        `;
        playlistCard.addEventListener('click', () => showPlaylist(playlist.id));
        playlistGrid.appendChild(playlistCard);
    });
}

// Show playlist view
function showPlaylist(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    currentPlaylist = playlist;
    
    // Update URL
    window.history.pushState({ playlistId }, '', `playlist.html?id=${playlistId}`);
    
    // Create playlist view
    const playlistView = `
        <div class="playlist-view">
            <div class="playlist-header">
                <div class="playlist-header-cover">
                    <img src="${playlist.coverUrl}" alt="${playlist.name}">
                </div>
                <div class="playlist-header-info">
                    <div class="playlist-type">Playlist</div>
                    <h1 class="playlist-name">${playlist.name}</h1>
                    <p class="playlist-description-header">${playlist.description}</p>
                    <div class="playlist-actions">
                        <button class="play-button-large" id="play-playlist">
                            <i class="fas fa-play"></i>
                            <span>Play</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="tracks-container">
                <div class="tracks-header">
                    <div>#</div>
                    <div>Title</div>
                    <div>Album</div>
                    <div><i class="far fa-clock"></i></div>
                </div>
                ${playlist.tracks.map((track, index) => `
                    <div class="track" data-track-index="${index}">
                        <div class="track-number">${index + 1}</div>
                        <div class="track-title">
                            <div>
                                <div class="track-name">${track.name}</div>
                                <div class="track-artist">${playlist.name}</div>
                            </div>
                        </div>
                        <div class="track-album">${playlist.name}</div>
                        <div class="track-duration">-:--</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Update main content
    document.querySelector('.main-content .content').innerHTML = playlistView;
    
    // Add event listeners
    document.querySelectorAll('.track').forEach((trackEl, index) => {
        trackEl.addEventListener('click', () => playTrack(index));
    });
    
    document.getElementById('play-playlist').addEventListener('click', () => {
        playTrack(0);
    });
}

// Play a track
function playTrack(trackIndex) {
    if (!currentPlaylist) return;
    
    currentTrackIndex = trackIndex;
    const track = currentPlaylist.tracks[trackIndex];
    
    // Update audio source
    audioPlayer.src = track.file;
    audioPlayer.load();
    
    // Update UI
    nowPlayingTitle.textContent = track.name;
    nowPlayingArtist.textContent = currentPlaylist.name;
    nowPlayingCover.src = currentPlaylist.coverUrl;
    
    // Play the track
    audioPlayer.play()
        .then(() => {
            isPlaying = true;
            updatePlayButton();
        })
        .catch(error => {
            console.error('Error playing track:', error);
        });
    
    // Update active track in playlist
    updateActiveTrack();
}

// Update play/pause button
function updatePlayButton() {
    if (isPlaying) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        document.querySelector('.play-button-large i').className = 'fas fa-pause';
    } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        document.querySelector('.play-button-large i').className = 'fas fa-play';
    }
}

// Update progress bar
function updateProgress() {
    const { duration, currentTime } = audioPlayer;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Update time display
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
    
    if (duration) {
        durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
    }
    
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
    
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
}

// Set progress when clicking on progress bar
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

// Play next track
function nextTrack() {
    if (!currentPlaylist) return;
    
    currentTrackIndex++;
    if (currentTrackIndex >= currentPlaylist.tracks.length) {
        currentTrackIndex = 0;
    }
    playTrack(currentTrackIndex);
}

// Play previous track
function prevTrack() {
    if (!currentPlaylist) return;
    
    if (audioPlayer.currentTime > 3) {
        // If more than 3 seconds into the song, restart it
        audioPlayer.currentTime = 0;
    } else {
        // Otherwise, go to previous track
        currentTrackIndex--;
        if (currentTrackIndex < 0) {
            currentTrackIndex = currentPlaylist.tracks.length - 1;
        }
        playTrack(currentTrackIndex);
    }
}

// Update active track in playlist view
function updateActiveTrack() {
    document.querySelectorAll('.track').forEach((trackEl, index) => {
        if (index === currentTrackIndex) {
            trackEl.classList.add('active');
        } else {
            trackEl.classList.remove('active');
        }
    });
}

// Event Listeners
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play();
    }
    isPlaying = !isPlaying;
    updatePlayButton();
});

prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);

audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', nextTrack);
audioPlayer.addEventListener('play', () => {
    isPlaying = true;
    updatePlayButton();
});

audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayButton();
});

progressContainer.addEventListener('click', setProgress);

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.playlistId) {
        showPlaylist(event.state.playlistId);
    } else {
        // Show home view
        document.querySelector('.main-content .content').innerHTML = `
            <h1>Good afternoon</h1>
            <div class="playlist-grid" id="playlist-grid"></div>
        `;
        displayPlaylists();
    }
});

// Initialize app
function init() {
    fetchPlaylists();
    
    // Check for playlist ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const playlistId = urlParams.get('id');
    
    if (playlistId) {
        showPlaylist(playlistId);
    }
}

// Start the app
init();

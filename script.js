const API_URL = 'https://pahe-api.onrender.com';
document.addEventListener('DOMContentLoaded', function() {
    // Load featured anime on homepage
    loadFeaturedAnime();
    
    // Search functionality
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            searchAnime(query);
        }
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchAnime(query);
            }
        }
    });
    
    // Modal close button
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Load featured anime on homepage
function loadFeaturedAnime() {
    const featuredAnime = [
        { session_id: '78e38106-d9f3-a8b5-7974-9702f603dc96', title: 'Naruto' },
        { session_id: '4f34bcac-c734-a182-8757-1e49ff1902ca', title: 'Naruto Shippuden' },
        { session_id: 'e5a5f3d4-5a7c-8e8e-1b5b-6c2b1a5e5e5e', title: 'One Piece' },
        { session_id: 'a1b2c3d4-1234-5678-9012-345678901234', title: 'Attack on Titan' },
        { session_id: 'b2c3d4e5-2345-6789-0123-456789012345', title: 'Demon Slayer' },
        { session_id: 'c3d4e5f6-3456-7890-1234-567890123456', title: 'Jujutsu Kaisen' }
    ];
    
    const featuredContainer = document.getElementById('featured-anime');
    featuredContainer.innerHTML = '';
    
    featuredAnime.forEach(anime => {
        fetch(`/anime/${anime.session_id}`)
            .then(response => response.json())
            .then(data => {
                const animeCard = createAnimeCard(data);
                featuredContainer.appendChild(animeCard);
            })
            .catch(error => {
                console.error('Error loading featured anime:', error);
                // Fallback if API fails
                const animeCard = document.createElement('div');
                animeCard.className = 'anime-card';
                animeCard.innerHTML = `
                    <div class="anime-poster" style="background-color: #333;"></div>
                    <div class="anime-info">
                        <h3 class="anime-title">${anime.title}</h3>
                        <div class="anime-meta">
                            <span>Click to view</span>
                        </div>
                    </div>
                `;
                animeCard.addEventListener('click', () => viewAnimeDetails(anime.session_id));
                featuredContainer.appendChild(animeCard);
            });
    });
}

// Search anime function
function searchAnime(query) {
    fetch(`${API_URL}/search/${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }
            
            const content = document.getElementById('content');
            content.innerHTML = `
                <h2>Search Results for "${query}"</h2>
                <div class="anime-grid" id="search-results"></div>
            `;
            
            const resultsContainer = document.getElementById('search-results');
            if (data.results.length === 0) {
                resultsContainer.innerHTML = '<p>No anime found matching your search.</p>';
                return;
            }
            
            data.results.forEach(anime => {
                const animeCard = createAnimeCard(anime);
                resultsContainer.appendChild(animeCard);
            });
        })
        .catch(error => {
            console.error('Error searching anime:', error);
            alert('An error occurred while searching. Please try again.');
        });
}

// Create anime card element
function createAnimeCard(anime) {
    const animeCard = document.createElement('div');
    animeCard.className = 'anime-card';
    
    animeCard.innerHTML = `
        <img src="${API_URL}/proxy-image?url=${encodeURIComponent(anime.poster)}" alt="${anime.title}" class="anime-poster" onerror="this.src='https://via.placeholder.com/200x300?text=No+Poster'">
        <div class="anime-info">
            <h3 class="anime-title">${anime.title}</h3>
            <div class="anime-meta">
                <span>${anime.type}</span>
                <span>${anime.episodes} eps</span>
            </div>
        </div>
    `;
    
    animeCard.addEventListener('click', () => viewAnimeDetails(anime.session_id));
    return animeCard;
}

// View anime details
function viewAnimeDetails(sessionId) {
    fetch(`${API_URL}/anime/${sessionId}`)
        .then(response => response.json())
        .then(anime => {
            // Create anime details HTML
            let detailsHTML = `
                <div class="anime-details">
                    <div class="anime-header">
                        <img src="http://localhost:5000//proxy-image?url=${encodeURIComponent(anime.poster)}" alt="${anime.title}" class="anime-poster-large" onerror="this.src='https://via.placeholder.com/250x350?text=No+Poster'">
                        <div class="anime-main-info">
                            <h2>${anime.title}</h2>
                            ${anime.japanese_title ? `<p class="anime-japanese-title">${anime.japanese_title}</p>` : ''}
                            
                            <div class="anime-synopsis">
                                <h3>Synopsis</h3>
                                <p>${anime.synopsis || 'No synopsis available.'}</p>
                            </div>
                            
                            <div class="anime-meta-info">
                                ${anime.details.type ? `<div class="meta-item"><strong>Type</strong> ${anime.details.type}</div>` : ''}
                                ${anime.details.episodes ? `<div class="meta-item"><strong>Episodes</strong> ${anime.details.episodes}</div>` : ''}
                                ${anime.details.status ? `<div class="meta-item"><strong>Status</strong> ${anime.details.status}</div>` : ''}
                                ${anime.details.aired ? `<div class="meta-item"><strong>Aired</strong> ${anime.details.aired}</div>` : ''}
                                ${anime.details.duration ? `<div class="meta-item"><strong>Duration</strong> ${anime.details.duration}</div>` : ''}
                                ${anime.details.season ? `<div class="meta-item"><strong>Season</strong> ${anime.details.season}</div>` : ''}
                                ${anime.details.studio ? `<div class="meta-item"><strong>Studio</strong> ${anime.details.studio}</div>` : ''}
                                ${anime.details.score ? `<div class="meta-item"><strong>Score</strong> ${anime.details.score}</div>` : ''}
                            </div>
                        </div>
                    </div>
                    
                    ${anime.genres.length > 0 ? `
                        <div class="anime-genres">
                            <h3>Genres</h3>
                            <div 
								class="genre-list">${anime.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
							</div>
                        </div>
                    ` : ''}
            `;
            
            // Add relations if available
            if (Object.keys(anime.relations).length > 0) {
                detailsHTML += `<h3>Related Anime</h3>`;
                for (const [relationType, relations] of Object.entries(anime.relations)) {
                    detailsHTML += `
                        <div class="relation-section">
                            <h4>${relationType.replace('_', ' ').toUpperCase()}</h4>
                            <div class="anime-grid">
                                ${relations.map(rel => `
                                    <div class="anime-card" onclick="viewAnimeDetails('${rel.url.split('/').pop()}')">
                                        <img src="${rel.poster}" alt="${rel.title}" class="anime-poster" onerror="this.src='https://via.placeholder.com/200x300?text=No+Poster'">
                                        <div class="anime-info">
                                            <h3 class="anime-title">${rel.title}</h3>
                                            <div class="anime-meta">
                                                <span>${rel.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }
            }
            
            // Add episodes section
            detailsHTML += `
                <div class="episodes-container">
                    <div class="episodes-header">
                        <h3>Episodes</h3>
                    </div>
                    <div class="episodes-grid" id="episodes-list"></div>
                    <div class="pagination" id="pagination"></div>
                </div>
            `;
            
            detailsHTML += `</div>`; // Close anime-details div
            
            // Set content and load episodes
            document.getElementById('content').innerHTML = detailsHTML;
            loadEpisodes(sessionId, 1);
            
            // Add back button
            const backBtn = document.createElement('button');
            backBtn.className = 'btn';
            backBtn.textContent = 'Back to Search';
            backBtn.style.marginBottom = '20px';
            backBtn.addEventListener('click', () => {
                document.getElementById('content').innerHTML = `
                    <div class="welcome">
                        <h2>Welcome to AnimePahe Stream</h2>
                        <p>Search for your favorite anime to get started!</p>
                        <div class="featured">
                            <h3>Popular Anime</h3>
                            <div class="anime-grid" id="featured-anime"></div>
                        </div>
                    </div>
                `;
                loadFeaturedAnime();
            });
            
            document.getElementById('content').prepend(backBtn);
        })
        .catch(error => {
            console.error('Error loading anime details:', error);
            alert('An error occurred while loading anime details. Please try again.');
        });
}

// Load episodes for anime
function loadEpisodes(sessionId, page) {
    fetch(`${API_URL}/episodes/${sessionId}/page=${page}`)
        .then(response => response.json())
        .then(data => {
            const episodesList = document.getElementById('episodes-list');
            episodesList.innerHTML = '';
            
            if (data.episodes.length === 0) {
                episodesList.innerHTML = '<p>No episodes found.</p>';
                return;
            }
            
            data.episodes.forEach(episode => {
                const episodeCard = document.createElement('div');
                episodeCard.className = 'episode-card';
                episodeCard.innerHTML = `
                    ${episode.snapshot ? `<img src="${episode.snapshot}" alt="Episode ${episode.episode}" class="episode-snapshot" onerror="this.style.display='none'">` : ''}
                    <div class="episode-number">Episode ${episode.episode}</div>
                `;
                
                episodeCard.addEventListener('click', () => showEpisodeOptions(sessionId, episode.session, episode.episode));
                episodesList.appendChild(episodeCard);
            });
            
            // Create pagination
            const pagination = document.getElementById('pagination');
            pagination.innerHTML = '';
            
            if (data.total_pages > 1) {
                // Previous button
                if (page > 1) {
                    const prevBtn = document.createElement('button');
                    prevBtn.className = 'page-btn';
                    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
                    prevBtn.addEventListener('click', () => loadEpisodes(sessionId, page - 1));
                    pagination.appendChild(prevBtn);
                }
                
                // Page buttons
                const startPage = Math.max(1, page - 2);
                const endPage = Math.min(data.total_pages, page + 2);
                
                for (let i = startPage; i <= endPage; i++) {
                    const pageBtn = document.createElement('button');
                    pageBtn.className = `page-btn ${i === page ? 'active' : ''}`;
                    pageBtn.textContent = i;
                    pageBtn.addEventListener('click', () => loadEpisodes(sessionId, i));
                    pagination.appendChild(pageBtn);
                }
                
                // Next button
                if (page < data.total_pages) {
                    const nextBtn = document.createElement('button');
                    nextBtn.className = 'page-btn';
                    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
                    nextBtn.addEventListener('click', () => loadEpisodes(sessionId, page + 1));
                    pagination.appendChild(nextBtn);
                }
            }
        })
        .catch(error => {
            console.error('Error loading episodes:', error);
            alert('An error occurred while loading episodes. Please try again.');
        });
}

// Show episode options (stream/download)
function showEpisodeOptions(animeSessionId, episodeSession, episodeNumber) {
    fetch(`${API_URL}/download/${animeSessionId}/${episodeSession}`)
        .then(response => response.json())
        .then(data => {
            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = `
                <h2>Episode ${episodeNumber}</h2>
                <p>Choose a quality option:</p>
                <div class="quality-options">
                    ${data.results.map(option => `
                        <div class="quality-option">
                            <div class="quality-info">
                                <strong>${option.quality}</strong>
                                ${option.success ? '<span class="success">Available</span>' : `<span class="error">Error: ${option.error}</span>`}
                            </div>
                            <div class="quality-action">
                                ${option.success ? `
                                    <button class="btn" onclick="playVideo('${option.direct_url}')">
                                        <i class="fas fa-play"></i> Stream
                                    </button>
                                    <button class="btn" onclick="downloadVideo('${option.direct_url}', 'Episode_${episodeNumber}_${option.quality.split(' ')[2]}')">
                                        <i class="fas fa-download"></i> Download
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="video-container" id="video-container"></div>
            `;
            
            document.getElementById('modal').style.display = 'block';
        })
        .catch(error => {
            console.error('Error loading download links:', error);
            alert('An error occurred while loading download links. Please try again.');
        });
}

// Play video in modal
function playVideo(videoUrl) {
    const videoContainer = document.getElementById('video-container');
    videoContainer.innerHTML = `
        <video controls autoplay>
            <source src="${videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    `;
}

// Download video
function downloadVideo(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Expose functions to global scope for HTML onclick attributes
window.viewAnimeDetails = viewAnimeDetails;
window.playVideo = playVideo;
window.downloadVideo = downloadVideo;

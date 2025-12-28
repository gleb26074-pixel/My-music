let tracks = [];
let favorites = [];
let current = 0;
let filteredTracks = [];

const audio = document.getElementById("audio");
const trackListEl = document.getElementById("trackList");
const titleEl = document.getElementById("title");
const coverEl = document.getElementById("cover");
const progressEl = document.getElementById("progress");

const fileInput = document.getElementById("fileInput");
fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    const url = URL.createObjectURL(file);
    tracks.push({ title: file.name, src: url, cover: "https://via.placeholder.com/100", playlist: "All" });
  });
  filteredTracks = tracks;
  renderTracks();
});

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  filteredTracks = tracks.filter(t => t.title.toLowerCase().includes(term));
  renderTracks();
});

function renderTracks() {
  trackListEl.innerHTML = "";
  filteredTracks.forEach((track, index) => {
    const div = document.createElement("div");
    const realIndex = tracks.indexOf(track);
    div.className = "track" + (favorites.includes(realIndex) ? " favorite" : "");
    div.textContent = track.title;
    div.onclick = () => playTrack(realIndex);
    div.ondblclick = () => toggleFavorite(realIndex);
    trackListEl.appendChild(div);
  });
}

function playTrack(index) {
  current = index;
  audio.src = tracks[index].src;
  titleEl.textContent = tracks[index].title;
  coverEl.src = tracks[index].cover;
  audio.play();
  coverEl.classList.add("playing");
}

function toggle() {
  audio.paused ? audio.play() : audio.pause();
  if(audio.paused) coverEl.classList.remove("playing");
  else coverEl.classList.add("playing");
}

function next() {
  current = (current + 1) % tracks.length;
  playTrack(current);
}

function prev() {
  current = (current - 1 + tracks.length) % tracks.length;
  playTrack(current);
}

audio.ontimeupdate = () => {
  progressEl.value = (audio.currentTime / audio.duration) * 100 || 0;
};

progressEl.oninput = () => {
  audio.currentTime = (progressEl.value / 100) * audio.duration;
};

function toggleFavorite(index) {
  if (favorites.includes(index)) favorites = favorites.filter(i => i !== index);
  else favorites.push(index);
  renderTracks();
}

document.getElementById("favoritesBtn").addEventListener("click", () => {
  filteredTracks = tracks.filter((t,i) => favorites.includes(i));
  renderTracks();
});

function showPlaylist(name){
  filteredTracks = tracks.filter(t => t.playlist === name || name === "All");
  renderTracks();
}

function showAll(){
  filteredTracks = tracks;
  renderTracks();
}

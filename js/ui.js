import { IMAGE_BASE_URL } from "./config.js";
import { fetchTrailer } from "./api.js";

export function createMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.className = "movie-card";
  movieCard.innerHTML = `
        <img src="${
          movie.poster_path
            ? IMAGE_BASE_URL + movie.poster_path
            : "placeholder.jpg"
        }" 
             alt="${movie.title}">
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-rating">
                <span>⭐ ${movie.vote_average.toFixed(1)}</span>
                <span>${
                  movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : "N/A"
                }</span>
            </div>
        </div>
    `;
  movieCard.addEventListener("click", () => loadContent(movie));
  return movieCard;
}

export function displayMovies(movies, container, append = false) {
  if (!append) {
    container.innerHTML = "";
  }
  movies.forEach((movie) => {
    container.appendChild(createMovieCard(movie));
  });
}

export function populateGenreFilter(genres, selectElement) {
  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.id;
    option.textContent = genre.name;
    selectElement.appendChild(option);
  });
}

function getVideoEmbedUrl(video) {
  switch (video.site.toLowerCase()) {
    case "youtube":
      return `https://www.youtube.com/embed/${video.key}`;
    case "vimeo":
      return `https://player.vimeo.com/video/${video.key}`;
    default:
      return null;
  }
}

async function loadContent(movie) {
  const movieId = movie.id;
  const movieTitle = movie.title;
  const movieOverview = movie.overview;
  console.log(`${movieTitle} \n ${movieId} \n ${movieOverview}`);
  const modal = document.getElementById("trailer-modal");
  const ContentContainer = document.getElementById("content-container");
  const modalTitle = document.getElementById("modal-title");
  const trailerBtn = document.getElementById("watch-trailer");
  const modalDescription = document.getElementById("overview");
  const watchMovieBtn = document.getElementById("watch-movie");

  const data = await fetchTrailer(movieId);
  const videos = data.results.filter(
    (video) =>
      ["Trailer"].includes(video.type) &&
      ["YouTube", "Vimeo"].includes(video.site)
  );

  modalTitle.textContent = movieTitle;
  modalDescription.innerHTML = movieOverview;
  modal.style.display = "block";
  trailerBtn.addEventListener("click", () => {
    if (videos.length > 0) {
      ContentContainer.innerWidth = "";
      ContentContainer.innerHTML = videos
        .reverse()
        .map(
          (video) => `
          <div class="video-wrapper">
          <h3 class="video-title">${video.name} (${video.type})</h3>
          <div class="video-container">
          <iframe src="${getVideoEmbedUrl(video)}" 
          frameborder="0" 
              allowfullscreen>
              </iframe>
              </div>
              </div>
              `
        )
        .join("");
    } else {
      alert("No trailers available for this movie.");
    }
  });
  watchMovieBtn.addEventListener("click", () => {
    ContentContainer.innerHTML = "";
    ContentContainer.innerHTML = `
    <button id="fullScreenBtn" class="btn">Click me to make it Full Screen!</button>
    <iframe style=" height:400px; aspect-ratio: 16 / 9;" src="https://embed.su/embed/movie/${movieId}" ></iframe>`;
    const fullScreenBtn = document.getElementById("fullScreenBtn");
    fullScreenBtn.addEventListener("click", () => {
      const iframe = document.querySelector("iframe");
      console.log("Btn was clicked!");
      iframe.style.position = "fixed";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.aspectRatio = "none";
      iframe.style.height = "100vh";
      iframe.style.width = "100vw";
      document.querySelector("body").style.overflow = "hidden";
    });
  });
}
export function setupModalEvents() {
  const modal = document.getElementById("trailer-modal");
  const closeBtn = document.querySelector(".close");
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";

    document.querySelector("body").style.overflowY = "scroll";
    const ContentContainer = document.getElementById("content-container");
    ContentContainer.innerHTML = ""; // Clear videos when closing
  });

  //   window.addEventListener("click", (e) => {
  //     if (e.target === modal) {
  //       modal.style.display = "none";
  //       const trailerContainer = document.getElementById("trailer-container");
  //       trailerContainer.innerHTML = ""; // Clear videos when closing
  //     }
  //   });
}

export function createLoadingSpinner() {
  const spinner = document.createElement("div");
  spinner.className = "loading-spinner";
  return spinner;
}

import { fetchGenres, fetchMovies } from "./js/api.js";
import {
  displayMovies,
  populateGenreFilter,
  setupModalEvents,
  createLoadingSpinner,
} from "./js/ui.js";
import { debounce } from "./js/utils.js";

const moviesGrid = document.getElementById("movies-grid");
const searchInput = document.getElementById("search");
const genreFilter = document.getElementById("genre-filter");
const sortBy = document.getElementById("sort-by");
const main = document.getElementsByTagName("main")[0];
const spinner = createLoadingSpinner();
main.appendChild(spinner);

let currentPage = 1;
let totalPages = 1;
let isLoading = false;
let currentSearchTerm = "";
let currentGenre = "";
let currentSortBy = "popularity.desc";
async function init() {
  const { genres } = await fetchGenres();
  populateGenreFilter(genres, genreFilter);

  await loadMovies();
  setupEventListeners();
  setupModalEvents();
  setupInfiniteScroll();
}

async function loadMovies(append = false) {
  if (isLoading || (currentPage > totalPages && append))
    return (isLoading = true);
  if (!append) {
    currentPage = 1;
    moviesGrid.innerHTML = "";
  }

  const spinner = createLoadingSpinner();
  moviesGrid.appendChild(spinner);

  const movies = await fetchMovies(
    currentSearchTerm,
    currentGenre,
    currentSortBy,
    currentPage
  );

  spinner.remove();
  totalPages = movies.total_pages;
  displayMovies(movies.results, moviesGrid, append);
  isLoading = false;
}

function setupEventListeners() {
  searchInput.addEventListener(
    "input",
    debounce(async (e) => {
      currentSearchTerm = e.target.value.trim();
      await loadMovies();
    }, 500)
  );

  genreFilter.addEventListener("change", async (e) => {
    currentGenre = e.target.value;
    await loadMovies();
  });

  sortBy.addEventListener("change", async (e) => {
    currentSortBy = e.target.value;
    await loadMovies();
  });
}

function setupInfiniteScroll() {
  const observer = new IntersectionObserver(
    async (entries) => {
      const lastEntry = entries[0];
      if (lastEntry.isIntersecting && !isLoading && currentPage < totalPages) {
        currentPage++;
        await loadMovies(true);
      }
    },
    { threshold: 0.1 }
  );

  // Create and observe a sentinel element
  const sentinel = document.createElement("div");
  sentinel.className = "sentinel";
  moviesGrid.appendChild(sentinel);
  observer.observe(sentinel);
}

init();

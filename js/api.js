import { BASE_URL, fetchOptions, getApiUrl } from "./config.js";

export async function fetchGenres() {
  try {
    const response = await fetch(
      getApiUrl(`${BASE_URL}/genre/movie/list`),
      fetchOptions
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching genres:", error.message);
    return { genres: [] };
  }
}

export async function fetchMovies(
  searchTerm = "",
  selectedGenre = "",
  sortByValue = "popularity.desc",
  page = 1
) {
  try {
    let url = searchTerm
      ? `${BASE_URL}/search/movie?query=${encodeURIComponent(
          searchTerm
        )}&page=${page}`
      : `${BASE_URL}/discover/movie?sort_by=${sortByValue}&page=${page}`;

    if (selectedGenre) {
      url += `&with_genres=${selectedGenre}`;
    }

    const response = await fetch(getApiUrl(url), fetchOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching movies:", error.message);
    return { results: [], total_pages: 0 };
  }
}

export async function fetchTrailer(movieId) {
  try {
    const response = await fetch(
      getApiUrl(`${BASE_URL}/movie/${movieId}/videos`),
      fetchOptions
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching trailer:", error.message);
    return { results: [] };
  }
}

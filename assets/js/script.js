const apiKey = "7413491";

let currentPage = 1;
let totalResults = 0;
let currentTitle = "";
let currentType = "";

async function fetchMovies(title, type, page = 1) {
  const url = `https://www.omdbapi.com/?s=${title}&type=${type}&apikey=${apiKey}&page=${page}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.Response === "True") {
    totalResults = parseInt(data.totalResults, 10);
    return data.Search;
  } else {
    throw new Error(data.Error);
  }
}

async function fetchMovieDetails(imdbID) {
  const detailsUrl = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;
  const response = await fetch(detailsUrl);
  return await response.json();
}

function showLoading() {
  document.getElementById("loading").style.display = "block";
}

function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

function clearTable() {
  document.getElementById("results-table").innerHTML = "";
}

function renderTable(movies) {
  const resultsTable = document.getElementById("results-table");
  movies.forEach((movie) => {
    const row = `
          <tr>
            <td>${movie.Title}</td>
            <td>${movie.Year}</td>
            <td>${movie.Country || "N/A"}</td>
            <td>${movie.Type}</td>
          </tr>
        `;
    resultsTable.innerHTML += row;
  });
}

async function searchMovies(title, type) {
  try {
    showLoading();
    const movies = await fetchMovies(title, type, currentPage);

    const detailedMovies = await Promise.all(
      movies.map((movie) => fetchMovieDetails(movie.imdbID))
    );

    renderTable(detailedMovies);

    if (currentPage * 10 < totalResults) {
      document.getElementById("load-more").style.display = "block";
    } else {
      document.getElementById("load-more").style.display = "none";
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    hideLoading();
  }
}

document
  .getElementById("movie-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("load-more").style.display = "none";
    currentTitle = document.getElementById("title-input").value;
    currentType = document.getElementById("type-select").value;
    currentPage = 1;
    clearTable();
    searchMovies(currentTitle, currentType);
  });

document.getElementById("load-more").addEventListener("click", () => {
  currentPage++;
  searchMovies(currentTitle, currentType);
});

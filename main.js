var body = document.querySelector('body');
var mainContainer = document.querySelector('.main-container')
var upcomingContainer = document.querySelector('.upcoming-container')
var popularContainer = document.querySelector('.popular-container')
var searchedContainer = document.querySelector('.search-result-container')
var searchField = document.getElementById('search')
var similarMovieContainer = document.querySelector('.related-container')
var exitButton = document.querySelector('.modal-exit');
var movieOverview = document.querySelector('.movie-overview');
var releaseDate = document.getElementById('release-date');
var averageRate = document.getElementById('average-rating');
var genreContainer = document.getElementById('genre-container');
var navUl = document.getElementById('nav-ul');
var genreTitle = document.getElementById('genre-title');
var similarMovieCaption = document.querySelector('.similar-movie-caption')
var noTrailerCaption = document.querySelector('.no-trailer-caption')
var searchedTitle = document.querySelector('.search-title')
var noResults = document.querySelector('.no-results')
var app = new App(mainContainer, popularContainer, upcomingContainer, searchedContainer, searchField, similarMovieContainer, genreContainer)

body.addEventListener('click', (e)=>app.eventHandler(e));
exitButton.addEventListener('click', app.exitModal);

app.start()

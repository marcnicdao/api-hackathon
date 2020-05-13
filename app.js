class App {
    constructor(mainContainer, popularContainer, upcomingContainer, searchedContainer, searchField, similarMovieContainer) {
        this.mainContainer = mainContainer;
        this.popularContainer = popularContainer
        this.upcomingContainer = upcomingContainer
        this.searchedContainer = searchedContainer
        this.searchField = searchField;
        this.searchField.addEventListener('change', () => this.getSearchedMovies(this.searchField.value))
        this.getMoviesSuccessHandler = this.getMoviesSuccessHandler.bind(this);
        this.errorHandler = this.errorHandler.bind(this);
        this.getModalElementsSuccessHandler = this.getModalElementsSuccessHandler.bind(this)
        this.trailerLink = null;
        this.trailerPlayer = document.querySelector('.trailer-player')
        this.movieModal = document.querySelector('.modal');
        this.myApikey1 = myApikey1;
        this.exitModal = this.exitModal.bind(this)
        this.similarMovieContainer = similarMovieContainer;

    }
    getPopularMovies() {
        $.ajax({
            method: "GET",
            url: `https://api.themoviedb.org/3/movie/popular?api_key=${this.myApikey1}&language=en-US&page=1`,
            success: (movies) => this.getMoviesSuccessHandler(movies.results, this.popularContainer),
            error: this.getMoviesErrorHandler
        })
    }


    getMoviesSuccessHandler(movies, container) {
        this.loadMovies(movies, container)
    }

    errorHandler(err) {
        console.error(err)
    }

    getUpcomingMovies() {
        $.ajax({
            method: "GET",
            url: `https://api.themoviedb.org/3/movie/upcoming?api_key=${this.myApikey1}&language=en-US&page=1`,
            success: (movies) => this.getMoviesSuccessHandler(movies.results, this.upcomingContainer),
            error: this.getPopularErrorHandler
        })
    }

    getSearchedMovies(title) {
        this.searchedContainer.textContent = " ";
        $.ajax({
            method: "GET",
            url: `https://api.themoviedb.org/3/search/movie?api_key=${this.myApikey1}&append_to_response=people&query=${title}`,
            success: (movies) => this.getMoviesSuccessHandler(movies.results, this.searchedContainer),
            error: this.getPopularErrorHandler
        })
        this.searchField.value = " ";
    }

    loadMovies(movies, container) {
        container.textContent = " "
        movies.forEach((movie) => {
            var movieCard = document.createElement('div');
            var moviePoster = document.createElement('img');
            //debugger
            movieCard.classList.add('cards')
            moviePoster.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            moviePoster.title = movie.title
            moviePoster.dataset.movieId = movie.id
            movieCard.append(moviePoster)
            movieCard.addEventListener('click', (e)=>this.showModal(e))

            if(movie.poster_path){
                container.append(movieCard);
            }
        })
    }

    getModalElements(movieId) {

        $.ajax({
            method: "GET",
            url: `http://api.themoviedb.org/3/movie/${movieId}?api_key=${this.myApikey1}&language=en-US&append_to_response=videos,similar`,
            success: (response) =>{ this.getModalElementsSuccessHandler(response)
            console.log(response) },
            error: this.getMoviesErrorHandler
        })
    }

    getModalElementsSuccessHandler(response) {
        if(response.videos.results[0]){
            this.trailerLink = `https://www.youtube.com/embed/${response.videos.results[0].key}`
            this.trailerPlayer.setAttribute('src', this.trailerLink);
        }
        var movieOverview = document.querySelector('.movie-overview');
        var releaseDate = document.getElementById('release-date');
        var averageRate = document.getElementById('average-rating');
        console.log(response);
        movieOverview.textContent = response.overview;
        releaseDate.textContent = response.release_date;
        averageRate.textContent = `Average ratings: ${response.vote_average} (${response.vote_count} votes)`;
        this.loadMovies(response.similar.results, this.similarMovieContainer)
    }

    showModal(e){
        console.log(e.target)
        var exitButton = document.querySelector('.modal-exit');
        exitButton.addEventListener('click', this.exitModal);
        this.movieModal.classList.remove('hidden');
        this.getModalElements(e.target.dataset.movieId);
       // this.getTrailerLink()
    }
    exitModal(){
        this.similarMovieContainer.textContent = " ";
        this.movieModal.classList.add('hidden');
        this.trailerPlayer.setAttribute('src', null);
    }

}
